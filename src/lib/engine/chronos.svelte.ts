import { editor } from '../state/editor.svelte.js';
import { sfx } from './audio.js';

/**
 * ChronosEngine: The Temporal Broker.
 * Manages time, playback, and frame logic for the professional timeline.
 */
export class ChronosEngine {
	private interval: any = null;
	elapsedTime = $state(0);

	totalDuration = $derived.by(() => {
		return editor.project.frames.reduce((acc, f) => acc + f.duration, 0);
	});

	startPlayback() {
		if (editor.project.isPlaying) return;

		if (editor.project.frames.length <= 1) {
			sfx.playErase();
			return;
		}

		editor.project.isPlaying = true;
		this.elapsedTime = 0;
		for (let i = 0; i < editor.project.activeFrameIndex; i++) {
			this.elapsedTime += editor.project.frames[i].duration;
		}

		sfx.playDraw();
		this.tick();
	}

	stopPlayback() {
		editor.project.isPlaying = false;
		if (this.interval) {
			clearTimeout(this.interval);
			this.interval = null;
		}
	}

	togglePlayback() {
		if (editor.project.isPlaying) this.stopPlayback();
		else this.startPlayback();
	}

	private tick() {
		if (!editor.project.isPlaying) return;

		const currentFrame = editor.project.activeFrame;
		const nextIndex = (editor.project.activeFrameIndex + 1) % editor.project.frames.length;

		this.interval = setTimeout(() => {
			editor.project.activeFrameIndex = nextIndex;

			if (nextIndex === 0) this.elapsedTime = 0;
			else this.elapsedTime += currentFrame.duration;

			this.tick();
		}, currentFrame.duration);
	}
}

export const chronos = new ChronosEngine();
