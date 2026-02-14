import { atelier } from '../state/atelier.svelte.js';
import { sfx } from './audio.js';

/**
 * ChronosEngine: The Temporal Broker.
 * Manages time, playback, frame interpolation logic, and the "pulse" of the Kinetic Mode.
 * It is the single source of truth for temporal orchestration.
 */
export class ChronosEngine {
	private interval: any = null;
	elapsedTime = $state(0); // Track global playback time for playhead

	// Derived State for Rendering
	totalDuration = $derived.by(() => {
		return atelier.project.frames.reduce((acc, f) => acc + f.duration, 0);
	});

	/**
	 * startPlayback: Begins the temporal sequence.
	 * Requires at least 2 frames to function.
	 */
	startPlayback() {
		if (atelier.project.isPlaying) return;

		// Safety Protocol: Cannot play a static weave
		if (atelier.project.frames.length <= 1) {
			sfx.playUnstitch(); // Error feedback
			return;
		}

		atelier.project.isPlaying = true;
		// Reset elapsed time to the start of current frame
		this.elapsedTime = 0;
		for(let i=0; i<atelier.project.activeFrameIndex; i++) {
			this.elapsedTime += atelier.project.frames[i].duration;
		}

		sfx.playStitch(); // Success feedback
		this.tick();
	}

	stopPlayback() {
		atelier.project.isPlaying = false;
		if (this.interval) {
			clearTimeout(this.interval);
			this.interval = null;
		}
	}

	togglePlayback() {
		if (atelier.project.isPlaying) this.stopPlayback();
		else this.startPlayback();
	}

	/**
	 * The Heartbeat of the Studio.
	 */
	private tick() {
		if (!atelier.project.isPlaying) return;

		const currentFrame = atelier.project.activeFrame;
		const nextIndex = (atelier.project.activeFrameIndex + 1) % atelier.project.frames.length;

		this.interval = setTimeout(() => {
			// Advance to next thread of time
			atelier.project.activeFrameIndex = nextIndex;
			
			// Loop elapsed time if wrapping
			if (nextIndex === 0) this.elapsedTime = 0;
			else this.elapsedTime += currentFrame.duration;

			this.tick(); // Loop the pulse
		}, currentFrame.duration);
	}
}

export const chronos = new ChronosEngine();
