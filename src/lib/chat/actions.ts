export type RecipeRoleClassificationActionV1 = {
	v: 1;
	type: 'classify_recipe_ingredients';
	recipeSlug: string;
};

/**
 * A bounded, typed command started by a contextual UI action. This is separate
 * from screen context: screen context helps free-form conversation, while an
 * action names the exact resource and mutation the user requested.
 */
export type ChatActionV1 = RecipeRoleClassificationActionV1;
