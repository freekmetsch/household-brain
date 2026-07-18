// Icon set registry — every set covers the full IconName inventory (enforced
// per-set via `satisfies Record<IconName, IconDef>` or a typed builder), so
// the active set can be swapped app-wide without touching call sites. Pick
// one at /design/icons.
//
// Round 1 explored construction (carved fills / one line / pixels / collage /
// knockout coins); Atelier won. Round 2 explores COLOUR: ten sets spanning
// the colour design space — three flat-poster colourways after Tom Haugomat's
// Huttopia posters, plus seven colour systems over the winning geometry
// (accent, backdrop, per-glyph hue, glow, overprint, paint, enamel fills).

import type { IconDef, IconName } from '../paths';
import { ICONS as CLASSIC } from '../paths';
import { ATELIER } from './atelier';
import { LINOCUT } from './linocut';
import { THREAD } from './thread';
import { BITMAP } from './bitmap';
import { CUTOUT } from './cutout';
import { COIN_SET } from './coin';
import { POSTER_AUTOMNE, POSTER_HIVER, POSTER_NUIT } from './poster';
import { BISTRO } from './bistro';
import { SORBET } from './sorbet';
import { SPECTRUM } from './spectrum';
import { NEON } from './neon';
import { RISO } from './riso';
import { GOUACHE } from './gouache';
import { ENAMEL } from './enamel';

export interface IconSetMeta {
	name: string;
	tagline: string;
	icons: Record<IconName, IconDef>;
}

const SETS = {
	atelier: {
		name: 'Atelier',
		tagline: 'The current set — fine engraved lines with tiny tick details.',
		icons: ATELIER
	},
	bistro: {
		name: 'Bistro',
		tagline: 'Colour as seasoning: Atelier in warm ink, one terracotta accent on each detail.',
		icons: BISTRO
	},
	automne: {
		name: 'Automne',
		tagline:
			'After Haugomat’s Huttopia autumn poster: flat fills on cream, ink-green subjects, sage + burnt orange.',
		icons: POSTER_AUTOMNE
	},
	hiver: {
		name: 'Hiver',
		tagline:
			'After Haugomat’s Huttopia winter poster: ice-blue field, pine-teal silhouettes, snow-white accents.',
		icons: POSTER_HIVER
	},
	nuit: {
		name: 'Nuit',
		tagline:
			'After Haugomat’s 2026 night key visual: deep ink-teal field, chartreuse subjects, sky-cyan pops.',
		icons: POSTER_NUIT
	},
	sorbet: {
		name: 'Sorbet',
		tagline: 'Colour as background: soft pastel discs by family under the ink line work.',
		icons: SORBET
	},
	spectrum: {
		name: 'Spectrum',
		tagline: 'Colour as meaning: every glyph in its own natural hue, full voice.',
		icons: SPECTRUM
	},
	gouache: {
		name: 'Gouache',
		tagline: 'Colour as paint: heavier strokes, two muted pigments mixed inside each icon.',
		icons: GOUACHE
	},
	riso: {
		name: 'Riso',
		tagline: 'Colour as print: blue + fluoro-pink two-ink overprint with off-register ghosts.',
		icons: RISO
	},
	neon: {
		name: 'Neon',
		tagline: 'Colour as light: glowing signage glyphs on midnight tiles.',
		icons: NEON
	},
	enamel: {
		name: 'Enamel',
		tagline: 'Colour as object: the Coin tokens re-cast as candy-coloured enamel pins.',
		icons: ENAMEL
	},
	linocut: {
		name: 'Linocut',
		tagline: 'Hand-carved stamps: solid silhouettes, detail cut out in white.',
		icons: LINOCUT
	},
	thread: {
		name: 'Thread',
		tagline: 'Every icon one unbroken line, loops and all — drawn without lifting the pen.',
		icons: THREAD
	},
	bitmap: {
		name: 'Bitmap',
		tagline: '12×12 pixel kitchen — pure 8-bit squares.',
		icons: BITMAP
	},
	cutout: {
		name: 'Cutout',
		tagline: 'Paper collage: layered flat shapes in two tones, no outlines.',
		icons: CUTOUT
	},
	coin: {
		name: 'Coin',
		tagline: 'Stamped tokens: glyphs knocked out of solid discs.',
		icons: COIN_SET
	},
	classic: {
		name: 'Classic',
		tagline: 'The original heroicons-matched outlines.',
		icons: CLASSIC
	}
} as const satisfies Record<string, IconSetMeta>;

export type IconSetId = keyof typeof SETS;

// Widened view (icons: Record<IconName, IconDef>) so consumers see optional
// fields like `cap` even on sets that don't use them.
export const ICON_SETS: Record<IconSetId, IconSetMeta> = SETS;

export const DEFAULT_ICON_SET: IconSetId = 'atelier';

export const isIconSetId = (v: unknown): v is IconSetId =>
	typeof v === 'string' && v in SETS;
