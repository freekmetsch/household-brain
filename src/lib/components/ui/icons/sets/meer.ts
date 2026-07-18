// Meer — the lakeside composition: subject on the shore in cold ink, a small
// sun in the icon's own hue, and its "reflection" abstracted into three
// broken dashes on a pale water band (how the posters paint water). Colour
// lives only in the sun and its reflection.

import type { IconName } from '../paths';
import { C } from './poster';
import { buildScene, fillPath, silhouette } from './scene-lib';
import { tint } from './transform';
import { SPECTRUM_HUE } from './spectrum';

const INK = '#22333a';
const WATER = '#d5e7ef';

const WATER_BAND =
	'M4.6 16.4h14.8a2 2 0 0 1 2 2v0.6a2 2 0 0 1-2 2H4.6a2 2 0 0 1-2-2v-0.6a2 2 0 0 1 2-2Z';

const dash = (cx: number, y: number, w: number) => `M${cx - w / 2} ${y}h${w}v1H${cx - w / 2}Z`;

export const MEER = buildScene((name: IconName) => {
	const hue = SPECTRUM_HUE[name];
	return [
		fillPath(WATER_BAND, WATER),
		fillPath(C(17.9, 5.1, 1.4), hue),
		fillPath(dash(12, 17.3, 7.2), hue, 0.85),
		fillPath(dash(11.2, 19, 4.6), hue, 0.55),
		fillPath(dash(12.6, 20.3, 3), hue, 0.35),
		...silhouette(name, 0.76, 2.9, -1.1).map((p) =>
			fillPath(p.d, p.kind === 'knock' ? tint(INK, 0.4) : p.kind === 'accent' ? hue : INK)
		)
	];
});
