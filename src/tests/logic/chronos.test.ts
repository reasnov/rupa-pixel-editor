import { describe, it, expect } from 'vitest';
import { ChronosLogic } from '../../lib/logic/chronos.js';

describe('ChronosLogic', () => {
	it('getRulerMarks should return correct marks based on zoom', () => {
		const marks = ChronosLogic.getRulerMarks(1000, 1, 1000);
		expect(marks).toContain(0);
		expect(marks).toContain(500);
		expect(marks).toContain(1000);
		expect(marks).toContain(2000);
		expect(marks[marks.length - 1]).toBeGreaterThanOrEqual(2000);
	});

	it('getRulerMarks should adjust step based on zoom', () => {
		const highZoom = ChronosLogic.getRulerMarks(1000, 3, 1000);
		expect(highZoom[1] - highZoom[0]).toBe(100);

		const lowZoom = ChronosLogic.getRulerMarks(1000, 0.5, 1000);
		expect(lowZoom[1] - lowZoom[0]).toBe(1000);
	});

	it('formatTimeLabel should format correctly', () => {
		expect(ChronosLogic.formatTimeLabel(500)).toBe('500ms');
		expect(ChronosLogic.formatTimeLabel(1000)).toBe('1s');
		expect(ChronosLogic.formatTimeLabel(1500)).toBe('1.5s');
		expect(ChronosLogic.formatTimeLabel(2000)).toBe('2s');
	});

	it('getFrameOffset should calculate correct offset', () => {
		const frames = [{ duration: 100 }, { duration: 200 }, { duration: 300 }];
		const pxPerMs = 2;
		const minWidth = 50;

		expect(ChronosLogic.getFrameOffset(frames, 0, pxPerMs, minWidth)).toBe(0);
		expect(ChronosLogic.getFrameOffset(frames, 1, pxPerMs, minWidth)).toBe(200);
		expect(ChronosLogic.getFrameOffset(frames, 2, pxPerMs, minWidth)).toBe(600);
	});

	it('getTrackWidth should calculate total width', () => {
		const frames = [{ duration: 100 }, { duration: 200 }];
		const pxPerMs = 1;
		const minWidth = 150;

		// 100*1 < 150 => 150
		// 200*1 > 150 => 200
		expect(ChronosLogic.getTrackWidth(frames, pxPerMs, minWidth)).toBe(350);
	});
});
