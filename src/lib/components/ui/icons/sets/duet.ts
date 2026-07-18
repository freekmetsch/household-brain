// Duet — day/night split: the scene tile is halved into a warm and a cool
// field (Haugomat's recurring dusk contrast), with the silhouette bridging
// both in near-black ink and the pop details in paper. Each icon gets its own
// warm/cool pair.

import type { IconName } from '../paths';
import { buildScene, fillPath, silhouette, SQUIRCLE, SQUIRCLE_RIGHT } from './scene-lib';

const INK = '#211d19';
const PAPER = '#f4ecd9';

/** Warm/cool duos sampled from the poster palettes. */
const DUOS = [
	['#ee7233', '#155b63'],
	['#f2c14e', '#12404d'],
	['#e8a04b', '#0f2d3a'],
	['#d95d39', '#37655c'],
	['#f2e0ae', '#2f8bab'],
	['#c75b39', '#14333a']
] as const;

const DUO: Record<IconName, number> = {
	plus: 0, minus: 1, check: 2, x: 3, trash: 4, warn: 5, clock: 0, chevronLeft: 1,
	chevronRight: 1, clipboard: 2, copy: 3, cart: 4, calendar: 5, home: 0, box: 1,
	book: 2, settings: 3, chefHat: 4, cutlery: 5, basket: 0, jar: 1, pot: 2, pan: 3,
	spoon: 4, carrot: 5, egg: 0, flame: 1, snowflake: 2, leaf: 3, plate: 4, bread: 5,
	apple: 0
};

export const DUET = buildScene((name) => {
	const [warm, cool] = DUOS[DUO[name]];
	return [
		fillPath(SQUIRCLE, warm),
		fillPath(SQUIRCLE_RIGHT, cool),
		...silhouette(name).map((p) => fillPath(p.d, p.kind === 'subject' ? INK : PAPER))
	];
});
