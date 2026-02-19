/**
 * Kinetic Logic: Pure mathematical functions for motion and interpolation.
 * Implements industry-standard easing and deterministic pixel movement.
 */
export class KineticLogic {
	/**
	 * Industry standard Easing Functions (Penner's Equations)
	 */
	static Easing = {
		linear: (t: number) => t,
		easeInQuad: (t: number) => t * t,
		easeOutQuad: (t: number) => t * (2 - t),
		easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
		easeInCubic: (t: number) => t * t * t,
		easeOutCubic: (t: number) => --t * t * t + 1,
		easeInOutCubic: (t: number) =>
			t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
		bounce: (t: number) => {
			if (t < 1 / 2.75) return 7.5625 * t * t;
			if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
			if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
			return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
		}
	};

	/**
	 * Linear interpolation between two points with integer rounding for pixel grid.
	 */
	static lerpPosition(
		start: { x: number; y: number },
		end: { x: number; y: number },
		t: number,
		easing: keyof typeof KineticLogic.Easing = 'linear'
	): { x: number; y: number } {
		const progress = this.Easing[easing](t);
		return {
			x: Math.round(start.x + (end.x - start.x) * progress),
			y: Math.round(start.y + (end.y - start.y) * progress)
		};
	}

	/**
	 * Interpolate opacity (alpha).
	 */
	static lerpScalar(
		start: number,
		end: number,
		t: number,
		easing: keyof typeof KineticLogic.Easing = 'linear'
	): number {
		const progress = this.Easing[easing](t);
		return start + (end - start) * progress;
	}
}
