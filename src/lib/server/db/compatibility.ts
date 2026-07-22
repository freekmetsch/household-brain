import type Database from 'better-sqlite3';

/**
 * Early 0020 rehearsal databases recorded the migration before its two
 * quantity-choice columns were added. SQLite has no conditional ADD COLUMN,
 * so repair that exact draft shape before Drizzle reads the canonical schema.
 */
export function repairShopping0020Draft(sqlite: Database.Database): string[] {
	const table = sqlite.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'shopping_week_entries'").get();
	if (!table) return [];
	const columns = new Set(
		(sqlite.pragma('table_info(shopping_week_entries)') as Array<{ name: string }>).map((column) => column.name)
	);
	const added: string[] = [];
	if (!columns.has('amount_override')) {
		sqlite.exec('ALTER TABLE shopping_week_entries ADD COLUMN amount_override text');
		added.push('amount_override');
	}
	if (!columns.has('unit_override')) {
		sqlite.exec('ALTER TABLE shopping_week_entries ADD COLUMN unit_override text');
		added.push('unit_override');
	}
	return added;
}
