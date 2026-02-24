import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DrawService } from '../../lib/engine/services/draw.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		cursor: { pos: { x: 0, y: 0 } },
		canvas: {
			width: 10,
			height: 10,
			pixels: new Uint32Array(100),
			getIndex: vi.fn((x, y) => y * 10 + x),
			isValidCoord: vi.fn((x, y) => x >= 0 && x < 10 && y >= 0 && y < 10),
			incrementVersion: vi.fn(),
			clearBuffer: vi.fn(),
			addToBuffer: vi.fn(),
			addBatchToBuffer: vi.fn(),
			strokePoints: []
		},
		paletteState: { activeColor: '#FF00FF' },
		studio: {
			brushSize: 1,
			brushShape: 'SQUARE',
			symmetryMode: 'OFF',
			isTilingEnabled: false,
			isAlphaLocked: false,
			isColorLocked: false,
			isShadingLighten: false,
			isShadingDarken: false,
			isShadingDither: false,
			isAirbrushActive: false,
			airbrushDensity: 0.2,
			isPatternBrushActive: false,
			stabilization: 0,
			isPixelPerfect: false,
			show: vi.fn()
		},
		selection: {
			isActive: false,
			isSelected: vi.fn(() => true)
		},
		project: {
			activeFrame: {
				activeLayer: { hasPixel: vi.fn(() => true) }
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
		pushPixel: vi.fn(),
		beginBatch: vi.fn(),
		endBatch: vi.fn(),
		clear: vi.fn()
	}
}));

vi.mock('../../lib/engine/mode.svelte.js', () => ({
	mode: { current: { type: 'PAINT' } }
}));

import { editor } from '../../lib/state/editor.svelte.js';
import { history } from '../../lib/engine/history.js';
import { sfx } from '../../lib/engine/audio.js';
import { mode } from '../../lib/engine/mode.svelte.js';

describe('DrawService', () => {
	let service: DrawService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new DrawService();
		editor.canvas.pixels.fill(0);
		editor.studio.symmetryMode = 'OFF';
		mode.current.type = 'PAINT';
	});

	it('draw should update pixel at cursor position and call history', () => {
		editor.cursor.pos = { x: 0, y: 0 };
		service.draw();
		expect(editor.canvas.pixels[0]).toBe(0xffff00ff);
		expect(history.beginBatch).toHaveBeenCalled();
		expect(history.pushPixel).toHaveBeenCalled();
		expect(history.endBatch).toHaveBeenCalled();
		expect(sfx.playDraw).toHaveBeenCalled();
	});

	it('erase should clear pixel at cursor position', () => {
		editor.cursor.pos = { x: 1, y: 1 };
		editor.canvas.pixels[11] = 0xffffffff;
		service.erase();
		expect(editor.canvas.pixels[11]).toBe(0);
		expect(history.pushPixel).toHaveBeenCalled();
		expect(sfx.playErase).toHaveBeenCalled();
	});

	it('draw should handle symmetry', () => {
		editor.studio.symmetryMode = 'HORIZONTAL';
		editor.cursor.pos = { x: 0, y: 0 };

		service.draw();

		expect(editor.canvas.pixels[0]).toBe(0xffff00ff);
		expect(editor.canvas.pixels[9]).toBe(0xffff00ff);
	});
});
