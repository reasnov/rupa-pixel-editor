/**
 * FeedbackEngine: Orchestrates sensory feedback (SFX, Haptics, Visual Glows).
 * Implements the Observer pattern to decouple logic from effects.
 */
export declare class FeedbackEngine {
    isEnabled: boolean;
    screenShake: boolean;
    flashColor: string | null;
    /**
     * Play a feedback effect.
     * @param event The semantic name of the event (e.g., 'DRAW', 'ERROR', 'SUCCESS')
     */
    emit(event: string): void;
    private playAudio;
    private triggerVisual;
    private triggerHaptic;
}
export declare const feedback: FeedbackEngine;
