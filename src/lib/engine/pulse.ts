import { atelier } from '../state/atelier.svelte.js';
import { sfx } from './audio.js';

/**
 * PulseEngine: Orchestrates the temporal playback of frames.
 */
export class PulseEngine {
	private timer: any = null;

	toggle() {
		if (atelier.project.isPlaying) {
			this.stop();
		} else {
			this.play();
		}
	}

	play() {
		if (atelier.project.isPlaying) return;
		atelier.project.isPlaying = true;
		this.scheduleNextFrame();
		sfx.playStitch();
	}

	stop() {
		atelier.project.isPlaying = false;
		if (this.timer) clearTimeout(this.timer);
	}

	private scheduleNextFrame() {
		if (!atelier.project.isPlaying) return;

		const currentFrame = atelier.project.activeFrame;
		this.timer = setTimeout(() => {
			// Move to next frame or loop back
			atelier.project.activeFrameIndex =
				(atelier.project.activeFrameIndex + 1) % atelier.project.frames.length;

			this.scheduleNextFrame();
		}, currentFrame.duration);
	}
}

export const pulse = new PulseEngine();
