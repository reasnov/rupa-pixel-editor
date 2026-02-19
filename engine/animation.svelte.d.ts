/**
 * AnimationEngine: Orchestrates time, playback, and frame logic.
 */
export declare class AnimationEngine {
    private interval;
    elapsedTime: number;
    totalDuration: number;
    startPlayback(): void;
    stopPlayback(): void;
    togglePlayback(): void;
    private tick;
}
export declare const animation: AnimationEngine;
