import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClipboardService } from '../../lib/engine/services/clipboard.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		canvas: {
			width: 10,
			height: 10,
			compositePixels: new Uint32Array(100),
			pixels: new Uint32Array(100),
			triggerPulse: vi.fn()
		},
		selection: {
			getPoints: vi.fn(() => []),
			getEffectiveBounds: vi.fn(() => null),
			clear: vi.fn()
		},
		cursor: {
			pos: { x: 0, y: 0 }
		},
		project: {
			clipboard: null
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
		beginBatch: vi.fn(),
		endBatch: vi.fn(),
		push: vi.fn()
	}
}));

import { editor } from '../../lib/state/editor.svelte.js';
import { sfx } from '../../lib/engine/audio.js';
import { history } from '../../lib/engine/history.js';

describe('ClipboardService', () => {
	let service: ClipboardService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new ClipboardService();
		editor.project.clipboard = null;
		editor.canvas.compositePixels.fill(0);
		editor.canvas.pixels.fill(0);
	});

	it('copy should store data in project clipboard', () => {
		const points = [
			{ x: 1, y: 1 },
			{ x: 2, y: 1 }
		];
		const bounds = { x1: 1, y1: 1, width: 2, height: 1 };

		(editor.selection.getPoints as any).mockReturnValue(points);
		(editor.selection.getEffectiveBounds as any).mockReturnValue(bounds);

		// Set some dummy data at (1,1) -> Index 11
		editor.canvas.compositePixels[11] = 0xff0000ff; // Red
		editor.canvas.compositePixels[12] = 0xff00ff00; // Green

		service.copy();

		expect(editor.project.clipboard).not.toBeNull();
		expect(editor.project.clipboard?.width).toBe(2);
		expect(editor.project.clipboard?.data[0]).toBe(0xff0000ff);
		expect(sfx.playDraw).toHaveBeenCalled();
	});

	it('paste should update canvas pixels and push to history', () => {
		const clipboardData = new Uint32Array([0xffffffff]); // White
		editor.project.clipboard = { width: 1, height: 1, data: clipboardData };
		editor.cursor.pos = { x: 5, y: 5 }; // Index 55

		service.paste();

		expect(editor.canvas.pixels[55]).toBe(0xffffffff);
		expect(history.push).toHaveBeenCalled();
		expect(editor.canvas.triggerPulse).toHaveBeenCalled();
	});

	it('cut should copy and clear selection', () => {
		const points = [{ x: 1, y: 1 }];
		const bounds = { x1: 1, y1: 1, width: 1, height: 1 };

		(editor.selection.getPoints as any).mockReturnValue(points);
		(editor.selection.getEffectiveBounds as any).mockReturnValue(bounds);

		// Set in both because copy reads from composite, but cut clears from pixels
		editor.canvas.compositePixels[11] = 0xffffffff;
		editor.canvas.pixels[11] = 0xffffffff;

		service.cut();

		expect(editor.project.clipboard?.data[0]).toBe(0xffffffff);
		expect(editor.canvas.pixels[11]).toBe(0); // Cleared
		expect(editor.selection.clear).toHaveBeenCalled();
		expect(sfx.playErase).toHaveBeenCalled();
	});
});
