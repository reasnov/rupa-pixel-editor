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

	reorderVeil(fromIndex: number, toIndex: number) {
		const frame = atelier.project.activeFrame;
		if (fromIndex === toIndex) return;
		if (toIndex < 0 || toIndex >= frame.veils.length) return;

		const [movedVeil] = frame.veils.splice(fromIndex, 1);
		frame.veils.splice(toIndex, 0, movedVeil);

		// Update active index to follow the moved layer
		if (frame.activeVeilIndex === fromIndex) {
			frame.activeVeilIndex = toIndex;
		} else if (fromIndex < frame.activeVeilIndex && toIndex >= frame.activeVeilIndex) {
			frame.activeVeilIndex--;
		} else if (fromIndex > frame.activeVeilIndex && toIndex <= frame.activeVeilIndex) {
			frame.activeVeilIndex++;
		}

		sfx.playMove();
	}

	reorderFrame(fromIndex: number, toIndex: number) {
		const project = atelier.project;
		if (fromIndex === toIndex) return;
		if (toIndex < 0 || toIndex >= project.frames.length) return;

		const [movedFrame] = project.frames.splice(fromIndex, 1);
		project.frames.splice(toIndex, 0, movedFrame);

		if (project.activeFrameIndex === fromIndex) {
			project.activeFrameIndex = toIndex;
		} else if (fromIndex < project.activeFrameIndex && toIndex >= project.activeFrameIndex) {
			project.activeFrameIndex--;
		} else if (fromIndex > project.activeFrameIndex && toIndex <= project.activeFrameIndex) {
			project.activeFrameIndex++;
		}

		sfx.playMove();
	}

	moveVeilUp() {
		const frame = atelier.project.activeFrame;
		const current = frame.activeVeilIndex;
		if (current < frame.veils.length - 1) {
			this.reorderVeil(current, current + 1);
		}
	}

	moveVeilDown() {
		const frame = atelier.project.activeFrame;
		const current = frame.activeVeilIndex;
		if (current > 0) {
			this.reorderVeil(current, current - 1);
		}
	}
}
