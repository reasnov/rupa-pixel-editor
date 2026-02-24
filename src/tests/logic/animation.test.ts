import { describe, it, expect } from 'vitest';
import { AnimationLogic } from '../../lib/logic/animation.js';

describe('AnimationLogic', () => {
	describe('getRulerMarks', () => {
		it('should return correct marks based on zoom', () => {
			const marks = AnimationLogic.getRulerMarks(1000, 1, 1000);
			expect(marks).toContain(0);
			expect(marks).toContain(500);
			expect(marks).toContain(1000);
			expect(marks).toContain(2000);
			expect(marks[marks.length - 1]).toBeGreaterThanOrEqual(2000);
		});

		it('should adjust step to 100 for high zoom (> 2)', () => {
			const highZoom = AnimationLogic.getRulerMarks(1000, 3, 1000);
			expect(highZoom[1] - highZoom[0]).toBe(100);
		});

		it('should adjust step to 1000 for low zoom (< 0.6)', () => {
			const lowZoom = AnimationLogic.getRulerMarks(1000, 0.5, 1000);
			expect(lowZoom[1] - lowZoom[0]).toBe(1000);
		});

		it('should handle zero duration correctly', () => {
			const marks = AnimationLogic.getRulerMarks(0, 1, 0);
			// Should still have at least 30s adjusted by zoom (30000 / 1 = 30000)
			expect(marks[marks.length - 1]).toBe(30000);
		});

		it('should apply padding correctly', () => {
			const totalDuration = 5000;
			const padding = 2000;
			const marks = AnimationLogic.getRulerMarks(totalDuration, 1, padding);
			// Limit = max(5000 + 2000, 30000) = 30000
			expect(marks[marks.length - 1]).toBe(30000);

			const largeDuration = 40000;
			const marksLarge = AnimationLogic.getRulerMarks(largeDuration, 1, padding);
			// Limit = max(40000 + 2000, 30000) = 42000
			expect(marksLarge[marksLarge.length - 1]).toBe(42000);
		});
	});

	describe('formatTimeLabel', () => {
		it('should format milliseconds correctly', () => {
			expect(AnimationLogic.formatTimeLabel(500)).toBe('500ms');
			expect(AnimationLogic.formatTimeLabel(0)).toBe('0ms');
		});

		it('should format seconds correctly without decimals for whole seconds', () => {
			expect(AnimationLogic.formatTimeLabel(1000)).toBe('1s');
			expect(AnimationLogic.formatTimeLabel(2000)).toBe('2s');
		});

		it('should format seconds with one decimal for partial seconds', () => {
			expect(AnimationLogic.formatTimeLabel(1500)).toBe('1.5s');
			expect(AnimationLogic.formatTimeLabel(1234)).toBe('1.2s');
		});
	});

	describe('getFrameOffset', () => {
		it('should calculate correct offset based on duration and scale', () => {
			const frames = [{ duration: 100 }, { duration: 200 }, { duration: 300 }];
			const pxPerMs = 2;
			const minWidth = 10;

			expect(AnimationLogic.getFrameOffset(frames, 0, pxPerMs, minWidth)).toBe(0);
			expect(AnimationLogic.getFrameOffset(frames, 1, pxPerMs, minWidth)).toBe(200); // 100 * 2
			expect(AnimationLogic.getFrameOffset(frames, 2, pxPerMs, minWidth)).toBe(600); // (100 + 200) * 2
		});

		it('should respect minWidth', () => {
			const frames = [{ duration: 10 }];
			const pxPerMs = 1;
			const minWidth = 100;

			// Offset for index 1 (after first frame)
			expect(AnimationLogic.getFrameOffset(frames, 1, pxPerMs, minWidth)).toBe(100);
		});
	});

	describe('getTrackWidth', () => {
		it('should calculate total width correctly', () => {
			const frames = [{ duration: 100 }, { duration: 200 }];
			const pxPerMs = 1;
			const minWidth = 150;

			// max(100*1, 150) + max(200*1, 150) = 150 + 200 = 350
			expect(AnimationLogic.getTrackWidth(frames, pxPerMs, minWidth)).toBe(350);
		});

		it('should return 0 for empty frames', () => {
			expect(AnimationLogic.getTrackWidth([], 1, 10)).toBe(0);
		});
	});
});
