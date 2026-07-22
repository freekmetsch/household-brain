import { describe, expect, it } from 'vitest';
import { generationFingerprint } from './cook_mode';

function recipe(overrides: Record<string, unknown> = {}) {
	return {
		id: 1,
		title: 'Soep',
		language: 'nl',
		servings: 4,
		totalTimeMin: 30,
		ingredients: [{ name: 'ui', amount: '1' }],
		directions: ['Bak de ui.'],
		...overrides
	} as never;
}

describe('cook-mode semantic fingerprint', () => {
	it('ignores presentation and planning fields', () => {
		const before = generationFingerprint(recipe(), []);
		expect(generationFingerprint(recipe({ totalTimeMin: 90, rating: 5, imageUrl: '/new.webp' }), [])).toBe(before);
	});

	it('changes for canonical cooking content and component content', () => {
		const before = generationFingerprint(recipe(), [recipe({ id: 2, title: 'Saus' })]);
		expect(generationFingerprint(recipe({ directions: ['Kook de ui.'] }), [recipe({ id: 2, title: 'Saus' })])).not.toBe(before);
		expect(generationFingerprint(recipe(), [recipe({ id: 2, title: 'Saus', ingredients: [{ name: 'knoflook', amount: '1' }] })])).not.toBe(before);
	});
});
