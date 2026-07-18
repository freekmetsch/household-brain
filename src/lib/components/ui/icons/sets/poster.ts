// Poster — flat-fill silhouette set after Tom Haugomat's Huttopia campaign
// posters: every icon is a tiny travel poster inside a full disc, built from
// 2-4 stacked flat shapes with zero outlines. Details are "knocked out" by
// painting field-coloured shapes on top of the silhouette (no even-odd
// gymnastics). One shared geometry, three colourways sampled from the real
// posters (Automne / Hiver / the 2026 nighttime Été key visual).
// Convention: `pot`'s LAST TWO paths are the steam puffs (Spinner contract) —
// they render as filled dots here and as stroked rings inside Spinner.

import type { IconDef, IconName, IconPathDef } from '../paths';

/** Palette slots: field = the poster background disc, subject = the main
 *  silhouette, mid = secondary shape, accent = the one pop colour, knock =
 *  details cut back to the field colour. */
type Slot = 'field' | 'subject' | 'mid' | 'accent' | 'knock';
export type PosterPalette = Record<Exclude<Slot, 'knock'>, string>;

type Part = readonly [Slot, string];

/** Filled circle path centred (cx,cy) radius r. */
const C = (cx: number, cy: number, r: number) =>
	`M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

/** The poster field every icon sits on. */
const FIELD: Part = ['field', C(12, 12, 9.6)];

const G: Record<IconName, readonly Part[]> = {
	plus: [FIELD, ['subject', 'M10.7 5.8h2.6V10.7h4.9v2.6h-4.9v4.9h-2.6v-4.9H5.8v-2.6h4.9V5.8Z']],
	minus: [FIELD, ['subject', 'M5.8 10.7h12.4v2.6H5.8Z']],
	check: [FIELD, ['subject', 'M10.6 16.7 5.9 12l1.8-1.8 2.9 2.9 5.6-6.1 1.9 1.7-7.5 8Z']],
	x: [
		FIELD,
		[
			'subject',
			'M8.1 6.3 12 10.2l3.9-3.9 1.8 1.8-3.9 3.9 3.9 3.9-1.8 1.8-3.9-3.9-3.9 3.9-1.8-1.8 3.9-3.9-3.9-3.9 1.8-1.8Z'
		]
	],
	trash: [
		FIELD,
		['mid', 'M10.5 5.2h3l.4 1h2.7v1.7H7.4V6.2h2.7l.4-1Z'],
		['subject', 'M8.5 8.9h7l-.5 8.2a1 1 0 0 1-1 .9h-4a1 1 0 0 1-1-.9L8.5 8.9Z'],
		['knock', 'M10.5 10.7h1.1v4.5h-1.1Z'],
		['knock', 'M12.4 10.7h1.1v4.5h-1.1Z']
	],
	warn: [
		FIELD,
		['accent', 'M12 4.8 19.2 18H4.8L12 4.8Z'],
		['subject', 'M11.2 9.7h1.6l-.3 3.9h-1l-.3-3.9Z'],
		['subject', C(12, 15.7, 1)]
	],
	clock: [
		FIELD,
		['mid', C(12, 12, 6.9)],
		['subject', 'M11.3 7.7h1.4v4.7l3.1 2.3-.9 1.2-3.6-2.7V7.7Z']
	],
	chevronLeft: [FIELD, ['subject', 'M13.9 5.9 15.8 7.7 11.4 12l4.4 4.3-1.9 1.8L7.7 12l6.2-6.1Z']],
	chevronRight: [FIELD, ['subject', 'M10.1 5.9 8.2 7.7 12.6 12l-4.4 4.3 1.9 1.8 6.2-6.1-6.2-6.1Z']],
	clipboard: [
		FIELD,
		['subject', 'M7.2 5.9h9.6a.9.9 0 0 1 .9.9v10.6a.9.9 0 0 1-.9.9H7.2a.9.9 0 0 1-.9-.9V6.8a.9.9 0 0 1 .9-.9Z'],
		['mid', 'M9.7 4.4h4.6v2.5H9.7Z'],
		['knock', 'M9.1 9.9h5.8v1.2H9.1Z'],
		['knock', 'M9.1 12.5h5.8v1.2H9.1Z'],
		['knock', 'M9.1 15.1h3.6v1.2H9.1Z']
	],
	copy: [
		FIELD,
		['mid', 'M6.5 5.8h7.7v1.9H8.4v5.8H6.5V5.8Z'],
		['subject', 'M9.9 9.2h7.6v9H9.9Z']
	],
	cart: [
		FIELD,
		['subject', 'M5.9 6.6h2.3l.4 1.7h9.7l-1.5 6H9.2L7.6 8.2H5.9V6.6Z'],
		['accent', C(10.2, 16.8, 1.35)],
		['accent', C(15.5, 16.8, 1.35)]
	],
	calendar: [
		FIELD,
		['subject', 'M6.2 6.5h11.6a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H6.2a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1Z'],
		['accent', 'M5.2 7.5a1 1 0 0 1 1-1h11.6a1 1 0 0 1 1 1v2.2H5.2V7.5Z'],
		['knock', 'M7.7 11.5h1.7v1.7H7.7Z'],
		['knock', 'M11.1 11.5h1.7v1.7h-1.7Z'],
		['knock', 'M14.5 11.5h1.7v1.7h-1.7Z'],
		['knock', 'M7.7 14.7h1.7v1.7H7.7Z'],
		['knock', 'M11.1 14.7h1.7v1.7h-1.7Z']
	],
	home: [
		FIELD,
		[
			'subject',
			'M12 4.9l7.4 6.5-1.1 1.3-.8-.7v6.4a.9.9 0 0 1-.9.9H7.4a.9.9 0 0 1-.9-.9V12l-.8.7-1.1-1.3L12 4.9Z'
		],
		['accent', 'M10.6 13.3h2.8v6h-2.8Z']
	],
	box: [
		FIELD,
		['subject', 'M5.6 8.3 12 4.9l6.4 3.4v7.4L12 19.1l-6.4-3.4V8.3Z'],
		['mid', 'M5.6 8.3 12 4.9l6.4 3.4L12 11.7 5.6 8.3Z'],
		['knock', 'M11.4 11.4h1.2v7.1h-1.2Z']
	],
	book: [
		FIELD,
		[
			'mid',
			'M12 6.7c-1.5-.9-3.3-1.4-5.1-1.4-1 0-2 .15-2.9.45v12.5c.9-.3 1.9-.45 2.9-.45 1.8 0 3.6.5 5.1 1.4V6.7Z'
		],
		[
			'subject',
			'M12 6.7c1.5-.9 3.3-1.4 5.1-1.4 1 0 2 .15 2.9.45v12.5c-.9-.3-1.9-.45-2.9-.45-1.8 0-3.6.5-5.1 1.4V6.7Z'
		]
	],
	settings: [
		FIELD,
		['mid', 'M12 3.2l1.3 2.7h-2.6L12 3.2Z'],
		['mid', 'M12 20.8l-1.3-2.7h2.6L12 20.8Z'],
		['mid', 'M20.8 12l-2.7 1.3v-2.6l2.7 1.3Z'],
		['mid', 'M3.2 12l2.7-1.3v2.6L3.2 12Z'],
		['mid', 'M18.2 5.8l-1 2.8-1.8-1.8 2.8-1Z'],
		['mid', 'M5.8 18.2l1-2.8 1.8 1.8-2.8 1Z'],
		['mid', 'M18.2 18.2l-2.8-1 1.8-1.8 1 2.8Z'],
		['mid', 'M5.8 5.8l2.8 1-1.8 1.8-1-2.8Z'],
		['subject', C(12, 12, 4.7)],
		['knock', C(12, 12, 2.1)]
	],
	chefHat: [
		FIELD,
		[
			'subject',
			'M7.6 19.2v-4.4c-2.2-.4-3.9-2.1-3.9-4.2a4.4 4.4 0 0 1 4.5-4.4 4.2 4.2 0 0 1 7.6 0 4.4 4.4 0 0 1 4.5 4.4c0 2.1-1.7 3.8-3.9 4.2v4.4H7.6Z'
		],
		['knock', 'M7.6 16h8.8v1.3H7.6Z']
	],
	cutlery: [
		FIELD,
		['subject', 'M5.9 4.4h4.3v4.5a2.15 2.15 0 0 1-4.3 0V4.4Z'],
		['knock', 'M6.9 4.4h.7v3.3h-.7Z'],
		['knock', 'M8.5 4.4h.7v3.3h-.7Z'],
		['subject', 'M7.4 9.9h1.3v9.7H7.4Z'],
		['subject', 'M15.1 4.4c1.9.9 3 2.8 3 4.9v3.4a1 1 0 0 1-1 1h-.7v5.9h-1.3V4.4Z']
	],
	basket: [
		FIELD,
		['mid', 'M8.5 9.6a3.5 3.5 0 0 1 7 0h-1.5a2 2 0 0 0-4 0h-1.5Z'],
		['subject', 'M4.5 9.6h15l-1.2 7.5a1.5 1.5 0 0 1-1.5 1.3H7.2a1.5 1.5 0 0 1-1.5-1.3L4.5 9.6Z'],
		['knock', 'M6.6 12.2h10.8v1.1H6.6Z'],
		['knock', 'M9.3 12.2h1.1v4.4H9.3Z'],
		['knock', 'M13.6 12.2h1.1v4.4h-1.1Z']
	],
	jar: [
		FIELD,
		['mid', 'M8 3.9h8v2.3H8Z'],
		[
			'subject',
			'M7.3 6.9c0 1.2-1.6 1.7-1.6 3.3v6.9a3.2 3.2 0 0 0 3.2 3.2h6.2a3.2 3.2 0 0 0 3.2-3.2v-6.9c0-1.6-1.6-2.1-1.6-3.3H7.3Z'
		],
		['accent', 'M8.6 12h6.8v3.6H8.6Z']
	],
	// Body parts first; the LAST TWO are the steam puffs (Spinner contract).
	pot: [
		FIELD,
		['mid', 'M4.2 9.7h15.6v1.6H4.2Z'],
		['subject', 'M5 11.3h14v4.6a3.6 3.6 0 0 1-3.6 3.6H8.6A3.6 3.6 0 0 1 5 15.9v-4.6Z'],
		['accent', C(9.6, 6.4, 1.15)],
		['accent', C(14.4, 5.3, 1.15)]
	],
	pan: [
		FIELD,
		['subject', C(9.7, 12.2, 6.3)],
		['accent', C(9.7, 12.2, 3.2)],
		['subject', 'M15.8 11.4h5v1.6h-5Z']
	],
	spoon: [
		FIELD,
		[
			'subject',
			'M14.6 7c0 2.4-1.15 4.3-2.6 4.3S9.4 9.4 9.4 7 10.55 2.9 12 2.9 14.6 4.6 14.6 7Z'
		],
		['subject', 'M11.35 11h1.3v10h-1.3Z']
	],
	carrot: [
		FIELD,
		['mid', 'M16.4 7.6c.1-1.9 1.2-3.6 2.9-4.7-.1 1.9-1.2 3.6-2.9 4.7Z'],
		['mid', 'M16.4 7.6c1.9-.1 3.6-1.2 4.7-2.9-1.9.1-3.6 1.2-4.7 2.9Z'],
		['accent', 'M4.4 19.6c.5-3.9 2.1-8.5 5.2-11.5l6.3 6.3c-3 3.1-7.6 4.7-11.5 5.2Z'],
		['knock', 'M8.5 13l1.9 1.9-.8.8-1.9-1.9Z']
	],
	egg: [
		FIELD,
		['mid', 'M18 13.5c0 4-2.7 7-6 7s-6-3-6-7 2.7-9.7 6-9.7 6 5.7 6 9.7Z'],
		['knock', C(10, 9.6, 1)]
	],
	flame: [
		FIELD,
		[
			'accent',
			'M12 3.6c.7 2.7 3.6 4.4 4.7 7.2 1 2.8-.3 5.8-2.5 7.3a3.9 3.9 0 0 1-4.4 0c-2.2-1.5-3.5-4.5-2.5-7.3C8.4 8 11.3 6.3 12 3.6Z'
		],
		[
			'subject',
			'M12 19.5c-1.5 0-2.75-1.2-2.75-2.7 0-1.55 1.4-2.3 2.75-3.9 1.35 1.6 2.75 2.35 2.75 3.9 0 1.5-1.25 2.7-2.75 2.7Z'
		]
	],
	snowflake: [
		FIELD,
		['subject', 'M11.35 3.6h1.3v16.8h-1.3Z'],
		['subject', 'M4.92 7.23 19.72 15.63 19.08 16.77 4.28 8.37Z'],
		['subject', 'M19.08 7.23 4.28 15.63 4.92 16.77 19.72 8.37Z'],
		['accent', 'M12 9.4l2.2 1.3v2.6L12 14.6l-2.2-1.3v-2.6L12 9.4Z']
	],
	leaf: [
		FIELD,
		['subject', 'M5.4 18.6c0-8.4 5.6-13.4 14-14.1.7 8.5-4.3 14.1-12.7 14.1H5.4Z'],
		['knock', 'M6.3 18.2c1.9-5.5 5.4-9.6 10.3-11.7l.4 1c-4.6 2-7.9 5.8-9.6 11l-1.1-.3Z']
	],
	plate: [FIELD, ['subject', C(12, 12, 8.2)], ['mid', C(12, 12, 4.3)], ['accent', C(12, 12, 1.9)]],
	bread: [
		FIELD,
		[
			'subject',
			'M4.9 9.4c0-2.2 1.7-3.9 3.9-3.9h6.4c2.2 0 3.9 1.7 3.9 3.9 0 1.1-.5 2.1-1.4 2.8v5.8a1 1 0 0 1-1 1H7.3a1 1 0 0 1-1-1v-5.8c-.9-.7-1.4-1.7-1.4-2.8Z'
		],
		['knock', 'M8.9 8.9H10l-.4 3.2H8.5L8.9 8.9Z'],
		['knock', 'M11.7 8.9h1.1l-.4 3.2h-1.1l.4-3.2Z'],
		['knock', 'M14.5 8.9h1.1l-.4 3.2h-1.1l.4-3.2Z']
	],
	apple: [
		FIELD,
		['mid', 'M13.7 5.2c1-.9 2.3-1.2 3.6-.9-.3 1.4-1.3 2.3-2.7 2.6l-.9-1.7Z'],
		['subject', 'M11.6 8.3c-.2-1.6.4-2.9 1.5-3.9l.9.9c-.9.8-1.3 1.8-1.2 3l-1.2 0Z'],
		[
			'accent',
			'M12 8.3c-1.2-1.1-2.9-1.5-4.4-1C4.9 8.1 3.9 10.9 4.5 13.6c.7 3.3 2.7 6 4.7 7.1.8.4 1.7.3 2.8-.3 1.1.6 2 .7 2.8.3 2-1.1 4-3.8 4.7-7.1.6-2.7-.4-5.5-3.1-6.3-1.5-.5-3.2-.1-4.4 1Z'
		],
		['knock', C(9.2, 11.6, 1)]
	]
};

/** Instantiate the shared geometry with a colourway. */
const build = (pal: PosterPalette): Record<IconName, IconDef> => {
	const paint = (slot: Slot) => (slot === 'knock' ? pal.field : pal[slot]);
	const out = {} as Record<IconName, IconDef>;
	for (const name of Object.keys(G) as IconName[]) {
		out[name] = {
			viewBox: '0 0 24 24',
			sw: 1.4,
			paths: G[name].map(
				([slot, d]): IconPathDef => ({ d, fill: true, color: paint(slot) })
			)
		};
	}
	return out;
};

// Colourways sampled from the actual Huttopia posters.
export const POSTER_AUTOMNE = build({
	field: '#f2e3b3',
	subject: '#15281f',
	mid: '#84a390',
	accent: '#ec7133'
});

export const POSTER_HIVER = build({
	field: '#d3e7f1',
	subject: '#143740',
	mid: '#2f8bab',
	accent: '#fafdff'
});

export const POSTER_NUIT = build({
	field: '#0f2628',
	subject: '#b9be48',
	mid: '#47756c',
	accent: '#67c4e0'
});
