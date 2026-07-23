import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as schema from '$lib/server/db/schema';
import { beginChatTurn } from './chat_activity';
import { recentChatPage } from './recent_chat';

describe('recentChatPage', () => {
	let sqlite: Database.Database;
	let db: ReturnType<typeof drizzle<typeof schema>>;

	beforeEach(() => {
		sqlite = new Database(':memory:');
		sqlite.exec(`
			CREATE TABLE chat_messages (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				user_id INTEGER NOT NULL,
				role TEXT NOT NULL,
				content TEXT NOT NULL,
				tool_calls TEXT,
				created_at INTEGER NOT NULL
			)
		`);
		db = drizzle(sqlite, { schema });
	});

	afterEach(() => sqlite.close());

	it('derives a recoverable assistant error after an orphaned user row', () => {
		db.insert(schema.chatMessages)
			.values({ userId: 1, role: 'user', content: 'Try this', createdAt: new Date() })
			.run();

		const page = recentChatPage(db, 1);

		expect(page.messages.at(-1)).toMatchObject({
			role: 'assistant',
			errorCode: 'interrupted_turn'
		});
	});

	it('does not call an actively streaming row orphaned', () => {
		db.insert(schema.chatMessages)
			.values({ userId: 2, role: 'user', content: 'Still running', createdAt: new Date() })
			.run();
		const end = beginChatTurn(2);

		expect(recentChatPage(db, 2).messages).toHaveLength(1);
		end();
		expect(recentChatPage(db, 2).messages).toHaveLength(2);
	});

	it('reports when older messages exist outside the visible window', () => {
		for (let index = 0; index < 21; index++) {
			db.insert(schema.chatMessages)
				.values({
					userId: 3,
					role: index % 2 === 0 ? 'user' : 'assistant',
					content: String(index),
					createdAt: new Date(index * 1000)
				})
				.run();
		}

		const page = recentChatPage(db, 3, 20);

		expect(page.hasOlder).toBe(true);
		expect(page.visibleLimit).toBe(20);
		expect(page.messages).toHaveLength(21);
	});
});
