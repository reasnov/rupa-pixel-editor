import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DrawService } from '../../lib/engine/services/draw.js';
import { ManipulationService } from '../../lib/engine/services/manipulation.js';
import { ColorService } from '../../lib/engine/services/color.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		cursor: { pos: { x: 0, y: 0 } },
		canvas: {
			width: 2,
			height: 2,
			pixels: ['#000000', '#111111', '#222222', '#333333'],
			compositePixels: ['#000000', '#111111', '#222222', '#333333'],
			getIndex: vi.fn((x, y) => y * 2 + x),
			getColor: vi.fn((x, y) => ['#000000', '#111111', '#222222', '#333333'][y * 2 + x]),
			clear: vi.fn(),
			reset: vi.fn(),
			clearBuffer: vi.fn(),
			addToBuffer: vi.fn()
		},
		paletteState: {
			activeColor: '#FF00FF',
			swatches: ['#000000', '#FFFFFF'],
			select: vi.fn()
		},
		studio: {
			isPicking: false
		},
		selection: {
			isActive: false,
			indices: []
		}
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: {
		playDraw: vi.fn(),
		playErase: vi.fn(),
		playScale: vi.fn()
	}
}));

vi.mock('../../lib/engine/history.js', () => ({
	history: {
		push: vi.fn(),
		clear: vi.fn(),
		beginBatch: vi.fn(),
		endBatch: vi.fn()
	}
}));

vi.mock('../../lib/engine/fiber.js', () => ({
	FiberEngine: {
		getLinePoints: vi.fn(() => [])
	}
}));

import { editor } from '../../lib/state/editor.svelte.js';
import { sfx } from '../../lib/engine/audio.js';
import { history } from '../../lib/engine/history.js';

describe('Services', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		editor.canvas.pixels = ['#000000', '#111111', '#222222', '#333333'];
	});

	describe('DrawService', () => {
		it('draw should update color and push to history', () => {
			const service = new DrawService();
			editor.cursor.pos = { x: 0, y: 0 };
			editor.paletteState.activeColor = '#FF00FF';

			service.draw();

			expect(editor.canvas.pixels[0]).toBe('#FF00FF');
			expect(history.push).toHaveBeenCalled();
			expect(sfx.playDraw).toHaveBeenCalled();
		});

		it('erase should set color to null', () => {
			const service = new DrawService();
			editor.cursor.pos = { x: 1, y: 1 };

			service.erase();

			expect(editor.canvas.pixels[3]).toBe(null);
			expect(sfx.playErase).toHaveBeenCalled();
		});
	});

	describe('ManipulationService', () => {
		it('flip horizontal should reverse rows', () => {
			const service = new ManipulationService();
			service.flip('horizontal');

			// [0, 1, 2, 3] -> [1, 0, 3, 2]
			expect(editor.canvas.pixels).toEqual(['#111111', '#000000', '#333333', '#222222']);
			expect(history.clear).toHaveBeenCalled();
		});

		it('flip vertical should reverse columns', () => {
			const service = new ManipulationService();
			service.flip('vertical');

			// [0, 1, 2, 3] -> [2, 3, 0, 1]
			expect(editor.canvas.pixels).toEqual(['#222222', '#333333', '#000000', '#111111']);
		});

		it('clearAll should call canvas.clear if confirmed', () => {
			const service = new ManipulationService();
			vi.stubGlobal(
				'confirm',
				vi.fn(() => true)
			);

			service.clearAll();

			expect(editor.canvas.clear).toHaveBeenCalled();
			expect(history.clear).toHaveBeenCalled();
		});
	});

	describe('ColorService', () => {
		it('select should update paletteState', () => {
			const service = new ColorService();
			service.select(1);

			expect(editor.paletteState.select).toHaveBeenCalledWith(1);
			expect(sfx.playScale).toHaveBeenCalledWith(1);
		});

		it('pickFromCanvas should set activeColor from cursor position', () => {
			const service = new ColorService();
			editor.cursor.pos = { x: 1, y: 0 }; // Color #111111
			editor.paletteState.setColor = vi.fn();

			service.pickFromCanvas();

			expect(editor.paletteState.setColor).toHaveBeenCalledWith('#111111');
		});
	});
});
