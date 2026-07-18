// Neon — colour as light. Every glyph becomes a lit sign on a midnight tile:
// the Atelier line work gets a wide soft under-glow plus a bright core, in
// electric family colours (utility cyan, storage pink, cookware lime, food
// amber). The dark-mode / signage pole of the exploration.

import type { IconName } from '../paths';
import { repaintAtelier } from './recolor';

const GLOW: Record<IconName, string> = {
	plus: '#45d4f5',
	minus: '#45d4f5',
	check: '#45d4f5',
	x: '#45d4f5',
	trash: '#45d4f5',
	warn: '#ffb03a',
	clock: '#45d4f5',
	chevronLeft: '#45d4f5',
	chevronRight: '#45d4f5',
	clipboard: '#45d4f5',
	copy: '#45d4f5',
	cart: '#f66bd0',
	calendar: '#f66bd0',
	home: '#f66bd0',
	box: '#f66bd0',
	book: '#f66bd0',
	settings: '#45d4f5',
	chefHat: '#b6f04f',
	cutlery: '#b6f04f',
	basket: '#f66bd0',
	jar: '#f66bd0',
	pot: '#b6f04f',
	pan: '#b6f04f',
	spoon: '#b6f04f',
	carrot: '#ffc043',
	egg: '#ffc043',
	flame: '#ff7847',
	snowflake: '#7df0ff',
	leaf: '#b6f04f',
	plate: '#b6f04f',
	bread: '#ffc043',
	apple: '#ffc043'
};

const TILE =
	'M6 2.7h12a3.3 3.3 0 0 1 3.3 3.3v12a3.3 3.3 0 0 1-3.3 3.3H6A3.3 3.3 0 0 1 2.7 18V6A3.3 3.3 0 0 1 6 2.7Z';

export const NEON = repaintAtelier({
	body: (name) => GLOW[name],
	sw: 1.5,
	under: () => [{ d: TILE, fill: true, color: '#171a2e' }],
	ghost: (name) => ({ color: GLOW[name], swAdd: 2.2, opacity: 0.32 })
});
