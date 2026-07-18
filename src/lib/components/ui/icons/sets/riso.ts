// Riso — colour as printing process. Two-ink risograph overprint: the body
// runs in medium blue, details switch to fluorescent pink, and a fat pink
// ghost under every stroke fakes the slightly-off registration that gives
// riso prints their buzz.

import { repaintAtelier } from './recolor';

const PINK = '#ff4fa3';

export const RISO = repaintAtelier({
	body: '#2f4fd0',
	detail: PINK,
	ghost: () => ({ color: PINK, swAdd: 1.1, opacity: 0.38 })
});
