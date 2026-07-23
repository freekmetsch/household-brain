import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { checkDailyCap } from '$lib/server/ai/client';
import { recentChatPage } from '$lib/server/ai/recent_chat';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	const history = recentChatPage(db, locals.user.id);
	const cap = checkDailyCap();
	return json({
		...history,
		capExceeded: cap.exceeded,
		capEur: cap.capEur
	});
};
