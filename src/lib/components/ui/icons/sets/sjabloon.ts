// Sjabloon — stencil knockout: a solid rounded plate in each icon's candy
// colour (Enamel's palette, which won round 2) with the silhouette punched
// clean through via even-odd nesting — interior details re-solidify on their
// own, like a spray-paint stencil. New geometry, no coins.

import { buildScene, fillPath, silhouetteData, SQUIRCLE } from './scene-lib';
import { POSTER_GEOMETRY } from './poster';
import { shade } from './transform';
import { ENAMEL_COLOR } from './enamel';

export const SJABLOON = buildScene((name) => {
	const color = ENAMEL_COLOR[name];
	if (name === 'pot') {
		// Steam stays out of the punch so the Spinner's last-two contract holds;
		// the dots sit on the plate in a darker shade instead.
		const parts = POSTER_GEOMETRY.pot.filter(([slot]) => slot !== 'field');
		const body = parts.slice(0, -2).map(([, d]) => d);
		const steam = parts.slice(-2).map(([, d]) => d);
		return [
			fillPath(SQUIRCLE + body.join(''), color),
			...steam.map((d) => fillPath(d, shade(color, 0.62)))
		];
	}
	return [fillPath(SQUIRCLE + silhouetteData(name).join(''), color)];
});
