import { describe, expect, it } from 'vitest';
import { batchServingTarget } from './meal_batch';

describe('batchServingTarget', () => {
	it('uses the saved recipe yield rather than the current meal count', () => {
		expect(batchServingTarget(6, 2)).toBe(12);
	});

	it('allows a one-portion recipe and the upper bound', () => {
		expect(batchServingTarget(1, 4)).toBe(4);
		expect(batchServingTarget(33, 3)).toBe(99);
	});

	it('disables missing and out-of-range targets', () => {
		expect(batchServingTarget(null, 1)).toBeNull();
		expect(batchServingTarget(50, 2)).toBeNull();
		expect(batchServingTarget(0, 1)).toBeNull();
	});
});
