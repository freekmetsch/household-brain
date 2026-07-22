import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db/index';
import { readJsonBody } from '$lib/server/api_body';
import { applyShoppingRecipeChoice } from '$lib/server/shopping_recipe_choice';
import { ShoppingMutationError } from '$lib/server/shopping_mutations';

const BodySchema = z.object({
	entryId: z.number().int().positive(),
	expectedEntryRevision: z.number().int().positive(),
	expectedRecipeRevision: z.number().int().positive(),
	need: z.enum(['required', 'optional', 'stocked']),
	term: z.string().min(1).max(256),
	useInRecipe: z.boolean()
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');
	const input = await readJsonBody(request, BodySchema);
	try {
		return json(applyShoppingRecipeChoice(db, { ...input, actor: locals.user.username, userId: locals.user.id }));
	} catch (cause) {
		if (!(cause instanceof ShoppingMutationError)) throw cause;
		error(cause.code === 'stale' ? 409 : cause.code === 'not_found' ? 404 : 400, cause.message);
	}
};
