import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectService } from '../../lib/engine/services/project.js';

const mockId = '00000000-0000-0000-0000-000000000000';

// Mock editor, sfx, history
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		project: {
			frames: [],
			activeFrameIndex: 0,
			activeLayerIndex: 0,
			addFrame: vi.fn((name) => {
				const frame = {
					id: '00000000-0000-0000-0000-000000000000',
					name: name || 'Frame',
					layers: [],
					activeLayerIndex: 0,
					selectedLayerIndices: new Set([0]),
					addLayer: vi.fn(),
					addGroup: vi.fn(),
					width: 32,
					height: 32,
					duration: 100,
					opacity: 1.0,
					activeLayer: {
						id: '00000000-0000-0000-0000-000000000000',
						name: 'L1',
						pixels: new Uint32Array(32 * 32),
						isVisible: true,
						isLocked: false,
						opacity: 1.0,
						type: 'LAYER',
						parentId: null,
						isCollapsed: false,
						clone: vi.fn(),
						clear: vi.fn(),
						hasPixel: vi.fn()
					},
					removeLayer: vi.fn(),
					compositePixels: new Uint32Array(32 * 32)
				};
				// @ts-ignore
				editor.project.frames.push(frame);
				// @ts-ignore
				editor.project.activeFrameIndex = editor.project.frames.length - 1;
				return frame;
			}),
			removeFrame: vi.fn((idx) => {
				// @ts-ignore
				editor.project.frames.splice(idx, 1);
				// @ts-ignore
				editor.project.activeFrameIndex = Math.max(0, editor.project.activeFrameIndex - 1);
			}),
			get activeFrame() {
				// @ts-ignore
				return editor.project.frames[editor.project.activeFrameIndex];
			}
		}
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: {
		playDraw: vi.fn(),
		playErase: vi.fn(),
		playMove: vi.fn()
	}
}));

vi.mock('../../lib/engine/history.js', () => ({
	history: {
		push: vi.fn()
	}
}));

import { editor } from '../../lib/state/editor.svelte.js';
import { history } from '../../lib/engine/history.js';

describe('ProjectService', () => {
	let service: ProjectService;

	beforeEach(() => {
		vi.clearAllMocks();
		// @ts-ignore
		editor.project.frames = [
			{
				id: '00000000-0000-0000-0000-000000000000',
				name: 'Frame 1',
				layers: [],
				activeLayerIndex: 0,
				selectedLayerIndices: new Set([0]),
				addLayer: vi.fn(),
				addGroup: vi.fn(),
				width: 32,
				height: 32,
				duration: 100,
				opacity: 1.0,
				activeLayer: {
					id: '00000000-0000-0000-0000-000000000000',
					name: 'L1',
					pixels: new Uint32Array(32 * 32),
					isVisible: true,
					isLocked: false,
					opacity: 1.0,
					type: 'LAYER',
					parentId: null,
					isCollapsed: false,
					clone: vi.fn(),
					clear: vi.fn(),
					hasPixel: vi.fn()
				},
				removeLayer: vi.fn(),
				compositePixels: new Uint32Array(32 * 32)
			}
		];
		editor.project.activeFrameIndex = 0;
		service = new ProjectService();
	});

	it('addFrame should create a new frame and push history', () => {
		service.addFrame('New Frame');

		expect(editor.project.frames.length).toBe(2);
		expect(editor.project.frames[1].name).toBe('New Frame');
		expect(history.push).toHaveBeenCalledWith(expect.objectContaining({ isStructural: true }));
	});

	it('removeFrame should not remove the last frame', () => {
		service.removeFrame(0);
		expect(editor.project.frames.length).toBe(1);
	});

	it('nextFrame should cycle correctly', () => {
		editor.project.addFrame('Frame 2');
		editor.project.activeFrameIndex = 0;

		service.nextFrame();
		expect(editor.project.activeFrameIndex).toBe(1);

		service.nextFrame();
		expect(editor.project.activeFrameIndex).toBe(0);
	});

	it('toggleVisibility should flip the state of the active layer', () => {
		const mockLayer = { isVisible: true };
		// @ts-ignore
		editor.project.activeFrame.activeLayer = mockLayer;
		// @ts-ignore
		editor.project.activeFrame.layers = [mockLayer];

		service.toggleVisibility();
		expect(mockLayer.isVisible).toBe(false);
	});
});
