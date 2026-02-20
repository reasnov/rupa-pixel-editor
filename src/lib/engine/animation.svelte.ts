import { editor } from '../state/editor.svelte.js';
import { sfx } from './audio.js';

/**
 * AnimationEngine: Orchestrates time, playback, and frame logic.
 */
export class AnimationEngine {
	private interval: any = null;
	elapsedTime = $state(0);

	totalDuration = $derived.by(() => {
		const fpsDuration = 1000 / editor.project.fps;
		return editor.project.frames.length * fpsDuration;
	});

	startPlayback() {
		if (editor.project.isPlaying) return;

		if (editor.project.frames.length <= 1) {
			sfx.playErase();
			return;
		}

		editor.project.isPlaying = true;
		this.elapsedTime = 0;
		const fpsDuration = 1000 / editor.project.fps;
		for (let i = 0; i < editor.project.activeFrameIndex; i++) {
			this.elapsedTime += fpsDuration;
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

		// Calculate duration based on project FPS (Master Pace)
		// 1000ms / FPS = duration per frame
		const frameDuration = Math.max(16, 1000 / editor.project.fps);

		// Find next visible frame
		let nextIndex = (editor.project.activeFrameIndex + 1) % editor.project.frames.length;
		let attempts = 0;
		while (!editor.project.frames[nextIndex].isVisible && attempts < editor.project.frames.length) {
			nextIndex = (nextIndex + 1) % editor.project.frames.length;
			attempts++;
		}

		// If no visible frames or only one, stop playback or stay
		if (!editor.project.frames[nextIndex].isVisible) {
			this.stopPlayback();
			return;
		}

		this.interval = setTimeout(() => {
			editor.project.activeFrameIndex = nextIndex;

			if (nextIndex === 0) this.elapsedTime = 0;
			else this.elapsedTime += frameDuration;

			this.tick();
		}, frameDuration);
	}
}

export const animation = new AnimationEngine();
