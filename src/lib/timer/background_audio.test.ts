import { describe, expect, it, vi } from 'vitest';
import {
	BackgroundTimerAudio,
	type TimerAudioElement
} from './background_audio';

class FakeAudio implements TimerAudioElement {
	src = '';
	preload = '';
	currentTime = 0;
	readyState = 0;
	paused = true;
	ended = false;
	play = vi.fn(async () => {
		this.paused = false;
	});
	pause = vi.fn(() => {
		this.paused = true;
	});
	load = vi.fn();
	private listeners = new Map<string, Set<EventListener>>();

	addEventListener(type: string, listener: EventListener) {
		const listeners = this.listeners.get(type) ?? new Set<EventListener>();
		listeners.add(listener);
		this.listeners.set(type, listeners);
	}

	removeEventListener(type: string, listener: EventListener) {
		this.listeners.get(type)?.delete(listener);
	}

	emit(type: string) {
		for (const listener of this.listeners.get(type) ?? []) listener(new Event(type));
	}
}

describe('BackgroundTimerAudio', () => {
	it('starts from a user gesture and aligns the silent lead-in to the deadline', async () => {
		const audio = new FakeAudio();
		const scheduler = new BackgroundTimerAudio({
			src: '/audio/timer.m4a',
			createAudio: () => audio,
			now: () => 1_000,
			silenceSeconds: 3_600
		});

		expect(scheduler.schedule(4, 61_000)).toBe(true);
		expect(audio.src).toBe('/audio/timer.m4a');
		expect(audio.preload).toBe('auto');
		expect(audio.play).toHaveBeenCalledOnce();

		audio.emit('loadedmetadata');
		expect(audio.currentTime).toBe(3_540);
		await Promise.resolve();
		expect(scheduler.isActive(4)).toBe(true);
	});

	it('does not claim deadlines beyond the rendered media lead-in', () => {
		const audio = new FakeAudio();
		const scheduler = new BackgroundTimerAudio({
			src: '/audio/timer.m4a',
			createAudio: () => audio,
			now: () => 0,
			silenceSeconds: 60
		});

		expect(scheduler.schedule(1, 61_000)).toBe(false);
		expect(audio.play).not.toHaveBeenCalled();
	});

	it('stops and releases the media element when a timer is cancelled', async () => {
		const audio = new FakeAudio();
		const scheduler = new BackgroundTimerAudio({
			src: '/audio/timer.m4a',
			createAudio: () => audio,
			now: () => 0,
			silenceSeconds: 60
		});

		scheduler.schedule(2, 30_000);
		await Promise.resolve();
		scheduler.stop(2);

		expect(audio.pause).toHaveBeenCalledOnce();
		expect(audio.src).toBe('');
		expect(scheduler.isActive(2)).toBe(false);
	});
});
