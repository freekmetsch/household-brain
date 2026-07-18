// Klein — Haugomat's signature vastness: a huge sun in the icon's own hue
// over a pale tinted field, and the subject shrunk small, standing on a thin
// ground line at the bottom. The scale gap IS the composition.

import { C } from './poster';
import { buildScene, fillPath, silhouette, SQUIRCLE } from './scene-lib';
import { tint } from './transform';
import { SPECTRUM_HUE } from './spectrum';

const INK = '#1d1b17';

export const KLEIN = buildScene((name) => {
	const hue = SPECTRUM_HUE[name];
	return [
		fillPath(SQUIRCLE, tint(hue, 0.87)),
		fillPath(C(12, 8.6, 5.6), hue),
		fillPath('M5.2 18.95h13.6v1.1H5.2Z', INK, 0.85),
		...silhouette(name, 0.5, 6, 8.55).map((p) =>
			fillPath(p.d, p.kind === 'accent' ? tint(hue, 0.87) : INK)
		)
	];
});
