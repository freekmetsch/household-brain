// Scene composition over the shared flat-silhouette library (POSTER_GEOMETRY).
// Round 3 of the shotgun: instead of recolouring line work, each set stages
// the same silhouettes in a different Haugomat poster construction — sun
// behind the subject, framed mini-poster, long shadow, stencil knockout, lake
// reflection, day/night split, dusk bands, tiny-figure vastness.
//
// Silhouette parts come back in three kinds: `subject` (the ink mass),
// `accent` (the one pop detail — steam, wheels, a lit door), `knock`
// (interior detail drawn in a quieter tone on top of the subject). Sets remap
// those kinds to their own palettes. `pot`'s steam parts are always the last
// two, so the Spinner contract survives every composition.

import type { IconDef, IconName, IconPathDef } from '../paths';
import { POSTER_GEOMETRY } from './poster';
import { transformPath } from './transform';

export type PartKind = 'subject' | 'accent' | 'knock';
export interface SilPart {
	kind: PartKind;
	d: string;
}

/** Per-icon kind remaps (indexed over the icon's non-field parts) for icons
 *  whose poster slots don't translate 1:1 into a flat single-ink silhouette
 *  (e.g. warn's bang must not vanish into its own triangle). */
const KIND_OVERRIDES: Partial<Record<IconName, readonly PartKind[]>> = {
	warn: ['subject', 'knock', 'knock'],
	clock: ['subject', 'knock'],
	flame: ['subject', 'knock'],
	pan: ['subject', 'knock', 'subject'],
	carrot: ['accent', 'accent', 'subject', 'knock']
};

const DEFAULT_KIND: Record<string, PartKind | null> = {
	field: null,
	subject: 'subject',
	mid: 'subject',
	accent: 'accent',
	knock: 'knock'
};

/** The icon's silhouette parts, optionally scaled/translated (x' = s·x + dx). */
export function silhouette(name: IconName, s = 1, dx = 0, dy = 0): SilPart[] {
	const parts = POSTER_GEOMETRY[name].filter(([slot]) => slot !== 'field');
	const kinds = KIND_OVERRIDES[name];
	return parts.map(([slot, d], i) => ({
		kind: kinds?.[i] ?? (DEFAULT_KIND[slot] as PartKind),
		d: s === 1 && dx === 0 && dy === 0 ? d : transformPath(d, s, dx, dy)
	}));
}

/** Raw part path data (all kinds merged), for knockout compositions. */
export function silhouetteData(name: IconName): string[] {
	return POSTER_GEOMETRY[name].filter(([slot]) => slot !== 'field').map(([, d]) => d);
}

/** Full-bleed rounded-square scene tile. */
export const SQUIRCLE =
	'M7 2.6h10a4.4 4.4 0 0 1 4.4 4.4v10a4.4 4.4 0 0 1-4.4 4.4H7A4.4 4.4 0 0 1 2.6 17V7A4.4 4.4 0 0 1 7 2.6Z';

/** Right half of the scene tile (straight left edge). */
export const SQUIRCLE_RIGHT =
	'M12 2.6h5a4.4 4.4 0 0 1 4.4 4.4v10a4.4 4.4 0 0 1-4.4 4.4h-5V2.6Z';

/** Bottom band of the scene tile (rounded bottom corners). */
export const SQUIRCLE_BOTTOM = (top: number) =>
	`M2.6 ${top}h18.8V17a4.4 4.4 0 0 1-4.4 4.4H7A4.4 4.4 0 0 1 2.6 17V${top}Z`;

export const fillPath = (d: string, color: string, opacity?: number): IconPathDef =>
	opacity == null ? { d, fill: true, color } : { d, fill: true, color, opacity };

/** Build a full set from a per-icon path composer. */
export function buildScene(
	compose: (name: IconName) => IconPathDef[]
): Record<IconName, IconDef> {
	const out = {} as Record<IconName, IconDef>;
	for (const name of Object.keys(POSTER_GEOMETRY) as IconName[]) {
		out[name] = { viewBox: '0 0 24 24', sw: 1.4, paths: compose(name) };
	}
	return out;
}
