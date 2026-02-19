import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MovementService } from '../../lib/engine/services/movement.js';

// Mock editor and sfx
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		canvas: {
			width: 32,
			height: 32
		},
		studio: {
			isTilingEnabled: false
		},
		cursor: {
			pos: { x: 0, y: 0 },
			setPos: vi.fn((x, y) => {
				// @ts-ignore
				import('../../lib/state/editor.svelte.js').then((m) => {
					m.editor.cursor.pos.x = x;
					m.editor.cursor.pos.y = y;
				});
			})
		}
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: {
		playMove: vi.fn()
	}
}));

import { editor } from '../../lib/state/editor.svelte.js';
import { sfx } from '../../lib/engine/audio.js';

describe('MovementService', () => {
	let service: MovementService;

	beforeEach(() => {
		service = new MovementService();
		editor.cursor.pos.x = 0;
		editor.cursor.pos.y = 0;
		vi.clearAllMocks();
	});

	it('move should update cursor position within bounds', () => {
		const moved = service.move(1, 1);
		expect(moved).toBe(true);
		expect(editor.cursor.setPos).toHaveBeenCalledWith(1, 1);
		expect(sfx.playMove).toHaveBeenCalled();
	});

	it('move should respect boundaries', () => {
		// Try to move out of bounds (left/top)
		const moved = service.move(-1, -1);
		expect(moved).toBe(false);
		expect(editor.cursor.setPos).not.toHaveBeenCalled();

		// Move to bottom-right corner
		editor.cursor.pos.x = 31;
		editor.cursor.pos.y = 31;
		const movedOut = service.move(1, 1);
		expect(movedOut).toBe(false);
	});

	it('internalToCartesian should convert coordinates correctly', () => {
		// For 32x32: mid is 16.
		const center = service.internalToCartesian(16, 16, 32, 32);
		expect(center).toEqual({ x: 1, y: -1 });

		const topLeft = service.internalToCartesian(0, 0, 32, 32);
		expect(topLeft).toEqual({ x: -16, y: 16 });
	});

	it('cartesianToInternal should convert back correctly', () => {
		const internal = service.cartesianToInternal(1, 1, 32, 32);
		expect(internal).toEqual({ x: 16, y: 15 });
	});

	it('jumpTo should update cursor position', () => {
		service.jumpTo(1, 1);
		expect(editor.cursor.setPos).toHaveBeenCalledWith(16, 15);
	});
});
