import { sfx } from './audio.js';
import { editor } from '../state/editor.svelte.js';

type FeedbackType = 'TACTILE' | 'AUDITORY' | 'VISUAL';

/**
 * ResonanceEngine: The Feedback Orchestrator.
 * Manages all sensory output (SFX, Haptics, Visual Glows) in response to system events.
 * Implements the Observer pattern to decouple logic from effects.
 */
export class ResonanceEngine {
	// Master toggle for sensory feedback
	isEnabled = $state(true);

	// Visual Feedback States (for UI binding)
	screenShake = $state(false);
	flashColor = $state<string | null>(null);

	/**
	 * Play a feedback effect.
	 * @param event The semantic name of the event (e.g., 'DRAW', 'ERROR', 'SUCCESS')
	 */
	emit(event: string) {
		if (!this.isEnabled) return;

		// 1. Auditory Layer
		this.playAudio(event);

		// 2. Visual Layer (can be expanded for screen shakes/flashes)
		this.triggerVisual(event);

		// 3. Tactile Layer (Future: Vibration API for mobile/tablets)
		if (typeof navigator.vibrate === 'function') {
			this.triggerHaptic(event);
		}
	}

	private playAudio(event: string) {
		switch (event) {
			case 'DRAW':
				sfx.playDraw();
				break;
			case 'ERASE':
				sfx.playErase();
				break;
			case 'MOVE':
				sfx.playMove();
				break;
			case 'STARTUP':
				sfx.playStartup();
				break;
			case 'READY':
				sfx.playReady();
				break;
			case 'SUCCESS':
				// sfx.playSuccess(); // Placeholder
				break;
			case 'ERROR':
				// sfx.playError(); // Placeholder
				break;
		}
	}

	private triggerVisual(event: string) {
		// Example: Screen shake on large deletions
		if (event === 'CLEAR_CANVAS') {
			this.screenShake = true;
			setTimeout(() => (this.screenShake = false), 200);
		}

		if (event === 'READY') {
			this.flashColor = 'rgba(211, 54, 130, 0.1)';
			setTimeout(() => (this.flashColor = null), 500);
		}
	}

	private triggerHaptic(event: string) {
		// Future proofing for Touch devices
		if (event === 'DRAW') navigator.vibrate(5); // Light tap
		if (event === 'ERASE') navigator.vibrate(10); // Heavier rub
	}
}

export const resonance = new ResonanceEngine();
