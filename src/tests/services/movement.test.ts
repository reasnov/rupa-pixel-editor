import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MovementService } from '../../lib/engine/services/movement.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		cursor: {
			pos: { x: 5, y: 5 },
			setPos: vi.fn()
		},
		canvas: { width: 10, height: 10 },
		studio: { isTilingEnabled: false }
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: { playMove: vi.fn() }
}));

import { editor } from '../../lib/state/editor.svelte.js';
import { sfx } from '../../lib/engine/audio.js';

describe('MovementService', () => {
	let service: MovementService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new MovementService();
		editor.cursor.pos = { x: 5, y: 5 };
		editor.studio.isTilingEnabled = false;
	});

	it('move should update cursor position by delta', () => {
		const moved = service.move(1, -1);
		expect(moved).toBe(true);
		expect(editor.cursor.setPos).toHaveBeenCalledWith(6, 4);
		expect(sfx.playMove).toHaveBeenCalled();
	});

	it('move should respect canvas boundaries when tiling is off', () => {
		service.move(10, 10);
		expect(editor.cursor.setPos).toHaveBeenCalledWith(9, 9);
	});

	it('jumpTo should move cursor to internal equivalent of cartesian coords', () => {
		// In 10x10, mid is 5.
		// Cartesian X: 0 -> internal 4 (since 10 is even, 0-4 are negative, 5-9 are positive)
		// Logic: if even, mid=5. ix = tx < 0 ? tx + 5 : tx + 5 - 1.
		// tx=0 -> 0 + 5 - 1 = 4.
		service.jumpTo(0, 0);
		expect(editor.cursor.setPos).toHaveBeenCalledWith(4, 4);
	});

	it('jumpHome should reset cursor to (1,1) cartesian', () => {
		service.jumpHome();
		// tx=1 -> 1 + 5 - 1 = 5.
		// ty=1 -> dispY = -1. iy = -1 + 5 = 4.
		expect(editor.cursor.setPos).toHaveBeenCalledWith(5, 4);
	});
});
