import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { and, desc, eq, gte, inArray, lt } from 'drizzle-orm';
import { db } from '$lib/server/db/index';
import * as schema from '$lib/server/db/schema';
import { deriveWeekNeeds } from '$lib/server/shopping_needs';
import { getAHStatus } from '$lib/server/ah/client';
import { getMealPlanPrefs } from '$lib/server/meal_plan/prefs';
import { addDays, deliveryDateForPlanningWeek, isIsoDate, todayIso, weekKeyRange, weekStartFor } from '$lib/week';
import type { ShoppingListItem } from '$lib/components/shopping/types';
import { initializeShoppingSourceData, materializeShoppingWeek } from '$lib/server/shopping_entries';
import { getShoppingWeekView } from '$lib/server/shopping_view';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) redirect(302, '/login');
	initializeShoppingSourceData(db);
	const prefs = getMealPlanPrefs();
	const weekParam = url.searchParams.get('week');
	const weekStart = weekStartFor(isIsoDate(weekParam) ? weekParam : todayIso(), prefs.weekStartDay);
	materializeShoppingWeek(db, weekStart, { weekStartDay: prefs.weekStartDay });

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
	const needs = deriveWeekNeeds(db, meals);
	const shopping = getShoppingWeekView(db, weekStart);
	const items: ShoppingListItem[] = [...shopping.toBuy, ...shopping.done].map((row) => ({
		name: row.name,
		amount: row.amount,
		unit: row.unit,
		bought: row.bought,
		manual: row.sources.every((source) => source.sourceKind === 'manual'),
		included: true,
		selectedName: row.name,
		covered: row.covered,
		incompatibleQuantities: row.incompatibleQuantities,
		entryIds: row.entryIds,
		sources: row.sources
	}));

	const pushRows = db
		.select()
		.from(schema.shoppingPushHistory)
		.where(eq(schema.shoppingPushHistory.weekStartDate, weekStart))
		.orderBy(desc(schema.shoppingPushHistory.createdAt))
		.limit(5)
		.all();
	const pushIds = pushRows.map((row) => row.id);
	const pushItems = pushIds.length
		? db.select().from(schema.shoppingPushItems).where(inArray(schema.shoppingPushItems.pushId, pushIds)).all()
		: [];
	const pushItemsById = new Map<number, typeof pushItems>();
	for (const item of pushItems) {
		if (!pushItemsById.has(item.pushId)) pushItemsById.set(item.pushId, []);
		pushItemsById.get(item.pushId)!.push(item);
	}

	return {
		weekStart,
		prevWeek: addDays(weekStart, -7),
		nextWeek: addDays(weekStart, 7),
		isCurrentWeek: weekStart === weekStartFor(todayIso(), prefs.weekStartDay),
		deliveryDate: prefs.groceryDay == null
			? null
			: deliveryDateForPlanningWeek(weekStart, prefs.groceryDay, prefs.weekStartDay),
		emptyState: meals.length === 0 ? 'no_meals' : 'nothing_needed',
		ah: getAHStatus(),
		items,
		sources: shopping.sources,
		recurring: shopping.recurring,
		legacy: shopping.legacy,
		mealsWithoutRecipe: needs.mealsWithoutRecipe,
		freezerMeals: needs.freezerMeals,
		freezerMealsMissingFreshInfo: needs.freezerMealsMissingFreshInfo,
		pushHistory: pushRows.map((row) => ({ ...row, items: pushItemsById.get(row.id) ?? [] }))
	};
};
