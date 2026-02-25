import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FrameState } from '../../lib/state/frame.svelte.js';

// Mock dependencies
vi.mock('../../lib/engine/animation.svelte.js', () => ({
	animation: { elapsedTime: 0 }
}));

describe('FrameState', () => {
	let frame: FrameState;

	beforeEach(() => {
		vi.clearAllMocks();
		frame = new FrameState('Test Frame', { width: 2, height: 2 } as any);
	});

	it('compositePixels should flatten layers correctly', () => {
		// Layer 0 (Bottom): [1, 1, 1, 1]
		// Layer 1 (Top):    [0, 2, 0, 2] (0 is transparent)
		const l1 = frame.layers[0];
		l1.pixels = new Uint32Array([1, 1, 1, 1]);

		const l2 = frame.addLayer('Top');
		l2.pixels = new Uint32Array([0, 2, 0, 2]);

		const composite = frame.compositePixels;
		// Result should be [1, 2, 1, 2]
		expect(Array.from(composite)).toEqual([1, 2, 1, 2]);
	});

	it('should return cached composite if nothing changed', () => {
		frame.layers[0].pixels = new Uint32Array([1, 1, 1, 1]);
		const first = frame.compositePixels;
		const second = frame.compositePixels;

		// Should be exact same reference (cached)
		expect(first).toBe(second);
	});

	it('should respect layer visibility', () => {
		frame.layers[0].pixels = new Uint32Array([1, 1, 1, 1]);
		const l2 = frame.addLayer('Hidden');
		l2.pixels = new Uint32Array([2, 2, 2, 2]);
		l2.isVisible = false;

		const composite = frame.compositePixels;
		expect(composite[0]).toBe(1);
	});

	it('should respect folder hierarchy visibility', () => {
		const group = frame.addGroup('Folder');
		const layer = frame.addLayer('Inside');
		layer.parentId = group.id;
		layer.pixels = new Uint32Array([5, 5, 5, 5]);

		group.isVisible = false;
		expect(frame.compositePixels[0]).toBe(0);

		group.isVisible = true;
		expect(frame.compositePixels[0]).toBe(5);
	});
});
