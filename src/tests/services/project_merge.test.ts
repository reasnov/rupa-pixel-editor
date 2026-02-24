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
import { history } from '../../lib/engine/history.js';

describe('ProjectService: Merge Infusions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('mergeLayerDown should combine top layer into bottom layer', () => {
		const service = new ProjectService();

		const bottomLayer = {
			name: 'Bottom',
			pixels: new Uint32Array([0xff111111, 0, 0xff222222, 0]),
			isVisible: true
		};
		const topLayer = {
			name: 'Top',
			pixels: new Uint32Array([0, 0xffff00ff, 0xff333333, 0]),
			isVisible: true
		};

		const frame = editor.project.activeFrame;
		frame.layers = [bottomLayer, topLayer] as any;
		frame.activeLayerIndex = 1;

		service.mergeLayerDown();

		// Check merged pixels: [0xff111111, 0xffff00ff, 0xff333333, 0]
		expect(bottomLayer.pixels).toEqual(new Uint32Array([0xff111111, 0xffff00ff, 0xff333333, 0]));
		expect(frame.layers.length).toBe(1);
		expect(frame.activeLayerIndex).toBe(0);
		expect(history.push).toHaveBeenCalled();
	});

	it('mergeLayerDown should do nothing if active layer is the bottom-most', () => {
		const service = new ProjectService();
		const frame = editor.project.activeFrame;
		frame.layers = [{ name: 'Base', pixels: new Uint32Array([0]) }] as any;
		frame.activeLayerIndex = 0;

		service.mergeLayerDown();

		expect(frame.layers.length).toBe(1);
		expect(history.push).not.toHaveBeenCalled();
	});
});
