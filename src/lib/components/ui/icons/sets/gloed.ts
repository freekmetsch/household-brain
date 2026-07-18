// Gloed — dusk gradient faked the poster way: three flat horizontal sky bands
// deepening toward the top, a low glowing sun, and the subject in true
// near-black silhouette. Four times of day rotate across the inventory.

import type { IconName } from '../paths';
import { C } from './poster';
import { buildScene, fillPath, silhouette, SQUIRCLE, SQUIRCLE_BOTTOM } from './scene-lib';

interface Dusk {
	top: string;
	mid: string;
	low: string;
	sun: string;
}

const DUSKS: readonly Dusk[] = [
	// ember dusk
	{ top: '#2c3a55', mid: '#c75b39', low: '#f2b34c', sun: '#f6d7a0' },
	// rose dawn
	{ top: '#3f4e6b', mid: '#c98ba0', low: '#f2cf9f', sun: '#fdf3dd' },
	// green nightfall (the 2026 été visual)
	{ top: '#0f2628', mid: '#1d4a45', low: '#47756c', sun: '#67c4e0' },
	// blue hour
	{ top: '#14333a', mid: '#2f8bab', low: '#cfe6f1', sun: '#f6fbfd' }
] as const;

const DUSK: Record<IconName, number> = {
	plus: 3, minus: 3, check: 0, x: 3, trash: 1, warn: 0, clock: 3, chevronLeft: 3,
	chevronRight: 3, clipboard: 1, copy: 2, cart: 0, calendar: 1, home: 0, box: 1,
	book: 2, settings: 3, chefHat: 0, cutlery: 2, basket: 0, jar: 1, pot: 0, pan: 2,
	spoon: 1, carrot: 0, egg: 1, flame: 2, snowflake: 3, leaf: 2, plate: 3, bread: 1,
	apple: 0
};

const INK = '#181410';
const MID_BAND = 'M2.6 9.4h18.8v4.8H2.6Z';

export const GLOED = buildScene((name) => {
	const d = DUSKS[DUSK[name]];
	return [
		fillPath(SQUIRCLE, d.top),
		fillPath(MID_BAND, d.mid),
		fillPath(SQUIRCLE_BOTTOM(14.2), d.low),
		fillPath(C(12, 14.2, 3.1), d.sun),
		...silhouette(name).map((p) =>
			fillPath(p.d, p.kind === 'knock' ? '#4a423a' : p.kind === 'accent' ? d.sun : INK)
		)
	];
});
