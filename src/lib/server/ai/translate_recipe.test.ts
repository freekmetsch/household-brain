import { describe, expect, it } from 'vitest';
import { numericTokens, validateTranslatedIngredients } from './translate_recipe';

describe('recipe ingredient translation', () => {
	it('preserves fractions and ranges while translating every display field', () => {
		expect(numericTokens('1½–2 blikken')).toEqual(['1', '½', '2']);
		expect(() => validateTranslatedIngredients(
			[{ name: 'rode ui', amount: '1', unit: 'groot', preparation: 'fijn gesneden', component: 'saus', substitutes: [{ name: 'sjalot', note: 'naar smaak' }] }],
			[{ name: 'red onion', amount: '1', unit: 'large', preparation: 'finely chopped', component: 'sauce', substitutes: [{ name: 'shallot', note: 'to taste' }] }]
		)).not.toThrow();
	});

	it('accepts text amounts and rejects changed numeric tokens or partial fields', () => {
		expect(() => validateTranslatedIngredients(
			[{ name: 'zout', amount: 'naar smaak' }],
			[{ name: 'salt', amount: 'to taste', substitutes: [] }]
		)).not.toThrow();
		expect(() => validateTranslatedIngredients(
			[{ name: 'kikkererwten', amount: '1', unit: 'blik' }],
			[{ name: 'chickpeas', amount: '2', unit: 'cans', substitutes: [] }]
		)).toThrow(/numeric tokens/);
		expect(() => validateTranslatedIngredients(
			[{ name: 'ui', amount: '1', preparation: 'gesneden' }],
			[{ name: 'onion', amount: '1', substitutes: [] }]
		)).toThrow(/preparation completeness/);
	});
});
