/**
 * Kinetic Logic: Pure mathematical functions for motion and interpolation.
 * Implements industry-standard easing and deterministic pixel movement.
 */
export declare class KineticLogic {
    /**
     * Industry standard Easing Functions (Penner's Equations)
     */
    static Easing: {
        linear: (t: number) => number;
        easeInQuad: (t: number) => number;
        easeOutQuad: (t: number) => number;
        easeInOutQuad: (t: number) => number;
        easeInCubic: (t: number) => number;
        easeOutCubic: (t: number) => number;
        easeInOutCubic: (t: number) => number;
        bounce: (t: number) => number;
    };
    /**
     * Linear interpolation between two points with integer rounding for pixel grid.
     */
    static lerpPosition(start: {
        x: number;
        y: number;
    }, end: {
        x: number;
        y: number;
    }, t: number, easing?: keyof typeof KineticLogic.Easing): {
        x: number;
        y: number;
    };
    /**
     * Interpolate opacity (alpha).
     */
    static lerpScalar(start: number, end: number, t: number, easing?: keyof typeof KineticLogic.Easing): number;
}
