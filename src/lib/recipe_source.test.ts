import { describe, expect, it } from 'vitest';
import { parseRecipeSource } from './recipe_source';

describe('parseRecipeSource', () => {
	it('returns a safe external link and readable hostname', () => {
		expect(parseRecipeSource('https://www.example.com/recipes/pasta?from=app')).toEqual({
			href: 'https://www.example.com/recipes/pasta?from=app',
			host: 'example.com'
		});
	});

	it.each([null, '', 'not a url', 'javascript:alert(1)', 'file:///recipe.txt'])(
		'omits invalid or unsafe source %s',
		(source) => {
			expect(parseRecipeSource(source)).toBeNull();
		}
	);
});
