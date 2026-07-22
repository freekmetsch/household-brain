import { z } from 'zod';
import { and, gte, lt } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { deriveWeekNeeds } from '$lib/server/shopping_needs';
import { initializeShoppingSourceData, materializeShoppingWeek } from '$lib/server/shopping_entries';
import { getShoppingWeekView } from '$lib/server/shopping_view';
import { getWeekStartDay } from '$lib/server/meal_plan/prefs';
import { todayIso, weekKeyRange, weekStartFor } from '$lib/week';
import { isoDateSchema } from '$lib/date_schema';
import type { ExecutorFn } from './shared';

export const shoppingExecutors: Record<string, ExecutorFn> = {
	async generate_shopping_list(raw, db) {
		const input = z.object({ week_start_date: isoDateSchema.optional() }).parse(raw);
		// Household planning-week boundary + range query, mirroring the shopping
		// page load: meals keyed under an older week-start convention still count.
		const weekStartDay = getWeekStartDay(db);
		const weekStart = weekStartFor(input.week_start_date ?? todayIso(), weekStartDay);
		const keyRange = weekKeyRange(weekStart);

		const meals = db
			.select()
			.from(schema.mealPlanMeals)
			.where(
				and(
					gte(schema.mealPlanMeals.weekStartDate, keyRange.from),
					lt(schema.mealPlanMeals.weekStartDate, keyRange.to)
				)
			)
			.all();

		// Shared freezer-aware derivation (same seam as the shopping page): fresh
		// meals need everything, freezer-served meals only their serve_fresh
		// sides, and role-less freezer recipes are reported instead of guessed.
		const needs = deriveWeekNeeds(db, meals);

		initializeShoppingSourceData(db);
		materializeShoppingWeek(db, weekStart, { weekStartDay });
		const shopping = getShoppingWeekView(db, weekStart);
		const freshSideSourceKeys = new Set<string>(
			needs.needed.flatMap((need) =>
				need.freshSideOnly ? need.sources.map((source) => source.ref.key) : []
			)
		);
		const missing = shopping.toBuy
			.filter((row) => !row.covered)
			.map((row) => ({
				source_name: row.sources[0]?.name ?? row.name,
				name: row.name,
				amount: row.amount,
				unit: row.unit,
				for_meals: [...new Set(row.sources.flatMap((source) => source.mealNames))],
				fresh_side_for_freezer_meal:
					row.sources.length > 0 && row.sources.every((source) => freshSideSourceKeys.has(source.sourceKey)),
				incompatible_quantities: row.incompatibleQuantities
			}));

		const freezerNote = needs.freezerMealsMissingFreshInfo.length
			? ` ${needs.freezerMealsMissingFreshInfo.length} freezer meal(s) lack cook_in/serve_fresh ingredient roles, so their fresh sides are unknown — offer to set roles on those recipes.`
			: '';

		return {
			week: weekStart,
			shopping_list: missing,
			meals_without_recipe: needs.mealsWithoutRecipe,
			freezer_meals: needs.freezerMeals,
			freezer_meals_missing_fresh_info: needs.freezerMealsMissingFreshInfo,
			note: `${meals.length} meals planned. ${missing.length} ingredients needed.${freezerNote}`
		};
	}
};
