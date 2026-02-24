import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectService } from '../../lib/engine/services/project.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		project: {
			activeFrameIndex: 0,
			frames: [],
			selectedFrameIndices: new Set(),
			get activeFrame() {
				return this.frames[this.activeFrameIndex];
			},
			addFrame: vi.fn((name) => {
				const f: any = {
					name,
					width: 2,
					height: 2,
					layers: [],
					activeLayerIndex: 0,
					selectedLayerIndices: new Set([0]),
					get activeLayer() {
						return this.layers[this.activeLayerIndex];
					},
					addLayer: vi.fn((n) => {
						const l = { name: n, pixels: new Uint32Array(4) };
						f.layers.push(l);
						return l;
					})
				};
				editor.project.frames.push(f);
				return f;
			})
		},
		canvas: {
			incrementVersion: vi.fn()
		}
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: {
		playDraw: vi.fn(),
		playErase: vi.fn(),
		playMove: vi.fn()
	}
}));

vi.mock('../../lib/engine/history.js', () => ({
	history: {
		push: vi.fn()
	}
}));

import { editor } from '../../lib/state/editor.svelte.js';

describe('ProjectService - Merging', () => {
	let service: ProjectService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new ProjectService();
		editor.project.frames = [
			{
				name: 'Frame 1',
				width: 2,
				height: 2,
				activeLayerIndex: 1,
				selectedLayerIndices: new Set([0, 1]),
				layers: [
					{ name: 'Bottom', pixels: new Uint32Array([1, 1, 1, 1]) },
					{ name: 'Top', pixels: new Uint32Array([0, 2, 0, 2]) }
				],
				get activeLayer() {
					return this.layers[this.activeLayerIndex];
				}
			} as any
		];
		editor.project.activeFrameIndex = 0;
	});

	it('mergeLayerDown should combine active and below', () => {
		service.mergeLayerDown();

		const frame = editor.project.activeFrame;
		expect(frame.layers.length).toBe(1);
		// Bottom was [1,1,1,1], Top was [0,2,0,2] -> Merged [1,2,1,2]
		expect(frame.layers[0].pixels).toEqual(new Uint32Array([1, 2, 1, 2]));
	});

	it('mergeSelectedLayers should combine multiple layers into first selected', () => {
		editor.project.activeFrame.layers.push({
			name: 'Third',
			pixels: new Uint32Array([3, 0, 3, 0])
		} as any);
		editor.project.activeFrame.selectedLayerIndices = new Set([0, 2]); // Bottom and Third

		service.mergeSelectedLayers();

		const frame = editor.project.activeFrame;
		expect(frame.layers.length).toBe(2); // Top remains
		// Bottom [1,1,1,1] + Third [3,0,3,0] -> [3,1,3,1] (Third is above Bottom in stack order 0, 1, 2)
		// Wait, stack is [Bottom(0), Top(1), Third(2)]. Selected [0, 2].
		// order for mergeLayers: [0, 2] -> result [3, 1, 3, 1]
		expect(frame.layers[0].pixels).toEqual(new Uint32Array([3, 1, 3, 1]));
	});

	it('mergeFrames should combine composites into new frame layers', () => {
		editor.project.frames = [
			{
				name: 'Frame 1',
				width: 2,
				height: 2,
				get compositePixels() {
					return new Uint32Array([1, 2, 1, 2]);
				},
				layers: []
			} as any,
			{
				name: 'Frame 2',
				width: 2,
				height: 2,
				get compositePixels() {
					return new Uint32Array([9, 9, 9, 9]);
				},
				layers: [],
				isVisible: true
			} as any
		];
		editor.project.selectedFrameIndices = new Set([0, 1]);

		service.mergeFrames();

		expect(editor.project.frames.length).toBe(3); // Frame 1, Frame 2, Merged
		const merged = editor.project.frames[2];
		expect(merged.layers.length).toBe(2);
		expect(merged.layers[0].pixels).toEqual(new Uint32Array([1, 2, 1, 2]));
		expect(merged.layers[1].pixels).toEqual(new Uint32Array([9, 9, 9, 9]));
	});
});
