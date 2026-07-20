import { describe, expect, it } from 'vitest';
import { freezerTargetPayload, parseFreezerTargetResponse } from './freezer_target';

describe('freezer target save seam', () => {
	it('sends the final toggle and target in one payload', () => {
		expect(freezerTargetPayload(true, 4)).toEqual({
			is_freezer_staple: true,
			target_portions: 4
		});
		expect(freezerTargetPayload(false, 4)).toEqual({
			is_freezer_staple: false,
			target_portions: null
		});
	});

	it('adopts the canonical response, including a cleared target', () => {
		expect(parseFreezerTargetResponse({ isFreezerStaple: false, targetPortions: null })).toEqual({
			isFreezerStaple: false,
			targetPortions: null
		});
	});

	it('rejects a response without canonical state', () => {
		expect(parseFreezerTargetResponse({ is_freezer_staple: true, target_portions: 4 })).toBeNull();
	});
});
