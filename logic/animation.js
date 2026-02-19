/**
 * Animation Logic: Pure mathematical functions for temporal orchestration.
 */
export class AnimationLogic {
    /**
     * Calculates ruler marks based on total duration and current scale.
     * Now ensures the ruler extends significantly beyond the frames.
     */
    static getRulerMarks(totalDuration, zoom, paddingMs = 10000 // 10s extra padding
    ) {
        const marks = [];
        let step = 500;
        if (zoom > 2)
            step = 100;
        if (zoom < 0.6)
            step = 1000;
        const limit = Math.max(totalDuration + paddingMs, 30000 / zoom); // At least 30s adjusted by zoom
        for (let i = 0; i <= limit; i += step) {
            marks.push(i);
        }
        return marks;
    }
    /**
     * Formats milliseconds into human-readable artisan time labels.
     */
    static formatTimeLabel(ms) {
        if (ms >= 1000) {
            return (ms / 1000).toFixed(ms % 1000 === 0 ? 0 : 1) + 's';
        }
        return ms + 'ms';
    }
    /**
     * Calculates the horizontal offset for a frame based on duration and scale.
     */
    static getFrameOffset(frames, index, pxPerMs, minWidth) {
        let offset = 0;
        for (let i = 0; i < index; i++) {
            offset += Math.max(minWidth, frames[i].duration * pxPerMs);
        }
        return offset;
    }
    /**
     * Calculates the total width of the timeline track.
     */
    static getTrackWidth(frames, pxPerMs, minWidth) {
        return frames.reduce((acc, f) => acc + Math.max(minWidth, f.duration * pxPerMs), 0);
    }
}
