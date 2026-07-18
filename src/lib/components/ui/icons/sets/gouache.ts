// Gouache — colour as paint. Atelier's drawings with heavier, rounder strokes
// in a muted painter's palette (olive, brick, ochre, teal, plum); each icon
// mixes two pigments — one for the body, one for its detail. Cookbook-
// illustration warmth, multiple hues inside a single glyph.

import type { IconName } from '../paths';
import { repaintAtelier } from './recolor';

const OLIVE = '#7d8f45';
const BRICK = '#bf5b3f';
const OCHRE = '#d9a23f';
const TEAL = '#45807a';
const PLUM = '#815f83';
const NAVY = '#46536e';
const MOSS = '#5c7a52';
const RUST = '#a8663c';
const CLAY = '#c07f5a';
const SLATE = '#5c6b73';

/** [body, detail] pigments per icon. */
const MIX: Record<IconName, readonly [string, string]> = {
	plus: [NAVY, NAVY],
	minus: [BRICK, BRICK],
	check: [MOSS, MOSS],
	x: [BRICK, BRICK],
	trash: [SLATE, BRICK],
	warn: [OCHRE, NAVY],
	clock: [NAVY, OCHRE],
	chevronLeft: [SLATE, SLATE],
	chevronRight: [SLATE, SLATE],
	clipboard: [TEAL, OCHRE],
	copy: [PLUM, CLAY],
	cart: [NAVY, BRICK],
	calendar: [BRICK, TEAL],
	home: [TEAL, OCHRE],
	box: [CLAY, NAVY],
	book: [PLUM, OCHRE],
	settings: [SLATE, TEAL],
	chefHat: [NAVY, BRICK],
	cutlery: [SLATE, SLATE],
	basket: [RUST, OLIVE],
	jar: [TEAL, OCHRE],
	pot: [NAVY, CLAY],
	pan: [SLATE, OCHRE],
	spoon: [CLAY, CLAY],
	carrot: [RUST, OLIVE],
	egg: [CLAY, OCHRE],
	flame: [BRICK, OCHRE],
	snowflake: [TEAL, SLATE],
	leaf: [OLIVE, MOSS],
	plate: [TEAL, CLAY],
	bread: [OCHRE, BRICK],
	apple: [BRICK, OLIVE]
};

export const GOUACHE = repaintAtelier({
	body: (name) => MIX[name][0],
	detail: (name) => MIX[name][1],
	sw: 1.9
});
