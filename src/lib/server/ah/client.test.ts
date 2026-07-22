import { describe, expect, it } from 'vitest';
import { classifyAhWriteStatus, shouldRetryAh401 } from './client';

describe('AH write dispatch safety', () => {
	it('retries authentication only for safe reads', () => {
		expect(shouldRetryAh401('GET')).toBe(true);
		expect(shouldRetryAh401('HEAD')).toBe(true);
		expect(shouldRetryAh401('PATCH')).toBe(false);
		expect(shouldRetryAh401('PUT')).toBe(false);
	});

	it('keeps timeouts, auth failures, and server failures uncertain', () => {
		expect(classifyAhWriteStatus(200)).toBe('succeeded');
		expect(classifyAhWriteStatus(400)).toBe('failed');
		expect(classifyAhWriteStatus(412)).toBe('failed');
		expect(classifyAhWriteStatus(401)).toBe('uncertain');
		expect(classifyAhWriteStatus(408)).toBe('uncertain');
		expect(classifyAhWriteStatus(500)).toBe('uncertain');
	});
});
