// Zon — the poster move distilled to two shapes: a big flat sun disc in each
// icon's own hue, with the subject standing against it as a solid ink
// silhouette (Haugomat's figure-against-the-sun composition). Airy — no tile,
// no frame; the sun IS the colour.

import { C } from './poster';
import { buildScene, fillPath, silhouette } from './scene-lib';
import { SPECTRUM_HUE } from './spectrum';

const INK = '#2a2723';
const SOFT = '#5c554b';

export const ZON = buildScene((name) => {
	const hue = SPECTRUM_HUE[name];
	return [
		fillPath(C(12, 10.8, 7.6), hue),
		...silhouette(name).map((p) =>
			fillPath(p.d, p.kind === 'knock' ? SOFT : p.kind === 'accent' ? INK : INK)
		)
	];
});
