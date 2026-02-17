import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectService } from '../../lib/engine/services/project.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		project: {
			activeFrame: {
				width: 2,
				height: 2,
				layers: [],
				activeLayerIndex: 0,
				activeLayer: null
			}
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
import { history } from '../../lib/engine/history.js';

describe('ProjectService: Merge Infusions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('mergeLayerDown should combine top layer into bottom layer', () => {
		const service = new ProjectService();

		const bottomLayer = {
			name: 'Bottom',
			pixels: ['#111111', null, '#222222', null],
			isVisible: true
		};
		const topLayer = {
			name: 'Top',
			pixels: [null, '#FF00FF', '#333333', null],
			isVisible: true
		};

		const frame = editor.project.activeFrame;
		frame.layers = [bottomLayer, topLayer] as any;
		frame.activeLayerIndex = 1;

		service.mergeLayerDown();

		// Check merged pixels: ['#111111', '#FF00FF', '#333333', null]
		expect(bottomLayer.pixels).toEqual(['#111111', '#FF00FF', '#333333', null]);
		expect(frame.layers.length).toBe(1);
		expect(frame.activeLayerIndex).toBe(0);
		expect(history.push).toHaveBeenCalled();
	});

	it('mergeLayerDown should do nothing if active layer is the bottom-most', () => {
		const service = new ProjectService();
		const frame = editor.project.activeFrame;
		frame.layers = [{ name: 'Base', pixels: [null] }] as any;
		frame.activeLayerIndex = 0;

		service.mergeLayerDown();

		expect(frame.layers.length).toBe(1);
		expect(history.push).not.toHaveBeenCalled();
	});
});
