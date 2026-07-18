import { describe, expect, it } from 'vitest';
import { shade, tint, transformPath } from './transform';
import { POSTER_GEOMETRY } from './poster';

describe('transformPath', () => {
	it('is the identity at s=1, dx=0, dy=0 (numeric round-trip)', () => {
		for (const parts of Object.values(POSTER_GEOMETRY)) {
			for (const [, d] of parts) {
				const once = transformPath(d, 1, 0, 0);
				expect(transformPath(once, 1, 0, 0)).toBe(once);
			}
		}
	});

	it('translates absolute commands and leaves relative ones scaled only', () => {
		expect(transformPath('M2 3h4v5l1 1H2V3Z', 1, 10, 20)).toBe('M12 23h4v5l1 1H12V23Z');
	});

	it('scales around the origin including arc radii', () => {
		expect(transformPath('M2 12a5 5 0 1 0 10 0', 2, 0, 0)).toBe('M4 24a10 10 0 1 0 20 0');
	});

	it('handles implicit command repeats (bare coordinate lists)', () => {
		// snowflake-style implicit lineto chain
		expect(transformPath('M1 1 3 1 3 3Z', 2, 1, 1)).toBe('M3 3 7 3 7 7Z');
	});

	it('handles chained cubic segments with negative glued numbers', () => {
		const d = 'M4.9 9.4c0-2.2 1.7-3.9 3.9-3.9h6.4c2.2 0 3.9 1.7 3.9 3.9';
		expect(transformPath(d, 1, 0, 0)).toBe(
			'M4.9 9.4c0 -2.2 1.7 -3.9 3.9 -3.9h6.4c2.2 0 3.9 1.7 3.9 3.9'
		);
	});

	it('composes: scale-then-translate equals the combined transform', () => {
		const d = 'M4 6l2 2a3 3 0 0 1 6 0V4H9Z';
		const a = transformPath(transformPath(d, 0.5, 0, 0), 1, 3, 4);
		const b = transformPath(d, 0.5, 3, 4);
		expect(a).toBe(b);
	});
});

describe('colour helpers', () => {
	it('shade darkens toward black', () => {
		expect(shade('#ff8000', 0.5)).toBe('#804000');
	});
	it('tint mixes toward white', () => {
		expect(tint('#000000', 1)).toBe('#ffffff');
		expect(tint('#204060', 0)).toBe('#204060');
	});
});
