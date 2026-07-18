// Spectrum — colour as meaning. Every icon keeps Atelier's drawing but wears
// its own natural hue at full voice: yolk-yellow egg, flame red, ice-blue
// snowflake, carrot orange. The maximal "own colour per glyph" pole.

import type { IconName } from '../paths';
import { repaintAtelier } from './recolor';

const HUE: Record<IconName, string> = {
	plus: '#2f9e44',
	minus: '#e0453a',
	check: '#21a06b',
	x: '#d63d55',
	trash: '#7a8291',
	warn: '#f59f00',
	clock: '#4263eb',
	chevronLeft: '#64707d',
	chevronRight: '#64707d',
	clipboard: '#7048e8',
	copy: '#9775fa',
	cart: '#1e88d0',
	calendar: '#e8590c',
	home: '#37b24d',
	box: '#a87e58',
	book: '#9c36b5',
	settings: '#5f6b7a',
	chefHat: '#f08c00',
	cutlery: '#868e96',
	basket: '#d9480f',
	jar: '#74b816',
	pot: '#1098ad',
	pan: '#495057',
	spoon: '#b08968',
	carrot: '#f76707',
	egg: '#fcc419',
	flame: '#fa5252',
	snowflake: '#3bc9db',
	leaf: '#40c057',
	plate: '#22b8cf',
	bread: '#d9a05b',
	apple: '#e03131'
};

export const SPECTRUM = repaintAtelier({
	body: (name) => HUE[name],
	sw: 1.6
});
