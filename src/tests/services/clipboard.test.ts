import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClipboardService } from '../../lib/engine/services/clipboard.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		cursor: { pos: { x: 0, y: 0 } },
		canvas: {
			width: 10,
			height: 10,
			pixels: new Uint32Array(100),
			compositePixels: new Uint32Array(100),
			incrementVersion: vi.fn()
		},
		selection: {
			getPoints: vi.fn(() => []),
			getEffectiveBounds: vi.fn(),
			clear: vi.fn()
		},
		project: { clipboard: null }
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
		pushPixel: vi.fn(),
		beginBatch: vi.fn(),
		endBatch: vi.fn()
	}
}));

import { editor } from '../../lib/state/editor.svelte.js';
import { history } from '../../lib/engine/history.js';
import { sfx } from '../../lib/engine/audio.js';

describe('ClipboardService', () => {
	let service: ClipboardService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new ClipboardService();
		editor.project.clipboard = null;
		editor.canvas.pixels.fill(0);
		editor.canvas.compositePixels.fill(0);
	});

	it('copy should store sub-grid in project clipboard', () => {
		(editor.selection.getPoints as any).mockReturnValue([{ x: 0, y: 0 }]);
		(editor.selection.getEffectiveBounds as any).mockReturnValue({
			x1: 0,
			y1: 0,
			width: 1,
			height: 1
		});
		editor.canvas.compositePixels[0] = 0xff00ff00;

		service.copy();

		expect(editor.project.clipboard).toEqual({
			width: 1,
			height: 1,
			data: new Uint32Array([0xff00ff00])
		});
		expect(sfx.playDraw).toHaveBeenCalled();
	});

	it('cut should copy and then clear pixels from canvas using history', () => {
		(editor.selection.getPoints as any).mockReturnValue([{ x: 0, y: 0 }]);
		(editor.selection.getEffectiveBounds as any).mockReturnValue({
			x1: 0,
			y1: 0,
			width: 1,
			height: 1
		});
		editor.canvas.pixels[0] = 0xff00ff00;
		editor.canvas.compositePixels[0] = 0xff00ff00;

		service.cut();

		expect(editor.project.clipboard?.data[0]).toBe(0xff00ff00);
		expect(editor.canvas.pixels[0]).toBe(0);
		expect(history.pushPixel).toHaveBeenCalledWith(0, 0xff00ff00, 0);
		expect(sfx.playErase).toHaveBeenCalled();
	});

	it('paste should merge clipboard into canvas and track history', () => {
		editor.project.clipboard = {
			width: 1,
			height: 1,
			data: new Uint32Array([0xff0000ff])
		};
		editor.cursor.pos = { x: 5, y: 5 };

		service.paste();

		expect(editor.canvas.pixels[55]).toBe(0xff0000ff);
		expect(history.pushPixel).toHaveBeenCalled();
		expect(sfx.playDraw).toHaveBeenCalled();
	});
});
