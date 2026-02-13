import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';

/**
 * FolioService: Manages Frames (Canvases) and Veils (Layers).
 * Handles addition, removal, and navigation within the Folio hierarchy.
 */
export class FolioService {
	// --- Frame Management ---

	addFrame(name?: string) {
		const project = atelier.project;
		const prevIndex = project.activeFrameIndex;
		const frame = project.addFrame(name);
		const newIndex = project.activeFrameIndex;

		history.push({
			isStructural: true,
			label: 'Add Frame',
			undo: () => {
				project.frames.splice(newIndex, 1);
				project.activeFrameIndex = prevIndex;
			},
			redo: () => {
				project.frames.splice(newIndex, 0, frame);
				project.activeFrameIndex = newIndex;
			}
		});

		sfx.playStitch();
		return frame;
	}

	removeFrame(index: number) {
		const project = atelier.project;
		if (project.frames.length <= 1) return;

		const removedFrame = project.frames[index];
		const prevIndex = project.activeFrameIndex;

		project.removeFrame(index);
		const newIndex = project.activeFrameIndex;

		history.push({
			isStructural: true,
			label: 'Remove Frame',
			undo: () => {
				project.frames.splice(index, 0, removedFrame);
				project.activeFrameIndex = prevIndex;
			},
			redo: () => {
				project.removeFrame(index);
				project.activeFrameIndex = newIndex;
			}
		});

		sfx.playUnstitch();
	}

	duplicateFrame(index: number) {
		const project = atelier.project;
		const source = project.frames[index];
		const prevIndex = project.activeFrameIndex;

		const newFrame = project.addFrame(`${source.name} (Copy)`);
		const newIndex = project.activeFrameIndex;

		// Copy dimensions and durations
		newFrame.width = source.width;
		newFrame.height = source.height;
		newFrame.duration = source.duration;

		// Copy veils and their stitches
		newFrame.veils = source.veils.map((v) => {
			const newVeil = v.clone(source.width, source.height);
			return newVeil;
		});

		history.push({
			isStructural: true,
			label: 'Duplicate Frame',
			undo: () => {
				project.frames.splice(newIndex, 1);
				project.activeFrameIndex = prevIndex;
			},
			redo: () => {
				project.frames.splice(newIndex, 0, newFrame);
				project.activeFrameIndex = newIndex;
			}
		});

		sfx.playStitch();
	}

	nextFrame() {
		const project = atelier.project;
		const prevIndex = project.activeFrameIndex;
		project.activeFrameIndex = (project.activeFrameIndex + 1) % project.frames.length;

		history.push({
			isStructural: true,
			label: 'Next Frame',
			undo: () => (project.activeFrameIndex = prevIndex),
			redo: () => (project.activeFrameIndex = (prevIndex + 1) % project.frames.length)
		});

		sfx.playMove();
	}

	prevFrame() {
		const project = atelier.project;
		const prevIndex = project.activeFrameIndex;
		project.activeFrameIndex =
			(project.activeFrameIndex - 1 + project.frames.length) % project.frames.length;

		history.push({
			isStructural: true,
			label: 'Prev Frame',
			undo: () => (project.activeFrameIndex = prevIndex),
			redo: () =>
				(project.activeFrameIndex = (prevIndex - 1 + project.frames.length) % project.frames.length)
		});

		sfx.playMove();
	}

	// --- Veil Management ---

	addVeil(name?: string) {
		const frame = atelier.project.activeFrame;
		const prevIndex = frame.activeVeilIndex;
		const veil = frame.addVeil(name);
		const newIndex = frame.activeVeilIndex;

		history.push({
			isStructural: true,
			label: 'Add Veil',
			undo: () => {
				frame.veils.splice(newIndex, 1);
				frame.activeVeilIndex = prevIndex;
			},
			redo: () => {
				frame.veils.splice(newIndex, 0, veil);
				frame.activeVeilIndex = newIndex;
			}
		});

		sfx.playStitch();
		return veil;
	}

	removeVeil(index: number) {
		const frame = atelier.project.activeFrame;
		if (frame.veils.length <= 1) return;

		const removedVeil = frame.veils[index];
		const prevIndex = frame.activeVeilIndex;

		frame.removeVeil(index);
		const newIndex = frame.activeVeilIndex;

		history.push({
			isStructural: true,
			label: 'Remove Veil',
			undo: () => {
				frame.veils.splice(index, 0, removedVeil);
				frame.activeVeilIndex = prevIndex;
			},
			redo: () => {
				frame.removeVeil(index);
				frame.activeVeilIndex = newIndex;
			}
		});

		sfx.playUnstitch();
	}

	duplicateVeil(index: number) {
		const frame = atelier.project.activeFrame;
		const source = frame.veils[index];
		const prevIndex = frame.activeVeilIndex;

		const newVeil = source.clone(frame.width, frame.height);
		newVeil.name = `${source.name} (Copy)`;

		// Insert above source
		const newIndex = index + 1;
		frame.veils.splice(newIndex, 0, newVeil);
		frame.activeVeilIndex = newIndex;

		history.push({
			isStructural: true,
			label: 'Duplicate Veil',
			undo: () => {
				frame.veils.splice(newIndex, 1);
				frame.activeVeilIndex = prevIndex;
			},
			redo: () => {
				frame.veils.splice(newIndex, 0, newVeil);
				frame.activeVeilIndex = newIndex;
			}
		});

		sfx.playStitch();
	}

