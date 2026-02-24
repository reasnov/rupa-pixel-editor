import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SelectionService } from '../../lib/engine/services/selection.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		cursor: { pos: { x: 0, y: 0 } },
		canvas: {
			width: 10,
			height: 10,
			pixels: new Uint32Array(100),
			incrementVersion: vi.fn(),
			getIndex: vi.fn((x, y) => y * 10 + x)
		},
		selection: {
			isActive: false,
			mask: new Uint8Array(100),
			selectionMode: 'NEW',
			vertices: [],
			initMask: vi.fn(),
			begin: vi.fn(),
			update: vi.fn(),
			clear: vi.fn()
		},
		paletteState: { activeColor: '#FF00FF' },
		studio: { show: vi.fn() }
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: { playDraw: vi.fn(), playScale: vi.fn() }
}));

vi.mock('../../lib/engine/history.js', () => ({
	history: {
		pushPixel: vi.fn(),
		beginBatch: vi.fn(),
		endBatch: vi.fn()
	}
}));

import { editor } from '../../lib/state/editor.svelte.js';
import { history } from '../../lib/engine/history.js';

describe('SelectionService', () => {
	let service: SelectionService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new SelectionService();
		editor.canvas.pixels.fill(0);
		editor.selection.mask = new Uint8Array(100);
		editor.selection.vertices = [];
	});

	it('begin should init mask and start selection', () => {
		service.begin(1, 1);
		expect(editor.selection.initMask).toHaveBeenCalled();
		expect(editor.selection.begin).toHaveBeenCalledWith(1, 1);
	});

	it('fillSelection should update pixels and track in history', () => {
		editor.selection.mask[0] = 1;
		editor.selection.mask[1] = 1;
		(editor as any).activeColor = '#FF00FF';

		service.fillSelection();

		expect(editor.canvas.pixels[0]).toBe(0xffff00ff);
		expect(history.pushPixel).toHaveBeenCalled();
		expect(history.beginBatch).toHaveBeenCalled();
		expect(history.endBatch).toHaveBeenCalled();
	});

	it('magicWand should perform flood fill on mask', () => {
		editor.canvas.pixels[0] = 0xffffffff;
		editor.canvas.pixels[1] = 0xffffffff;
		editor.cursor.pos = { x: 0, y: 0 };

		service.magicWand();

		expect(editor.selection.mask[0]).toBe(1);
		expect(editor.selection.mask[1]).toBe(1);
	});
});
