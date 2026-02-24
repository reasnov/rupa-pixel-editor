import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManipulationService } from '../../lib/engine/services/manipulation.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		backgroundColor: '#FFFFFF',
		activeColor: '#0000FF',
		cursor: { pos: { x: 0, y: 0 } },
		canvas: {
			width: 2,
			height: 2,
			pixels: new Uint32Array([1, 2, 3, 4]),
			getColor: vi.fn(),
			reset: vi.fn(),
			clear: vi.fn(),
			incrementVersion: vi.fn()
		},
		selection: {
			isActive: false,
			activeIndicesSet: new Set(),
			initMask: vi.fn()
		},
		studio: { show: vi.fn() },
		project: {
			activeFrame: {
				layers: [{ type: 'LAYER', pixels: new Uint32Array([1, 2, 3, 4]) }]
			}
		}
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: {
		playDraw: vi.fn(),
		playErase: vi.fn()
	}
}));

vi.mock('../../lib/engine/history.js', () => ({
	history: {
		clear: vi.fn(),
		beginBatch: vi.fn(),
		endBatch: vi.fn(),
		pushPixel: vi.fn()
	}
}));

vi.mock('../../state/i18n.svelte.js', () => ({
	__: vi.fn((k) => k)
}));

import { editor } from '../../lib/state/editor.svelte.js';
import { history } from '../../lib/engine/history.js';

describe('ManipulationService', () => {
	let service: ManipulationService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new ManipulationService();
		editor.canvas.pixels = new Uint32Array([1, 2, 3, 4]);
		editor.project.activeFrame.layers[0].pixels = new Uint32Array([1, 2, 3, 4]);
	});

	it('recolorAll should replace all instances using history API', () => {
		(editor.canvas.getColor as any).mockReturnValue(1);
		editor.canvas.pixels = new Uint32Array([1, 2, 1, 3]);

		service.recolorAll();

		const blueVal = 0xffff0000; // #0000FF in ABGR
		expect(editor.canvas.pixels[0]).toBe(blueVal);
		expect(history.pushPixel).toHaveBeenCalledWith(0, 1, blueVal);
		expect(history.pushPixel).toHaveBeenCalledWith(2, 1, blueVal);
	});
});
