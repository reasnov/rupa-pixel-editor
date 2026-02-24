import { describe, it, expect } from 'vitest';
import { KineticLogic } from '../../lib/logic/kinetic.js';

describe('KineticLogic', () => {
	describe('Easing Functions', () => {
		const easings = KineticLogic.Easing;

		it('linear should be identity', () => {
			expect(easings.linear(0)).toBe(0);
			expect(easings.linear(0.5)).toBe(0.5);
			expect(easings.linear(1)).toBe(1);
		});

		it('quadratic easing should be correct', () => {
			expect(easings.easeInQuad(0.5)).toBe(0.25);
			expect(easings.easeOutQuad(0.5)).toBe(0.75);
			expect(easings.easeInOutQuad(0.25)).toBe(0.125);
		});

		it('cubic easing should be correct', () => {
			expect(easings.easeInCubic(0.5)).toBe(0.125);
			expect(easings.easeOutCubic(0.5)).toBe(0.875);
		});

		it('bounce should start at 0 and end at 1', () => {
			expect(easings.bounce(0)).toBe(0);
			expect(easings.bounce(1)).toBe(1);
			expect(easings.bounce(0.5)).toBeGreaterThan(0.7); // Mid-bounce
		});
	});

	describe('Interpolation', () => {
		it('lerpPosition should handle linear movement', () => {
			const start = { x: 0, y: 0 };
			const end = { x: 100, y: 100 };
			expect(KineticLogic.lerpPosition(start, end, 0.5)).toEqual({ x: 50, y: 50 });
		});

		it('lerpPosition should apply easing', () => {
			const start = { x: 0, y: 0 };
			const end = { x: 100, y: 100 };
			// easeInQuad at 0.5 is 0.25 progress
			expect(KineticLogic.lerpPosition(start, end, 0.5, 'easeInQuad')).toEqual({ x: 25, y: 25 });
		});

		it('lerpScalar should handle alpha values', () => {
			expect(KineticLogic.lerpScalar(0, 1, 0.5)).toBe(0.5);
			expect(KineticLogic.lerpScalar(1, 0, 0.5)).toBe(0.5);
			expect(KineticLogic.lerpScalar(0, 1, 0.5, 'easeInQuad')).toBe(0.25);
		});
	});
});
