/**
 * Animation Logic: Pure mathematical functions for temporal orchestration.
 */
export declare class AnimationLogic {
    /**
     * Calculates ruler marks based on total duration and current scale.
     * Now ensures the ruler extends significantly beyond the frames.
     */
    static getRulerMarks(totalDuration: number, zoom: number, paddingMs?: number): number[];
    /**
     * Formats milliseconds into human-readable artisan time labels.
     */
    static formatTimeLabel(ms: number): string;
    /**
     * Calculates the horizontal offset for a frame based on duration and scale.
     */
    static getFrameOffset(frames: Array<{
        duration: number;
    }>, index: number, pxPerMs: number, minWidth: number): number;
    /**
     * Calculates the total width of the timeline track.
     */
    static getTrackWidth(frames: Array<{
        duration: number;
    }>, pxPerMs: number, minWidth: number): number;
}
