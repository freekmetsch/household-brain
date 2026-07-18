// Sorbet — colour as background field. Atelier line work in soft ink floats
// on a pastel disc whose hue follows the icon's family (cooking peach,
// produce mint, planning sky, utility lilac…); details deepen to the family's
// saturated cousin. Friendly app-icon energy without touching the drawings.

import type { IconName } from '../paths';
import { repaintAtelier } from './recolor';

/** [pastel disc, deep detail] per family. */
const FAMILY: Record<IconName, readonly [string, string]> = {
	plus: ['#ece8f7', '#8465c9'],
	minus: ['#ece8f7', '#8465c9'],
	check: ['#e2f2e3', '#3f9950'],
	x: ['#f9e2e5', '#c9536b'],
	trash: ['#f9e2e5', '#c9536b'],
	warn: ['#fdeecb', '#d97706'],
	clock: ['#dceefb', '#2a7ab8'],
	chevronLeft: ['#ece8f7', '#8465c9'],
	chevronRight: ['#ece8f7', '#8465c9'],
	clipboard: ['#ece8f7', '#8465c9'],
	copy: ['#ece8f7', '#8465c9'],
	cart: ['#fbeed2', '#c07f2a'],
	calendar: ['#dceefb', '#2a7ab8'],
	home: ['#dceefb', '#2a7ab8'],
	box: ['#e0f2f4', '#2b9aa8'],
	book: ['#dceefb', '#2a7ab8'],
	settings: ['#ece8f7', '#8465c9'],
	chefHat: ['#ffe7d4', '#d2622a'],
	cutlery: ['#ffe7d4', '#d2622a'],
	basket: ['#fbeed2', '#c07f2a'],
	jar: ['#e0f2f4', '#2b9aa8'],
	pot: ['#ffe7d4', '#d2622a'],
	pan: ['#ffe7d4', '#d2622a'],
	spoon: ['#ffe7d4', '#d2622a'],
	carrot: ['#e0f2e1', '#3f9950'],
	egg: ['#e0f2e1', '#3f9950'],
	flame: ['#ffe7d4', '#d2622a'],
	snowflake: ['#e0f2f4', '#2b9aa8'],
	leaf: ['#e0f2e1', '#3f9950'],
	plate: ['#ffe7d4', '#d2622a'],
	bread: ['#e0f2e1', '#3f9950'],
	apple: ['#e0f2e1', '#3f9950']
};

const DISC = 'M2.7 12a9.3 9.3 0 1 0 18.6 0a9.3 9.3 0 1 0 -18.6 0Z';

export const SORBET = repaintAtelier({
	body: '#33302d',
	detail: (name) => FAMILY[name][1],
	under: (name) => [{ d: DISC, fill: true, color: FAMILY[name][0] }]
});
