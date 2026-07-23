export const TIMER_AUDIO_SILENCE_SECONDS = 12 * 60 * 60;

type TimerAudioEvent = 'ended' | 'error' | 'loadedmetadata';

export type TimerAudioElement = {
	src: string;
	preload: string;
	currentTime: number;
	readyState: number;
	paused: boolean;
	ended: boolean;
	play: () => Promise<void>;
	pause: () => void;
	load: () => void;
	addEventListener: (
		type: TimerAudioEvent,
		listener: EventListener,
		options?: AddEventListenerOptions | boolean
	) => void;
	removeEventListener: (type: TimerAudioEvent, listener: EventListener) => void;
};

type Track = {
	audio: TimerAudioElement;
	align: EventListener;
	ended: EventListener;
	error: EventListener;
};

type BackgroundTimerAudioOptions = {
	src: string;
	createAudio?: () => TimerAudioElement;
	now?: () => number;
	silenceSeconds?: number;
};

/**
 * Starts a real media element from the silent lead-in of a pre-rendered track.
 * The alarm is part of that same file, so media playback can reach it without
 * relying on a throttled JavaScript callback while the page is backgrounded.
 * Locked-screen behavior remains device- and browser-specific.
 */
export class BackgroundTimerAudio {
	private readonly tracks = new Map<number, Track>();
	private readonly src: string;
	private readonly createAudio: () => TimerAudioElement;
	private readonly now: () => number;
	private readonly silenceSeconds: number;

	constructor(options: BackgroundTimerAudioOptions) {
		this.src = options.src;
		this.createAudio =
			options.createAudio ??
			(() => {
				return new Audio() as TimerAudioElement;
			});
		this.now = options.now ?? Date.now;
		this.silenceSeconds = options.silenceSeconds ?? TIMER_AUDIO_SILENCE_SECONDS;
	}

	schedule(id: number, deadlineMs: number): boolean {
		this.stop(id);
		const remainingSeconds = (deadlineMs - this.now()) / 1000;
		if (remainingSeconds <= 0 || remainingSeconds > this.silenceSeconds) return false;

		const audio = this.createAudio();
		const align = () => {
			const remaining = Math.max(0, (deadlineMs - this.now()) / 1000);
			audio.currentTime = Math.max(0, this.silenceSeconds - remaining);
		};
		const ended = () => this.discard(id, audio, false);
		const error = () => this.discard(id, audio);
		const track: Track = { audio, align, ended, error };

		audio.preload = 'auto';
		audio.src = this.src;
		audio.addEventListener('loadedmetadata', align, { once: true });
		audio.addEventListener('ended', ended, { once: true });
		audio.addEventListener('error', error, { once: true });
		this.tracks.set(id, track);

		audio.load();
		if (audio.readyState >= 1) align();

		// Called synchronously from the timer button's click handler so mobile
		// autoplay policy sees the user gesture. Alignment may follow once the
		// cached asset's metadata is available.
		void audio.play().catch(() => this.discard(id, audio));
		return true;
	}

	isActive(id: number): boolean {
		const audio = this.tracks.get(id)?.audio;
		return audio != null && !audio.paused && !audio.ended;
	}

	stop(id: number): void {
		const audio = this.tracks.get(id)?.audio;
		if (audio) this.discard(id, audio);
	}

	stopAll(): void {
		for (const [id, track] of [...this.tracks]) this.discard(id, track.audio);
	}

	private discard(id: number, audio: TimerAudioElement, pause = true): void {
		const track = this.tracks.get(id);
		if (!track || track.audio !== audio) return;
		this.tracks.delete(id);
		audio.removeEventListener('loadedmetadata', track.align);
		audio.removeEventListener('ended', track.ended);
		audio.removeEventListener('error', track.error);
		if (pause) audio.pause();
		audio.src = '';
		audio.load();
	}
}
