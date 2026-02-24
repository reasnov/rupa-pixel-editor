import { editor } from '../../state/editor.svelte.js';
import { history } from '../history.js';
import { sfx } from '../audio.js';

/**
 * HistoryService: Manages the undo/redo orchestration.
 * Handles state restoration and side effects with binary-optimized buffers.
 */
export class HistoryService {
	undo() {
		const entry = history.undo();
		if (!entry) return;

		if ('isStructural' in entry) {
			entry.undo();
			sfx.playErase();
		} else {
			// Binary Batch Undo
			const currentPixels = new Uint32Array(editor.canvas.pixels);
			const { indices, oldColors } = entry;

			for (let i = indices.length - 1; i >= 0; i--) {
				currentPixels[indices[i]] = oldColors[i];
			}

			editor.canvas.pixels = currentPixels;
			editor.canvas.incrementVersion();
			sfx.playErase();
		}
		editor.cursor.resetInactivityTimer();
	}

	redo() {
		const entry = history.redo();
		if (!entry) return;

		if ('isStructural' in entry) {
			entry.redo();
			sfx.playDraw();
		} else {
			// Binary Batch Redo
			const currentPixels = new Uint32Array(editor.canvas.pixels);
			const { indices, newColors } = entry;

			for (let i = 0; i < indices.length; i++) {
				currentPixels[indices[i]] = newColors[i];
			}

			editor.canvas.pixels = currentPixels;
			editor.canvas.incrementVersion();
			sfx.playDraw();
		}
		editor.cursor.resetInactivityTimer();
	}
}
