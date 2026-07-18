// Modernist — Bauhaus geometric set. Pure primitives: circles, straight
// lines, 45° diagonals, sharp butt caps (cap: 'butt' → miter joins), and
// solid currentColor dots as accents (cart wheels, clock pivot, apple leaf,
// calendar day square). Grid discipline over charm.
// Convention: `pot`'s LAST TWO paths are the steam wisps (Spinner contract).

import type { IconDef, IconName } from '../paths';

export const MODERNIST = {
	plus: { viewBox: '0 0 24 24', sw: 2, cap: 'butt', paths: ['M12 5v14M5 12h14'] },
	minus: { viewBox: '0 0 24 24', sw: 2, cap: 'butt', paths: ['M5 12h14'] },
	check: { viewBox: '0 0 24 24', sw: 2, cap: 'butt', paths: ['M4.7 12.7 9.3 17.3 19.3 7.3'] },
	x: { viewBox: '0 0 24 24', sw: 2, cap: 'butt', paths: ['M5.5 5.5l13 13M18.5 5.5l-13 13'] },
	trash: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M4.5 6.5h15',
			'M9.5 6.5V4h5v2.5',
			'M7 6.5V20.5h10V6.5',
			'M10.2 10v6.5M13.8 10v6.5'
		]
	},
	warn: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M12 3.8 21.6 20.2H2.4L12 3.8Z',
			'M12 9.6v4.4',
			{ d: 'M12 16.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z', fill: true }
		]
	},
	clock: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
			'M12 7.2V12h4',
			{ d: 'M12 10.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z', fill: true }
		]
	},
	chevronLeft: { viewBox: '0 0 24 24', sw: 2, cap: 'butt', paths: ['M14.5 5 7.5 12l7 7'] },
	chevronRight: { viewBox: '0 0 24 24', sw: 2, cap: 'butt', paths: ['M9.5 5l7 7-7 7'] },
	clipboard: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M5.5 5.5h13V21h-13V5.5Z',
			{ d: 'M9 3h6v4.4H9V3Z', fill: true },
			'M8.5 11.5h7M8.5 15h4.5'
		]
	},
	copy: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: ['M9 9h11v11H9V9Z', 'M4 15V4h11']
	},
	cart: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M3.5 5h2.3l2.4 11h10.6l1.8-8H6.7',
			{ d: 'M9.6 18.9a1.45 1.45 0 1 1 0 2.9 1.45 1.45 0 0 1 0-2.9Z', fill: true },
			{ d: 'M17.4 18.9a1.45 1.45 0 1 1 0 2.9 1.45 1.45 0 0 1 0-2.9Z', fill: true }
		]
	},
	calendar: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M4.5 6h15v14h-15V6Z',
			'M8.5 3.2V6M15.5 3.2V6',
			'M4.5 10h15',
			{ d: 'M13.6 13h3.2v3.2h-3.2V13Z', fill: true }
		]
	},
	home: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: ['M3.5 11.5 12 4l8.5 7.5', 'M6.3 9.7V20.5h11.4V9.7', 'M10.4 20.5v-4.4h3.2v4.4']
	},
	box: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M4.5 8.5 12 4.5l7.5 4v7L12 19.5l-7.5-4v-7Z',
			'M4.5 8.5 12 12.5l7.5-4',
			'M12 12.5v7'
		]
	},
	book: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M4 5.5h8v13H4v-13Z',
			'M12 5.5h8v13h-8v-13Z',
			'M6.5 9h3.2M6.5 12h3.2M14.3 9h3.2M14.3 12h3.2',
			'M12 18.5v2'
		]
	},
	settings: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z',
			'M12 3.8v2.4M12 17.8v2.4M20.2 12h-2.4M6.2 12H3.8',
			'M17.8 6.2 16.1 7.9M7.9 16.1l-1.7 1.7M17.8 17.8l-1.7-1.7M7.9 7.9 6.2 6.2',
			{ d: 'M12 10.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z', fill: true }
		]
	},
	chefHat: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M7 13.4a4.3 4.3 0 1 1 1.3-8.45 4.7 4.7 0 0 1 7.4 0A4.3 4.3 0 1 1 17 13.4',
			'M7 12v8.5h10V12',
			'M7 17h10'
		]
	},
	cutlery: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M6 3.5v5a2 2 0 0 0 4 0v-5',
			'M8 10.5v10',
			'M18.5 3.5c-2 1.4-3 3.5-3 6.1v3.9h3v-10Z',
			'M18.5 13.5v7'
		]
	},
	basket: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M3.5 9.5h17l-1.8 10h-13.4l-1.8-10Z',
			'M8.5 9.5 12 4.2l3.5 5.3',
			'M9.5 12.5v4M14.5 12.5v4'
		]
	},
	jar: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M8 3.8h8v3.4H8V3.8Z',
			'M6.5 7.2h11v9.8a3.5 3.5 0 0 1-3.5 3.5h-4A3.5 3.5 0 0 1 6.5 17V7.2Z',
			{ d: 'M12 12.4a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z', fill: true }
		]
	},
	// Body paths first; the LAST TWO are steam — straight ticks here.
	pot: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M3.5 10.5h17',
			'M5.5 10.5h13v7a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3v-7Z',
			'M10 3.4 8.7 8.2',
			'M16 3.4l-1.3 4.8'
		]
	},
	pan: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M16.4 12.2a6.6 6.6 0 1 1-13.2 0 6.6 6.6 0 0 1 13.2 0Z',
			'M16.4 12.2h5.1',
			{ d: 'M9.8 10.8a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z', fill: true }
		]
	},
	spoon: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M14.8 6.9c0 2.1-1.25 3.8-2.8 3.8S9.2 9 9.2 6.9 10.45 3.1 12 3.1s2.8 1.7 2.8 3.8Z',
			'M12 10.7V21'
		]
	},
	carrot: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M3.8 20.2 9.4 8.8l5.8 5.8L3.8 20.2Z',
			'M8.8 13.6l1.8 1.8',
			'M16.6 7.4l2.2-3.8M16.6 7.4l3.8-2.2'
		]
	},
	egg: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: ['M18 13.3c0 4-2.7 7.2-6 7.2s-6-3.2-6-7.2S8.7 3.5 12 3.5s6 5.8 6 9.8Z']
	},
	flame: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M12 3.4c2.6 3.1 5.1 6.2 5.1 9.7a5.1 5.1 0 0 1-10.2 0c0-3.5 2.5-6.6 5.1-9.7Z',
			{ d: 'M12 14.5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Z', fill: true }
		]
	},
	snowflake: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M12 3v18',
			'M4.2 7.5l15.6 9',
			'M4.2 16.5l15.6-9',
			'M12 9.4a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2Z'
		]
	},
	leaf: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M4.5 19.5C4.5 11.2 11.2 4.5 19.5 4.5c0 8.3-6.7 15-15 15Z',
			'M4.5 19.5 14.6 9.4'
		]
	},
	plate: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
			{ d: 'M12 9.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Z', fill: true }
		]
	},
	bread: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M4.5 12a7.5 7.5 0 0 1 15 0v8H4.5v-8Z',
			'M9.4 10.6v2M12 10v2M14.6 10.6v2'
		]
	},
	apple: {
		viewBox: '0 0 24 24',
		sw: 2,
		cap: 'butt',
		paths: [
			'M19 13.6a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
			'M12 6.6V3.4',
			{ d: 'M15.2 3.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z', fill: true }
		]
	}
} as const satisfies Record<IconName, IconDef>;
