// Recipe ↔ inventory link derivation (Phase 4, ADR 0001). Read-only helpers
// shared by the inventory page, recipe detail page, recipes list, and the
// serve-fresh shopping projection.
//
// AH-INVARIANT: every name this module emits toward shopping/AH is the Dutch
// `recipes.ingredients[].name`; English recipe fields (titleEn, ingredientsEn)
// are display-only and never feed matching or the shopping list.
import { and, eq, inArray, isNotNull, isNull } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '$lib/server/db/schema';
import type { Ingredient } from '$lib/server/db/schema';
import { titlesMatch } from '$lib/match';
import { inferFoodClassFromName, normalizeFoodClass } from '$lib/food_class';
import { expandMealIngredients, type SubRecipeRef } from '$lib/server/meal_recipes';

type DB = BetterSQLite3Database<typeof schema>;
type Recipe = typeof schema.recipes.$inferSelect;

/** Recipe-title source for name matching + suggestions (Dutch title + English cache). */
export type RecipeTitleRow = { id: number; slug: string; title: string; titleEn: string | null };

/**
 * Frozen portions on hand per recipe id: the summed `qtyNum` of every
 * non-deleted leftover linked to that recipe. Feeds the freezer-staple target
 * chips (current vs target) on both the stock and recipe pages.
 */
export function frozenPortionsByRecipe(db: DB): Map<number, number> {
	const rows = db
		.select({
			recipeId: schema.inventoryItems.madeFromRecipeId,
			qtyNum: schema.inventoryItems.qtyNum
		})
		.from(schema.inventoryItems)
		.where(
			and(
				isNull(schema.inventoryItems.deletedAt),
				eq(schema.inventoryItems.kind, 'leftover'),
				eq(schema.inventoryItems.section, 'freezer'),
				isNotNull(schema.inventoryItems.madeFromRecipeId)
			)
		)
		.all();

	const portions = new Map<number, number>();
	for (const row of rows) {
		if (row.recipeId == null) continue;
		portions.set(row.recipeId, (portions.get(row.recipeId) ?? 0) + (row.qtyNum ?? 0));
	}
	return portions;
}

export type IngredientRoleCoverage = {
	total: number;
	classified: number;
	unknownNames: string[];
	complete: boolean;
};

/** Exact role coverage for the expanded Dutch ingredient list. */
export function ingredientRoleCoverage(ingredients: Ingredient[]): IngredientRoleCoverage {
	const relevant = ingredients.filter((ingredient) => ingredient.name.trim().length > 0);
	const unknownNames = relevant
		.filter((ingredient) => ingredient.role !== 'cook_in' && ingredient.role !== 'serve_fresh')
		.map((ingredient) => ingredient.name);
	return {
		total: relevant.length,
		classified: relevant.length - unknownNames.length,
		unknownNames,
		complete: relevant.length > 0 && unknownNames.length === 0
	};
}

export function expandedIngredientRoleCoverage(
	db: DB,
	recipe: { id: number; ingredients: unknown },
	subRecipes?: SubRecipeRef[]
): IngredientRoleCoverage {
	return ingredientRoleCoverage(expandMealIngredients(db, recipe, subRecipes));
}

/**
 * Derive a food-class slug for a recipe: prefer its `category` when that maps
 * to a known class, else infer from the first ingredient name that resolves.
 * Recipes have no facet column (ADR 0001 facets are inventory-only), so this
 * derivation powers the P4.5 rolling-up Food Class filter without a migration.
 */
export function recipeFoodClass(recipe: Pick<Recipe, 'category' | 'ingredients'>): string | null {
	const fromCategory = normalizeFoodClass(recipe.category);
	if (fromCategory) return fromCategory;
	const ings = (recipe.ingredients as Ingredient[]) ?? [];
	for (const ing of ings) {
		const inferred = inferFoodClassFromName(ing.name);
		if (inferred) return inferred;
	}
	return null;
}

export type RecipeSuggestion = { id: number; slug: string; title: string };

/**
 * Link suggestions for an unlinked leftover (G10): recipes whose title matches
 * the leftover name under the strict token-subset rule (UX-STOCK-3 — "katsu
 * curry" must not suggest "chickpea spinach curry" on the shared "curry"
 * token). Title match is display-side (leftover names are dish names, not AH
 * ingredients), so matching against titleEn is fine. `id` lets the stock page
 * link the leftover in place (P6.1) instead of navigating away.
 */
export function recipeSuggestionsForName(
	name: string,
	recipes: RecipeTitleRow[],
	limit = 3
): RecipeSuggestion[] {
	return recipes
		.filter((r) => titlesMatch(name, r.title) || (r.titleEn ? titlesMatch(name, r.titleEn) : false))
		.slice(0, limit)
		.map((r) => ({ id: r.id, slug: r.slug, title: r.titleEn ?? r.title }));
}

/** Lightweight recipe-title rows for suggestion matching. */
export function recipeTitleRows(db: DB): RecipeTitleRow[] {
	return db
		.select({
			id: schema.recipes.id,
			slug: schema.recipes.slug,
			title: schema.recipes.title,
			titleEn: schema.recipes.titleEn
		})
		.from(schema.recipes)
		.all();
}

/** Resolve freezer-staple metadata for a set of linked recipe ids. */
export type FreezerStapleInfo = {
	isFreezerStaple: boolean;
	targetPortions: number | null;
	onHandPortions: number;
};

export function freezerStapleInfoByRecipe(
	db: DB,
	recipeIds: number[],
	precomputedOnHand?: Map<number, number>
): Map<number, FreezerStapleInfo> {
	const info = new Map<number, FreezerStapleInfo>();
	if (recipeIds.length === 0) return info;
	const onHand = precomputedOnHand ?? frozenPortionsByRecipe(db);
	const rows = db
		.select({
			id: schema.recipes.id,
			isFreezerStaple: schema.recipes.isFreezerStaple,
			targetPortions: schema.recipes.targetPortions
		})
		.from(schema.recipes)
		.where(inArray(schema.recipes.id, recipeIds))
		.all();
	for (const row of rows) {
		info.set(row.id, {
			isFreezerStaple: row.isFreezerStaple,
			targetPortions: row.targetPortions,
			onHandPortions: onHand.get(row.id) ?? 0
		});
	}
	return info;
}

/** A keep-stocked recipe with no live meal row — rendered as a ghost "cook again" row. */
export type StapleGhost = { recipeId: number; slug: string; title: string; target: number | null };

/**
 * Freezer-staple recipes with no live linked leftover row. The Meals shelf
 * renders these as recipe-derived ghost rows ("0 / N portions · cook again") so
 * the restock cue survives the last row's deletion (UX-STOCK-14; replaces the
 * P6.2 restock strip). English display title.
 */
export function stapleGhostRows(db: DB, liveLinkedRecipeIds: Set<number>): StapleGhost[] {
	return db
		.select({
			id: schema.recipes.id,
			slug: schema.recipes.slug,
			title: schema.recipes.title,
			titleEn: schema.recipes.titleEn,
			targetPortions: schema.recipes.targetPortions
		})
		.from(schema.recipes)
		.where(eq(schema.recipes.isFreezerStaple, true))
		.all()
		.filter((r) => !liveLinkedRecipeIds.has(r.id))
		.map((r) => ({
			recipeId: r.id,
			slug: r.slug,
			title: r.titleEn ?? r.title,
			target: r.targetPortions
		}))
		.sort((a, b) => a.title.localeCompare(b.title, 'en'));
}
