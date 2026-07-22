import { describe, expect, it } from 'vitest';
import { cookPaletteGraph, PALETTES } from './palette';

describe('cookPaletteGraph', () => {
	it('blends amber and sky into emerald and keeps it on later output steps', () => {
		const graph = cookPaletteGraph(
			[{ id: 'yellow' }, { id: 'blue' }, { id: 'result' }],
			[
				{ stream_id: 'yellow' },
				{ stream_id: 'blue' },
				{ stream_id: 'result', merges_from: ['yellow', 'blue'] },
				{ stream_id: 'result' }
			]
		);
		expect(graph[2].result).toBe(PALETTES[2]);
		expect(graph[3].result).toBe(PALETTES[2]);
		expect(graph[2].sources).toEqual([PALETTES[0], PALETTES[1]]);
	});

	it('blends amber and rose into orange regardless of source order', () => {
		const graph = cookPaletteGraph(
			[{ id: 'amber' }, { id: 'unused' }, { id: 'result' }, { id: 'rose' }],
			[{ stream_id: 'amber' }, { stream_id: 'rose' }, { stream_id: 'result', merges_from: ['rose', 'amber'] }]
		);
		expect(graph[2].result).toBe(PALETTES[5]);
	});

	it('updates an input stream after a three-way merge without changing earlier cards', () => {
		const graph = cookPaletteGraph(
			[{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }, { id: 'f' }, { id: 'g' }],
			[
				{ stream_id: 'a' },
				{ stream_id: 'b' },
				{ stream_id: 'c' },
				{ stream_id: 'a', merges_from: ['a', 'b', 'c'] },
				{ stream_id: 'a' },
				{ stream_id: 'g' }
			]
		);
		expect(graph[0].result).toBe(PALETTES[0]);
		expect(graph[3].result).toBe(PALETTES[4]);
		expect(graph[4].result).toBe(PALETTES[4]);
		expect(graph[5].result).toBe(PALETTES[0]);
	});
});
