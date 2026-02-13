import { sfx } from './audio.js';
import { atelier } from '../state/atelier.svelte.js';

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
	 * @param event The semantic name of the event (e.g., 'STITCH', 'ERROR', 'SUCCESS')
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
			case 'STITCH':
				sfx.playStitch();
				break;
			case 'UNSTITCH':
				sfx.playUnstitch();
				break;
			case 'MOVE':
				sfx.playMove();
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
		if (event === 'CLEAR_LINEN') {
			this.screenShake = true;
			setTimeout(() => (this.screenShake = false), 200);
		}
	}

	private triggerHaptic(event: string) {
		// Future proofing for Touch devices
		if (event === 'STITCH') navigator.vibrate(5); // Light tap
		if (event === 'UNSTITCH') navigator.vibrate(10); // Heavier rub
	}
}

export const resonance = new ResonanceEngine();
