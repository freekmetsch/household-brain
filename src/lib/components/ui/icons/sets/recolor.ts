// Recolour machinery for the colour-exploration sets: they reuse ATELIER's
// engraved drawings (the geometry Freek already picked as the winner) and vary
// only where the colour lives — accents, backdrops, glows, overprints. Keeps
// every colour set automatically in sync with the winning line work.

import type { IconDef, IconName, IconPathDef } from '../paths';
import { toPathDef } from '../paths';
import { ATELIER } from './atelier';

/** Path indices in ATELIER that carry each icon's *detail* (ticks, steam,
 *  seeds, scores…). Everything else is the body. Icons not listed are
 *  single-voice and take the body colour throughout. */
export const ATELIER_DETAIL: Partial<Record<IconName, readonly number[]>> = {
	trash: [3, 4],
	warn: [1, 2],
	clock: [1, 2, 3, 4],
	clipboard: [2, 3, 4],
	copy: [1],
	cart: [1, 2],
	calendar: [1, 2, 4],
	home: [2],
	box: [3],
	book: [2, 3],
	settings: [2, 3],
	chefHat: [2],
	basket: [3, 4],
	jar: [3],
	pot: [3, 4],
	pan: [2],
	carrot: [3, 4],
	egg: [1],
	flame: [1],
	snowflake: [3],
	leaf: [1, 2],
	plate: [1, 2],
	bread: [1, 2, 3],
	apple: [1, 2]
};

export interface RepaintRule {
	/** Stroke colour for body paths. */
	body: string | ((name: IconName) => string);
	/** Stroke colour for detail paths (per ATELIER_DETAIL); defaults to body. */
	detail?: string | ((name: IconName) => string);
	/** Override the set-wide stroke width. */
	sw?: number;
	/** Extra filled/stroked paths laid *under* each glyph (backdrop tiles). */
	under?: (name: IconName) => readonly IconPathDef[];
	/** Duplicate every glyph path underneath with these overrides (glow /
	 *  overprint ghost). `pot`'s steam pair is never ghosted so the Spinner's
	 *  last-two-paths contract keeps holding. */
	ghost?: (name: IconName) => { color: string; swAdd: number; opacity: number };
}

const pick = (v: string | ((name: IconName) => string), name: IconName) =>
	typeof v === 'function' ? v(name) : v;

export function repaintAtelier(rule: RepaintRule): Record<IconName, IconDef> {
	const out = {} as Record<IconName, IconDef>;
	for (const name of Object.keys(ATELIER) as IconName[]) {
		const def: IconDef = ATELIER[name];
		const detailIdx = ATELIER_DETAIL[name] ?? [];
		const bodyColor = pick(rule.body, name);
		const detailColor = rule.detail ? pick(rule.detail, name) : bodyColor;
		const sw = rule.sw ?? def.sw;

		const glyph = def.paths.map((p, i): IconPathDef => {
			const pd = toPathDef(p);
			return { ...pd, color: detailIdx.includes(i) ? detailColor : bodyColor };
		});

		const paths: IconPathDef[] = [...(rule.under?.(name) ?? [])];
		if (rule.ghost) {
			const g = rule.ghost(name);
			// Skip the steam pair on `pot` so its last two paths stay the steam.
			const ghostable = name === 'pot' ? glyph.slice(0, -2) : glyph;
			for (const pd of ghostable) {
				if (pd.fill) continue;
				paths.push({ d: pd.d, color: g.color, sw: (pd.sw ?? sw) + g.swAdd, opacity: g.opacity });
			}
		}
		paths.push(...glyph);

		out[name] = { ...def, sw, paths };
	}
	return out;
}

/** Recolour a fill-based set (Coin) to a fixed paint per icon. */
export function tintFills(
	base: Record<IconName, IconDef>,
	color: Record<IconName, string>
): Record<IconName, IconDef> {
	const out = {} as Record<IconName, IconDef>;
	for (const name of Object.keys(base) as IconName[]) {
		const def = base[name];
		out[name] = {
			...def,
			paths: def.paths.map((p): IconPathDef => ({ ...toPathDef(p), color: color[name] }))
		};
	}
	return out;
}
