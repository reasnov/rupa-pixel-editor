import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PersistenceService } from '../../lib/engine/services/persistence.js';

// Mock Dependencies
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		version: '1.0.0',
		paletteState: {
			swatches: ['#000000FF'],
			presets: [{ id: 'custom', name: 'Custom', colors: ['#000000FF'], isDefault: false }]
		},
		canvas: { incrementVersion: vi.fn(), width: 2, height: 2 },
		project: {
			frames: [
				{
					name: 'Frame 1',
					layers: [{ name: 'Layer 1', pixels: new Uint32Array(4).fill(0), type: 'LAYER' }]
				}
			],
			currentFilePath: null,
			setMetadata: vi.fn(),
			fps: 10
		},
		studio: { reportError: vi.fn() }
	}
}));

vi.mock('../../lib/engine/audio.js', () => ({
	sfx: { playDraw: vi.fn() }
}));

vi.mock('../../lib/engine/history.js', () => ({
	history: { clear: vi.fn() }
}));

// Mock StorageLogic
vi.mock('../../lib/logic/storage.js', () => ({
	StorageLogic: {
		saveProject: vi.fn(() => Promise.resolve()),
		loadProject: vi.fn(() => Promise.resolve(null)),
		savePresets: vi.fn(() => Promise.resolve()),
		loadPresets: vi.fn(() => Promise.resolve([]))
	}
}));

import { editor } from '../../lib/state/editor.svelte.js';
import { StorageLogic } from '../../lib/logic/storage.js';

describe('PersistenceService', () => {
	let service: PersistenceService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new PersistenceService();

		// Mock fetch globally for dataURL handling
		global.fetch = vi.fn().mockImplementation(() =>
			Promise.resolve({
				blob: () => Promise.resolve(new Blob(['mock-zip-content'], { type: 'application/zip' }))
			})
		);
	});

	it('autoSaveSession should use StorageLogic with dataURL', async () => {
		await service.autoSaveSession();
		// Wait for internal async FileReader
		await new Promise((r) => setTimeout(r, 150));
		expect(StorageLogic.saveProject).toHaveBeenCalledWith(
			'autosave_session',
			expect.stringContaining('data:application/zip')
		);
	});

	it('restoreLastSession should handle ZIP-based data', async () => {
		const mockZip = 'data:application/zip;base64,UEsDBAoAAAAAA';
		(StorageLogic.loadProject as any).mockReturnValue(Promise.resolve(mockZip));

		// Mock deserialize to avoid actual JSZip parsing of bad mock data
		const deserializeSpy = vi
			.spyOn(service as any, 'deserialize')
			.mockImplementation(() => Promise.resolve());

		const restored = await service.restoreLastSession();
		expect(StorageLogic.loadProject).toHaveBeenCalledWith('autosave_session');
		expect(global.fetch).toHaveBeenCalledWith(mockZip);
		expect(restored).toBe(true);
	});
});
