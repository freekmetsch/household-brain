// Schaduw — late-afternoon light: every silhouette casts a flat offset
// shadow, poster-style. The subject wears its own hue (Spectrum's tables),
// the shadow is the same hue pushed toward dusk. No outlines anywhere.

import { buildScene, fillPath, silhouette } from './scene-lib';
import { shade, tint } from './transform';
import { SPECTRUM_HUE } from './spectrum';

export const SCHADUW = buildScene((name) => {
	const hue = SPECTRUM_HUE[name];
	const shadow = shade(hue, 0.45);
	const parts = silhouette(name);
	const cast = silhouette(name, 1, 1.5, 1.5);
	return [
		...cast.filter((p) => p.kind !== 'knock').map((p) => fillPath(p.d, shadow, 0.35)),
		...parts.map((p) => fillPath(p.d, p.kind === 'knock' ? tint(hue, 0.72) : hue))
	];
});
