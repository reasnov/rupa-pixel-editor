import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SelectionService } from '../../lib/engine/services/selection.js';
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
			getColor: vi.fn((x, y) => {
				const pixels = new Uint32Array(100);
				return pixels[y * 10 + x];
			}),
			getIndex: vi.fn((x, y) => y * 10 + x),
			triggerPulse: vi.fn()
		},
		selection: {
			get isActive() {
				return false;
			},
			begin: vi.fn(),
			update: vi.fn(),
			clear: vi.fn(),
			getPoints: vi.fn(() => []),
			getEffectiveBounds: vi.fn(),
			indices: [],
			vertices: []
		},
		paletteState: { activeColor: '#FF00FF' },
		project: { clipboard: null }
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: {
		playDraw: vi.fn(),
		playErase: vi.fn(),
		playScale: vi.fn(),
		playMove: vi.fn()
	}
}));

vi.mock('../../lib/engine/history.js', () => ({
	history: {
		push: vi.fn(),
		beginBatch: vi.fn(),
		endBatch: vi.fn()
	}
}));

import { editor } from '../../lib/state/editor.svelte.js';

describe('Selection & Clipboard Services', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// @ts-ignore
		vi.spyOn(editor.selection, 'isActive', 'get').mockReturnValue(false);
		editor.project.clipboard = null;
		// Reset pixels
		editor.canvas.pixels.fill(0);
	});

	describe('SelectionService', () => {
		it('begin should delegate to state', () => {
			const service = new SelectionService();
			service.begin(1, 1);
			expect(editor.selection.begin).toHaveBeenCalledWith(1, 1);
		});

		it('commit should batch fill selection', () => {
			const service = new SelectionService();
			// @ts-ignore
			editor.selection.getPoints.mockReturnValue([
				{ x: 0, y: 0 },
				{ x: 1, y: 1 }
			]);
			editor.paletteState.activeColor = '#FF00FF';

			service.commit();

			expect(editor.canvas.pixels[0]).toBe(0xffff00ff);
			expect(editor.canvas.pixels[11]).toBe(0xffff00ff);
		});
	});

	describe('ClipboardService', () => {
		it('copy should store data in project clipboard', () => {
			const service = new ClipboardService();
			// @ts-ignore
			editor.selection.getPoints.mockReturnValue([{ x: 5, y: 5 }]);
			// @ts-ignore
			editor.selection.getEffectiveBounds.mockReturnValue({
				x1: 5,
				y1: 5,
				width: 1,
				height: 1
			});
			editor.canvas.compositePixels[55] = 0xffaabbcc;

			service.copy();

			expect(editor.project.clipboard).toEqual({
				width: 1,
				height: 1,
				data: new Uint32Array([0xffaabbcc])
			});
		});

		it('paste should update pixels at cursor position', () => {
			const service = new ClipboardService();
			editor.project.clipboard = {
				width: 1,
				height: 1,
				data: new Uint32Array([0xffddeeff])
			};
			editor.cursor.pos = { x: 2, y: 2 };

			service.paste();

			expect(editor.canvas.pixels[22]).toBe(0xffddeeff);
		});
	});
});
