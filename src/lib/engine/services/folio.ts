import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../audio.js';

/**
 * FolioService: Manages Frames (Canvases) and Veils (Layers).
 * Handles addition, removal, and navigation within the Folio hierarchy.
 */
export class FolioService {
	// --- Frame Management ---

	addFrame(name?: string) {
		const frame = atelier.project.addFrame(name);
		sfx.playStitch();
		return frame;
	}

	removeFrame(index: number) {
		atelier.project.removeFrame(index);
		sfx.playUnstitch();
	}

	nextFrame() {
		atelier.project.activeFrameIndex =
			(atelier.project.activeFrameIndex + 1) % atelier.project.frames.length;
		sfx.playMove();
	}

	prevFrame() {
		atelier.project.activeFrameIndex =
			(atelier.project.activeFrameIndex - 1 + atelier.project.frames.length) %
			atelier.project.frames.length;
		sfx.playMove();
	}

	// --- Veil Management ---

	addVeil(name?: string) {
		const veil = atelier.project.activeFrame.addVeil(name);
		sfx.playStitch();
		return veil;
	}

	removeVeil(index: number) {
		atelier.project.activeFrame.removeVeil(index);
		sfx.playUnstitch();
	}

	nextVeil() {
		const frame = atelier.project.activeFrame;
		frame.activeVeilIndex = (frame.activeVeilIndex + 1) % frame.veils.length;
		sfx.playMove();
	}

	prevVeil() {
		const frame = atelier.project.activeFrame;
		frame.activeVeilIndex = (frame.activeVeilIndex - 1 + frame.veils.length) % frame.veils.length;
		sfx.playMove();
	}

	toggleLock(index?: number) {
		const veil =
			index !== undefined
				? atelier.project.activeFrame.veils[index]
				: atelier.project.activeFrame.activeVeil;
		if (veil) {
			veil.isLocked = !veil.isLocked;
			sfx.playStitch();
		}
	}

	toggleVisibility(index?: number) {
		const veil =
			index !== undefined
				? atelier.project.activeFrame.veils[index]
				: atelier.project.activeFrame.activeVeil;
		if (veil) {
			veil.isVisible = !veil.isVisible;
			sfx.playStitch();
		}
	}
}
