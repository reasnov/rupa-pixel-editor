import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PersistenceService } from '../../lib/engine/services/persistence.js';

// Mock FrameState and LayerState
vi.mock('../../state/frame.svelte.js', () => ({
	FrameState: class {
		id = '00000000-0000-0000-0000-000000000000';
		layers: any[] = [];
		duration = 100;
		activeLayerIndex = 0;
		activeLayer = {};
		addLayer = vi.fn();
		removeLayer = vi.fn();
		compositePixels = [];
		constructor(public name: string, public width: number, public height: number) {}
	}
}));

vi.mock('../../state/layer.svelte.js', () => ({
	LayerState: class {
		id = '00000000-0000-0000-0000-000000000000';
		isVisible = true;
		isLocked = false;
		opacity = 1.0;
		pixels: any[] = [];
		constructor(public name: string, public width: number, public height: number) {}
		clone() { return this; }
		clear() { this.pixels.fill(null); }
		hasPixel(idx: number) { return this.pixels[idx] !== null; }
	}
}));

// Mock editor and sfx
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		version: '0.6.1',
		paletteState: { swatches: ['#000000', '#FFFFFF'] },
		project: {
			frames: [],
			activeFrameIndex: 0,
			currentFilePath: null,
			setMetadata: vi.fn(),
			lastSaved: null
		}
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: {
		playDraw: vi.fn()
	}
}));

vi.mock('../../lib/engine/history.js', () => ({
	history: {
		clear: vi.fn()
	}
}));

import { editor } from '../../lib/state/editor.svelte.js';

describe('PersistenceService', () => {
	let service: PersistenceService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new PersistenceService();
	});

	it('serialize should return valid JSON', () => {
		editor.paletteState.swatches = ['#111', '#222'];
		// @ts-ignore
		editor.project.frames = [
			{
				id: '00000000-0000-0000-0000-000000000000',
				name: 'Frame 1',
				width: 32,
				height: 32,
				duration: 100,
				activeLayerIndex: 0,
				activeLayer: {},
				addLayer: vi.fn(),
				removeLayer: vi.fn(),
				compositePixels: [],
				layers: [{ id: '00000000-0000-0000-0000-000000000000', name: 'Layer 1', isVisible: true, isLocked: false, pixels: [null], opacity: 1.0, clone: vi.fn(), clear: vi.fn(), hasPixel: vi.fn() }]
			}
		];

		const json = (service as any).serialize();
		const data = JSON.parse(json);

		expect(data.version).toBe('0.6.1');
		expect(data.palette).toEqual(['#111', '#222']);
		expect(data.project.frames[0].name).toBe('Frame 1');
	});

	it('deserialize should restore v0.6.1 data', () => {
		const data = {
			version: '0.6.1',
			palette: ['#AAA', '#BBB'],
			folio: {
				frames: [
					{
						name: 'Test Frame',
						width: 16,
						height: 16,
						layers: [{ name: 'Test Layer', isVisible: true, isLocked: false, pixels: ['#CCC'] }]
					}
				]
			}
		};

		(service as any).deserialize(JSON.stringify(data));

		expect(editor.paletteState.swatches).toEqual(['#AAA', '#BBB']);
		expect(editor.project.frames.length).toBe(1);
		expect(editor.project.frames[0].name).toBe('Test Frame');
	});
});
