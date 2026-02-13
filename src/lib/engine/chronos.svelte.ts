import { atelier } from '../state/atelier.svelte.js';

/**
 * ChronosEngine: The Temporal Broker.
 * Manages time, playback, frame interpolation logic, and the "pulse" of the Kinetic Mode.
 * It abstracts "Time" away from the "Structure" (FolioService).
 */
export class ChronosEngine {
	private interval: any = null;

	// Derived State for Rendering
	totalDuration = $derived.by(() => {
		return atelier.project.frames.reduce((acc, f) => acc + f.duration, 0);
	});

	// Get frame at a specific timestamp (for random access playback)
	getFrameAt(ms: number) {
		let accumulated = 0;
		for (let i = 0; i < atelier.project.frames.length; i++) {
			const frame = atelier.project.frames[i];
			if (ms >= accumulated && ms < accumulated + frame.duration) {
				return i;
			}
			accumulated += frame.duration;
		}
		return 0; // Fallback
	}

	startPlayback() {
		if (atelier.project.isPlaying) return;
		atelier.project.isPlaying = true;
		this.tick();
	}

	stopPlayback() {
		atelier.project.isPlaying = false;
		if (this.interval) clearTimeout(this.interval);
		this.interval = null;
	}

	togglePlayback() {
		if (atelier.project.isPlaying) this.stopPlayback();
		else this.startPlayback();
	}

	// The Heartbeat
	private tick() {
		if (!atelier.project.isPlaying) return;

		const currentFrame = atelier.project.activeFrame;
		// Use the specific frame's duration instead of global FPS
		const duration = currentFrame.duration;

		// Advance Frame
		const nextIndex = (atelier.project.activeFrameIndex + 1) % atelier.project.frames.length;

		this.interval = setTimeout(() => {
			atelier.project.activeFrameIndex = nextIndex;
			this.tick(); // Loop
		}, duration);
	}
}

export const chronos = new ChronosEngine();
