/**
 * Kinetic Logic: Pure mathematical functions for motion and interpolation.
 * Implements industry-standard easing and deterministic pixel movement.
 */
export class KineticLogic {
    /**
     * Industry standard Easing Functions (Penner's Equations)
     */
    static Easing = {
        linear: (t) => t,
        easeInQuad: (t) => t * t,
        easeOutQuad: (t) => t * (2 - t),
        easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
        easeInCubic: (t) => t * t * t,
        easeOutCubic: (t) => --t * t * t + 1,
        easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        bounce: (t) => {
            if (t < 1 / 2.75)
                return 7.5625 * t * t;
            if (t < 2 / 2.75)
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            if (t < 2.5 / 2.75)
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    };
    /**
     * Linear interpolation between two points with integer rounding for pixel grid.
     */
    static lerpPosition(start, end, t, easing = 'linear') {
        const progress = this.Easing[easing](t);
        return {
            x: Math.round(start.x + (end.x - start.x) * progress),
            y: Math.round(start.y + (end.y - start.y) * progress)
        };
    }
    /**
     * Interpolate opacity (alpha).
     */
    static lerpScalar(start, end, t, easing = 'linear') {
        const progress = this.Easing[easing](t);
        return start + (end - start) * progress;
    }
}
