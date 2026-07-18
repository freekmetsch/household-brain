// Icon set registry — every set covers the full IconName inventory (enforced
// per-set via `satisfies Record<IconName, IconDef>`), so the active set can be
// swapped app-wide without touching call sites. Pick one at /design/icons.

import type { IconDef, IconName } from '../paths';
import { ICONS as CLASSIC } from '../paths';
import { ATELIER } from './atelier';
import { PICNIC } from './picnic';
import { HARVEST } from './harvest';
import { MARKET } from './market';
import { MODERNIST } from './modernist';

export interface IconSetMeta {
	name: string;
	tagline: string;
	icons: Record<IconName, IconDef>;
}

const SETS = {
	classic: {
		name: 'Classic',
		tagline: 'The current set — heroicons-matched outlines.',
		icons: CLASSIC
	},
	atelier: {
		name: 'Atelier',
		tagline: 'Fine engraved lines. Bistro-menu elegance with tiny tick details.',
		icons: ATELIER
	},
	picnic: {
		name: 'Picnic',
		tagline: 'Chunky, rounded, friendly. Fat strokes and plump dot accents.',
		icons: PICNIC
	},
	harvest: {
		name: 'Harvest',
		tagline: 'Duotone: soft tinted fills under crisp outlines.',
		icons: HARVEST
	},
	market: {
		name: 'Market Chalk',
		tagline: 'Hand-drawn wobble — no line is quite straight, on purpose.',
		icons: MARKET
	},
	modernist: {
		name: 'Modernist',
		tagline: 'Bauhaus geometry: sharp caps, pure primitives, solid dots.',
		icons: MODERNIST
	}
} as const satisfies Record<string, IconSetMeta>;

export type IconSetId = keyof typeof SETS;

// Widened view (icons: Record<IconName, IconDef>) so consumers see optional
// fields like `cap` even on sets that don't use them.
export const ICON_SETS: Record<IconSetId, IconSetMeta> = SETS;

export const DEFAULT_ICON_SET: IconSetId = 'classic';

export const isIconSetId = (v: unknown): v is IconSetId =>
	typeof v === 'string' && v in ICON_SETS;
