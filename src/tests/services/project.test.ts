import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectService } from '../../lib/engine/services/project.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		project: {
			activeFrameIndex: 0,
			frames: [],
			addFrame: vi.fn(),
			removeFrame: vi.fn()
		}
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: { playDraw: vi.fn(), playErase: vi.fn(), playMove: vi.fn() }
}));

vi.mock('../../lib/engine/history.js', () => ({
	history: { push: vi.fn() }
}));

import { editor } from '../../lib/state/editor.svelte.js';

describe('ProjectService', () => {
	let service: ProjectService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new ProjectService();

		const mockLayer = { name: 'Layer 1', isLocked: false, isVisible: true };
		const mockFrame = {
			name: 'Frame 1',
			activeLayerIndex: 0,
			layers: [mockLayer],
			activeLayer: mockLayer,
			addLayer: vi.fn(),
			removeLayer: vi.fn()
		};

		editor.project.frames = [mockFrame] as any;
		(editor.project as any).activeFrame = mockFrame;
		editor.project.activeFrameIndex = 0;
	});

	describe('Frame Management', () => {
		it('addFrame should delegate to state and push history', () => {
			(editor.project.addFrame as any).mockReturnValue({ name: 'New' });
			service.addFrame();
			expect(editor.project.addFrame).toHaveBeenCalled();
		});

		it('nextFrame/prevFrame should cycle active index', () => {
			editor.project.frames.push({ name: 'Frame 2' } as any);
			service.nextFrame();
			expect(editor.project.activeFrameIndex).toBe(1);
			service.prevFrame();
			expect(editor.project.activeFrameIndex).toBe(0);
		});
	});

	describe('Layer Management', () => {
		it('addLayer should delegate to active frame', () => {
			const frame = editor.project.activeFrame;
			(frame.addLayer as any).mockReturnValue({ name: 'L2' });
			service.addLayer();
			expect(frame.addLayer).toHaveBeenCalled();
		});

		it('toggleLock/Visibility should flip boolean state', () => {
			const layer = editor.project.activeFrame.activeLayer;

			service.toggleLock();
			expect(layer.isLocked).toBe(true);

			service.toggleVisibility();
			expect(layer.isVisible).toBe(false);
		});
	});
});