	nextVeil() {
		const frame = atelier.project.activeFrame;
		const prevIndex = frame.activeVeilIndex;
		frame.activeVeilIndex = (frame.activeVeilIndex + 1) % frame.veils.length;

		history.push({
			isStructural: true,
			label: 'Next Veil',
			undo: () => (frame.activeVeilIndex = prevIndex),
			redo: () => (frame.activeVeilIndex = (prevIndex + 1) % frame.veils.length)
		});

		sfx.playMove();
	}

	prevVeil() {
		const frame = atelier.project.activeFrame;
		const prevIndex = frame.activeVeilIndex;
		frame.activeVeilIndex = (frame.activeVeilIndex - 1 + frame.veils.length) % frame.veils.length;

		history.push({
			isStructural: true,
			label: 'Prev Veil',
			undo: () => (frame.activeVeilIndex = prevIndex),
			redo: () =>
				(frame.activeVeilIndex = (prevIndex - 1 + frame.veils.length) % frame.veils.length)
		});

		sfx.playMove();
	}

	toggleLock(index?: number) {
		const veil =
			index !== undefined
				? atelier.project.activeFrame.veils[index]
				: atelier.project.activeFrame.activeVeil;
		if (veil) {
			const prevState = veil.isLocked;
			veil.isLocked = !veil.isLocked;

			history.push({
				isStructural: true,
				label: 'Toggle Veil Lock',
				undo: () => (veil.isLocked = prevState),
				redo: () => (veil.isLocked = !prevState)
			});

			sfx.playStitch();
		}
	}

	toggleVisibility(index?: number) {
		const veil =
			index !== undefined
				? atelier.project.activeFrame.veils[index]
				: atelier.project.activeFrame.activeVeil;
		if (veil) {
			const prevState = veil.isVisible;
			veil.isVisible = !veil.isVisible;

			history.push({
				isStructural: true,
				label: 'Toggle Veil Visibility',
				undo: () => (veil.isVisible = prevState),
				redo: () => (veil.isVisible = !prevState)
			});

			sfx.playStitch();
		}
	}

	reorderVeil(fromIndex: number, toIndex: number) {
		const frame = atelier.project.activeFrame;
		if (fromIndex === toIndex) return;
		if (toIndex < 0 || toIndex >= frame.veils.length) return;

		const prevActiveIndex = frame.activeVeilIndex;

		const execute = (from: number, to: number) => {
			const [movedVeil] = frame.veils.splice(from, 1);
			frame.veils.splice(to, 0, movedVeil);

			// Update active index
			if (frame.activeVeilIndex === from) {
				frame.activeVeilIndex = to;
			} else if (from < frame.activeVeilIndex && to >= frame.activeVeilIndex) {
				frame.activeVeilIndex--;
			} else if (from > frame.activeVeilIndex && to <= frame.activeVeilIndex) {
				frame.activeVeilIndex++;
			}
		};

		execute(fromIndex, toIndex);
		const newActiveIndex = frame.activeVeilIndex;

		history.push({
			isStructural: true,
			label: 'Reorder Veil',
			undo: () => {
				const currentPos = frame.veils.findIndex(
					(v, i) => i === toIndex // This is simplified, real reorder undo is inverse
				);
				// To properly undo a move from A to B, we move from B back to A
				const [moved] = frame.veils.splice(toIndex, 1);
				frame.veils.splice(fromIndex, 0, moved);
				frame.activeVeilIndex = prevActiveIndex;
			},
			redo: () => {
				const [moved] = frame.veils.splice(fromIndex, 1);
				frame.veils.splice(toIndex, 0, moved);
				frame.activeVeilIndex = newActiveIndex;
			}
		});

		sfx.playMove();
	}

	reorderFrame(fromIndex: number, toIndex: number) {
		const project = atelier.project;
		if (fromIndex === toIndex) return;
		if (toIndex < 0 || toIndex >= project.frames.length) return;

		const prevActiveIndex = project.activeFrameIndex;

		const execute = (from: number, to: number) => {
			const [movedFrame] = project.frames.splice(from, 1);
			project.frames.splice(to, 0, movedFrame);

			if (project.activeFrameIndex === from) {
				project.activeFrameIndex = to;
			} else if (from < project.activeFrameIndex && to >= project.activeFrameIndex) {
				project.activeFrameIndex--;
			} else if (from > project.activeFrameIndex && to <= project.activeFrameIndex) {
				project.activeFrameIndex++;
			}
		};

		execute(fromIndex, toIndex);
		const newActiveIndex = project.activeFrameIndex;

		history.push({
			isStructural: true,
			label: 'Reorder Frame',
			undo: () => {
				const [moved] = project.frames.splice(toIndex, 1);
				project.frames.splice(fromIndex, 0, moved);
				project.activeFrameIndex = prevActiveIndex;
			},
			redo: () => {
				const [moved] = project.frames.splice(fromIndex, 1);
				project.frames.splice(toIndex, 0, moved);
				project.activeFrameIndex = newActiveIndex;
			}
		});

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
