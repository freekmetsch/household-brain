import { and, eq, sql } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '$lib/server/db/schema';

type DB = BetterSQLite3Database<typeof schema>;
type RecipeInsert = typeof schema.recipes.$inferInsert;

export type CanonicalRecipeUpdate = Partial<
	Pick<
		RecipeInsert,
		| 'title'
		| 'category'
		| 'tags'
		| 'servings'
		| 'scalingMode'
		| 'structureVersion'
		| 'structureDraft'
		| 'structureDraftSourceUpdatedAt'
		| 'totalTimeMin'
		| 'sourceUrl'
		| 'ingredients'
		| 'directions'
		| 'notes'
		| 'rating'
		| 'cuisine'
		| 'language'
		| 'needsReview'
		| 'reviewReason'
		| 'cookModeJson'
		| 'cookModeGeneratedAt'
		| 'titleEn'
		| 'categoryEn'
		| 'cuisineEn'
		| 'notesEn'
		| 'ingredientsEn'
		| 'directionsEn'
		| 'translationStatus'
		| 'translatedAt'
	>
>;

/**
 * The sole update seam for canonical recipe content. The compare-and-swap on
 * contentRevision prevents stale writers, while SQL arithmetic guarantees a
 * distinct revision even when several writes share one clock tick.
 */
export function updateCanonicalRecipe(
	db: DB,
	options: {
		recipeId: number;
		expectedRevision: number;
		changes: CanonicalRecipeUpdate;
		now?: Date;
	}
): typeof schema.recipes.$inferSelect | undefined {
	return db
		.update(schema.recipes)
		.set({
			...options.changes,
			contentRevision: sql`${schema.recipes.contentRevision} + 1`,
			updatedAt: options.now ?? new Date()
		})
		.where(
			and(
				eq(schema.recipes.id, options.recipeId),
				eq(schema.recipes.contentRevision, options.expectedRevision)
			)
		)
		.returning()
		.get();
}
