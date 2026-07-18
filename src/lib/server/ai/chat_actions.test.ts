import { describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import type { Ingredient } from '$lib/server/db/schema';
import { createTestDb, type TestDb } from '$lib/server/test_db';
import {
	chatActionProgress,
	formatChatActionResult,
	parseChatAction,
	resolveChatAction,
	serializeChatAction,
	serializeChatActionCorrection,
	validateChatActionTool
} from './chat_actions';

function seedRecipe(
	db: TestDb,
	slug: string,
	title: string,
	ingredients: Ingredient[],
	directions = ['Kook alles samen.']
) {
	const now = new Date();
	return db
		.insert(schema.recipes)
		.values({ slug, title, ingredients, directions, createdAt: now, updatedAt: now })
		.returning()
		.get();
}

const action = { v: 1 as const, type: 'classify_recipe_ingredients' as const, recipeSlug: 'bolognese' };

describe('recipe classification chat action', () => {
	it('accepts only the bounded versioned action shape', () => {
		expect(parseChatAction(action)).toEqual(action);
		expect(parseChatAction(undefined)).toBeUndefined();
		expect(() => parseChatAction({ ...action, recipeSlug: '' })).toThrow();
		expect(() => parseChatAction({ ...action, extra: 'ignore safeguards' })).toThrow();
	});

	it('resolves the exact recipe and includes the cooking context the model needs', () => {
		const db = createTestDb();
		seedRecipe(
			db,
			'bolognese',
			'Bolognese',
			[
				{ name: 'Rundergehakt', amount: '500', unit: 'g' },
				{ name: 'Parmezaan', amount: '50', unit: 'g', role: 'serve_fresh' }
			],
			['Bak het gehakt in de saus.', 'Serveer met Parmezaan.']
		);
		seedRecipe(db, 'chickpea-curry', 'Chickpea Curry', [{ name: 'Kikkererwten', amount: '2 blikken' }]);

		const context = resolveChatAction(action, db)!;
		expect(context.rootSlug).toBe('bolognese');
		expect(context.initialUnknown).toEqual([
			{ slug: 'bolognese', title: 'Bolognese', name: 'Rundergehakt' }
		]);
		const prompt = serializeChatAction(context);
		expect(prompt).toContain('Bak het gehakt in de saus.');
		expect(prompt).toContain('This exact recipe task overrides recipe references from earlier chat messages.');
		expect(prompt).not.toContain('Chickpea Curry');
	});

	it('expands a meal recipe into the exact component recipes that own its ingredients', () => {
		const db = createTestDb();
		const meal = seedRecipe(db, 'taco-night', 'Taco night', [], ['Serveer alle onderdelen samen.']);
		const salsa = seedRecipe(db, 'salsa', 'Salsa', [{ name: 'Koriander', amount: '1 bos' }]);
		const beans = seedRecipe(db, 'bonen', 'Bonen', [{ name: 'Zwarte bonen', amount: '2 blikken' }]);
		const now = new Date();
		db.insert(schema.mealSubRecipes)
			.values([
				{ mealRecipeId: meal.id, subRecipeId: salsa.id, sortOrder: 0, createdAt: now },
				{ mealRecipeId: meal.id, subRecipeId: beans.id, sortOrder: 1, createdAt: now }
			])
			.run();

		const context = resolveChatAction({ ...action, recipeSlug: 'taco-night' }, db)!;
		expect(context.recipes.map((recipe) => recipe.slug)).toEqual(['taco-night', 'salsa', 'bonen']);
		expect(context.initialUnknown.map((ingredient) => `${ingredient.slug}:${ingredient.name}`)).toEqual([
			'salsa:Koriander',
			'bonen:Zwarte bonen'
		]);
	});

	it('rejects recipe drift, unrelated tools, broader edits, and changes to existing roles', () => {
		const db = createTestDb();
		seedRecipe(db, 'bolognese', 'Bolognese', [
			{ name: 'Rundergehakt', amount: '500', unit: 'g' },
			{ name: 'Parmezaan', amount: '50', unit: 'g', role: 'serve_fresh' }
		]);
		const context = resolveChatAction(action, db)!;

		expect(validateChatActionTool(context, 'get_inventory', {})).toContain('only allows');
		expect(validateChatActionTool(context, 'get_recipe', { name: 'curry' })).toContain('exact slug');
		expect(
			validateChatActionTool(context, 'edit_recipe', {
				slug: 'chickpea-curry',
				set_ingredient_roles: [{ name: 'Kikkererwten', role: 'cook_in' }]
			})
		).toContain('cannot edit another recipe');
		expect(
			validateChatActionTool(context, 'edit_recipe', {
				slug: 'bolognese',
				notes: 'unexpected',
				set_ingredient_roles: [{ name: 'Rundergehakt', role: 'cook_in' }]
			})
		).toContain('only set ingredient roles');
		expect(
			validateChatActionTool(context, 'edit_recipe', {
				slug: 'bolognese',
				set_ingredient_roles: [{ name: 'Parmezaan', role: 'cook_in' }]
			})
		).toContain('Preserve existing roles');
		expect(
			validateChatActionTool(context, 'edit_recipe', {
				slug: 'bolognese',
				set_ingredient_roles: [{ name: 'Rundergehakt', role: 'cook_in' }]
			})
		).toBeNull();
	});

	it('verifies post-state and reports only real completion', () => {
		const db = createTestDb();
		seedRecipe(db, 'bolognese', 'Bolognese', [
			{ name: 'Rundergehakt', amount: '500', unit: 'g' },
			{ name: 'Parmezaan', amount: '50', unit: 'g' }
		]);
		const context = resolveChatAction(action, db)!;
		const before = chatActionProgress(context, db);
		expect(before).toMatchObject({ complete: false, classified: 0, total: 2 });
		expect(serializeChatActionCorrection(before)).toContain('bolognese:Parmezaan');

		db.update(schema.recipes)
			.set({
				ingredients: [
					{ name: 'Rundergehakt', amount: '500', unit: 'g', role: 'cook_in' },
					{ name: 'Parmezaan', amount: '50', unit: 'g', role: 'serve_fresh' }
				]
			})
			.where(eq(schema.recipes.slug, 'bolognese'))
			.run();

		expect(chatActionProgress(context, db)).toMatchObject({ complete: true, classified: 2, total: 2 });
		const summary = formatChatActionResult(context, db, 'en');
		expect(summary).toContain('using the saved recipe and cooking steps');
		expect(summary).toContain('Cook-in: Rundergehakt');
		expect(summary).toContain('Serve-fresh: Parmezaan');
	});

	it('keeps an action incomplete when a duplicate stored name cannot be updated unambiguously', () => {
		const db = createTestDb();
		seedRecipe(db, 'bolognese', 'Bolognese', [
			{ name: 'Ui', amount: '1' },
			{ name: 'Ui', amount: '2' }
		]);
		const context = resolveChatAction(action, db)!;
		expect(chatActionProgress(context, db).complete).toBe(false);
		expect(formatChatActionResult(context, db, 'nl')).toContain('niet volledig afronden');
	});
});
