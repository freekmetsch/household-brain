// Affiche — every icon is literally a small travel poster: cream margin,
// framed scene with sky, a sun, a ground band, and the subject shrunk to
// stand in the landscape. Five scene colourways (sampled from the Huttopia
// campaign seasons) rotate across the inventory like a poster wall.

import type { IconName } from '../paths';
import { C } from './poster';
import { buildScene, fillPath, silhouette, SQUIRCLE } from './scene-lib';

interface Scene {
	sky: string;
	ground: string;
	sun: string;
	ink: string;
	soft: string;
}

const SCENES: readonly Scene[] = [
	// automne: cream sky, sage ground, burnt-orange sun
	{ sky: '#f2e0ae', ground: '#84a390', sun: '#ee7233', ink: '#15281f', soft: '#48604f' },
	// hiver: ice sky, snow ground, cerulean sun
	{ sky: '#cfe6f1', ground: '#eef6fa', sun: '#2f8bab', ink: '#143740', soft: '#4f7684' },
	// été lake: teal sky, pine ground, gold sun
	{ sky: '#58aebf', ground: '#0e5a44', sun: '#f0c020', ink: '#0f2d33', soft: '#2e5c63' },
	// nuit: dark sky, deep-teal ground, cyan moon, chartreuse subject
	{ sky: '#0f2628', ground: '#1d4a45', sun: '#67c4e0', ink: '#b9be48', soft: '#6f7f3f' },
	// générique: gold sky, pine ground, amber sun
	{ sky: '#f5e386', ground: '#005030', sun: '#f0b020', ink: '#123528', soft: '#3f6b52' }
];

const SCENE: Record<IconName, number> = {
	plus: 1, minus: 1, check: 0, x: 1, trash: 4, warn: 2, clock: 4, chevronLeft: 1,
	chevronRight: 1, clipboard: 4, copy: 3, cart: 0, calendar: 4, home: 0, box: 4,
	book: 3, settings: 1, chefHat: 0, cutlery: 2, basket: 0, jar: 4, pot: 0, pan: 2,
	spoon: 3, carrot: 0, egg: 1, flame: 3, snowflake: 1, leaf: 2, plate: 3, bread: 4,
	apple: 0
};

const PAPER = '#f4ecdc';
const SCENE_RECT = 'M4.1 4.1h15.8v13.2H4.1Z';
const GROUND = 'M4.1 14.7h15.8v2.6H4.1Z';

export const AFFICHE = buildScene((name) => {
	const sc = SCENES[SCENE[name]];
	return [
		fillPath(SQUIRCLE, PAPER),
		fillPath(SCENE_RECT, sc.sky),
		fillPath(C(15.9, 7.4, 2.1), sc.sun),
		fillPath(GROUND, sc.ground),
		...silhouette(name, 0.6, 4.8, 3.3).map((p) =>
			fillPath(p.d, p.kind === 'knock' ? sc.soft : p.kind === 'accent' ? sc.sun : sc.ink)
		)
	];
});
