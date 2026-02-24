import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ColorService } from '../../lib/engine/services/color.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		activeColor: '#FF0000',
		cursor: { pos: { x: 0, y: 0 } },
		canvas: {
			width: 2,
			height: 2,
			pixels: new Uint32Array(4),
			getColor: vi.fn(),
			incrementVersion: vi.fn()
		},
		paletteState: {
			select: vi.fn(),
			setColor: vi.fn(),
			swatches: ['#000000', '#FFFFFF']
		},
		studio: { isPicking: false },
		selection: { isActive: false, activeIndicesSet: new Set() }
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: {
		playDraw: vi.fn(),
		playScale: vi.fn()
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

describe('ColorService', () => {
	let service: ColorService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new ColorService();
		editor.canvas.pixels.fill(0);
	});

	it('select should update state and play sfx', () => {
		service.select(1);
		expect(editor.paletteState.select).toHaveBeenCalledWith(1);
		expect(sfx.playScale).toHaveBeenCalledWith(1);
	});

	it('setColor should update state and play sfx', () => {
		service.setColor('#00FF00');
		expect(editor.paletteState.setColor).toHaveBeenCalledWith('#00FF00');
		expect(sfx.playDraw).toHaveBeenCalled();
	});

	it('floodFill should fill area and track in history', () => {
		editor.canvas.width = 2;
		editor.canvas.height = 2;
		editor.canvas.pixels = new Uint32Array([0, 0, 0, 0]);
		(editor.canvas.getColor as any).mockReturnValue(0);
		(editor as any).activeColor = '#FFFFFF';

		service.floodFill();

		expect(editor.canvas.pixels[0]).toBe(0xffffffff);
		expect(history.pushPixel).toHaveBeenCalled();
		expect(history.beginBatch).toHaveBeenCalled();
		expect(history.endBatch).toHaveBeenCalled();
	});
});
