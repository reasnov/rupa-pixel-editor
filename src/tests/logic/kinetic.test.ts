import { describe, it, expect } from 'vitest';
import { KineticLogic } from '../../lib/logic/kinetic.js';

describe('KineticLogic', () => {
	describe('Easing', () => {
		it('linear easing should return t exactly', () => {
			expect(KineticLogic.Easing.linear(0.5)).toBe(0.5);
			expect(KineticLogic.Easing.linear(0)).toBe(0);
			expect(KineticLogic.Easing.linear(1)).toBe(1);
		});

		it('easeInQuad should return squared value', () => {
			expect(KineticLogic.Easing.easeInQuad(0.5)).toBe(0.25);
		});

		it('easeOutQuad should return 1-(1-t)^2', () => {
			expect(KineticLogic.Easing.easeOutQuad(0.5)).toBe(0.75);
		});

		it('bounce should reach 1 eventually', () => {
			expect(KineticLogic.Easing.bounce(1)).toBe(1);
		});
	});

	describe('Lerp', () => {
		it('lerpPosition should move point correctly with rounding', () => {
			const start = { x: 0, y: 0 };
			const end = { x: 10, y: 10 };

			// Linear half-way should be (5,5)
			const half = KineticLogic.lerpPosition(start, end, 0.5);
			expect(half).toEqual({ x: 5, y: 5 });

			// Quadratic ease-in half-way (progress 0.25) should be (2.5, 2.5) -> (3,3) rounded
			const easeInHalf = KineticLogic.lerpPosition(start, end, 0.5, 'easeInQuad');
			expect(easeInHalf).toEqual({ x: 3, y: 3 });
		});

		it('lerpScalar should move value correctly', () => {
			const start = 0;
			const end = 1.0;
			expect(KineticLogic.lerpScalar(start, end, 0.5)).toBe(0.5);
			expect(KineticLogic.lerpScalar(start, end, 0.5, 'easeInQuad')).toBe(0.25);
		});
	});
});
