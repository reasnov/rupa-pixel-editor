import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditorEngine } from '../../lib/engine/editor.svelte.js';

// Mock State
vi.mock('../../lib/state/editor.svelte.js', () => ({
	editor: {
		studio: {
			mount: vi.fn(),
			isAudioReady: false
		},
		canvas: { mount: vi.fn() },
		cursor: { resetInactivityTimer: vi.fn() },
		project: { frames: [] }
	}
}));

// Mock Audio & Ambient
vi.mock('../../lib/engine/audioContext.js', () => ({
	studioAudio: { resume: vi.fn(() => Promise.resolve()) }
}));

vi.mock('../../lib/engine/ambient.js', () => ({
	ambient: { start: vi.fn() }
}));

// Mock StorageLogic to avoid IndexedDB errors in Node environment
vi.mock('../../lib/logic/storage.js', () => ({
	StorageLogic: {
		loadProject: vi.fn(() => Promise.resolve(null)),
		saveProject: vi.fn(() => Promise.resolve()),
		loadPresets: vi.fn(() => Promise.resolve([])),
		savePresets: vi.fn(() => Promise.resolve())
	}
}));

import { editor as state } from '../../lib/state/editor.svelte.js';
import { studioAudio } from '../../lib/engine/audioContext.js';
import { ambient } from '../../lib/engine/ambient.js';

describe('EditorEngine: Audio Activation', () => {
	let engine: EditorEngine;

	beforeEach(() => {
		vi.clearAllMocks();
		state.studio.isAudioReady = false;
		engine = new EditorEngine();
	});

	it('should resume audio context and start ambient on first interaction', async () => {
		engine.mount();

		// Simulate interaction
		const event = new PointerEvent('pointerdown');
		window.dispatchEvent(event);

		// Wait for async resume
		await new Promise((r) => setTimeout(r, 0));

		expect(studioAudio.resume).toHaveBeenCalled();
		expect(ambient.start).toHaveBeenCalled();
		expect(state.studio.isAudioReady).toBe(true);
	});

	it('should not resume audio again if already ready', async () => {
		state.studio.isAudioReady = true;
		engine.mount();

		const event = new PointerEvent('pointerdown');
		window.dispatchEvent(event);

		expect(studioAudio.resume).not.toHaveBeenCalled();
	});
});
