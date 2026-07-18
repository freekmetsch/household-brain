// Enamel — colour as object. The Coin set's stamped tokens re-cast as enamel
// pin badges: every disc gets its own flat candy colour, knockouts stay
// punched through to the background. Colour carried by solid shapes instead
// of lines.

import type { IconName } from '../paths';
import { COIN_SET } from './coin';
import { tintFills } from './recolor';

const COLOR: Record<IconName, string> = {
	plus: '#3e9b4f',
	minus: '#e5484d',
	check: '#2f9e68',
	x: '#e54666',
	trash: '#5a6169',
	warn: '#f5a524',
	clock: '#3e63dd',
	chevronLeft: '#5a6169',
	chevronRight: '#5a6169',
	clipboard: '#5b5bd6',
	copy: '#7c66dc',
	cart: '#316dca',
	calendar: '#e93d82',
	home: '#46a758',
	box: '#ad7f58',
	book: '#8e4ec6',
	settings: '#64707d',
	chefHat: '#3a5ccc',
	cutlery: '#708090',
	basket: '#f76b15',
	jar: '#94ba2c',
	pot: '#12a594',
	pan: '#46515e',
	spoon: '#ad7f58',
	carrot: '#f76b15',
	egg: '#ffb224',
	flame: '#f4442e',
	snowflake: '#3db9cf',
	leaf: '#55b467',
	plate: '#4cadd4',
	bread: '#d09a53',
	apple: '#d93036'
};

export const ENAMEL = tintFills(COIN_SET, COLOR);
