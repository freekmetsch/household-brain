import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';
import { repairShopping0020Draft } from './compatibility';

describe('0020 draft compatibility', () => {
	it('adds the two missing columns once without changing rows', () => {
		const sqlite = new Database(':memory:');
		sqlite.exec('CREATE TABLE shopping_week_entries (id integer PRIMARY KEY, name text NOT NULL); INSERT INTO shopping_week_entries (id, name) VALUES (1, \'ui\')');
		expect(repairShopping0020Draft(sqlite)).toEqual(['amount_override', 'unit_override']);
		expect(repairShopping0020Draft(sqlite)).toEqual([]);
		expect(sqlite.prepare('SELECT id, name, amount_override, unit_override FROM shopping_week_entries').get()).toEqual({ id: 1, name: 'ui', amount_override: null, unit_override: null });
	});

	it('does nothing before 0020 creates the table', () => {
		const sqlite = new Database(':memory:');
		expect(repairShopping0020Draft(sqlite)).toEqual([]);
	});
});
