import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';
import { PixelLogic } from '../../logic/pixel.js';

/**
 * ProjectService: Manages Frames and Layers.
 * Handles addition, removal, and navigation within the Project hierarchy.
 */
export class ProjectService {
	// --- Frame Management ---

	addFrame(name?: string) {
		const project = editor.project;
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

		sfx.playDraw();
		return frame;
	}

	removeFrame(index: number) {
		const project = editor.project;
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

		sfx.playErase();
	}

	duplicateFrame(index: number) {
		const project = editor.project;
		const source = project.frames[index];
		const prevIndex = project.activeFrameIndex;

		const newFrame = project.addFrame(`${source.name} (Copy)`);
		const newIndex = project.activeFrameIndex;

		newFrame.width = source.width;
		newFrame.height = source.height;

		newFrame.layers = source.layers.map((v) => {
			return v.clone(source.width, source.height);
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

		sfx.playDraw();
	}

	nextFrame() {
		const project = editor.project;
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
		const project = editor.project;
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

	// --- Layer Management ---

	addLayer(name?: string) {
		const frame = editor.project.activeFrame;
		const prevIndex = frame.activeLayerIndex;
		const layer = frame.addLayer(name);
		const newIndex = frame.activeLayerIndex;

		history.push({
			isStructural: true,
			label: 'Add Layer',
			undo: () => {
				frame.layers.splice(newIndex, 1);
				frame.activeLayerIndex = prevIndex;
			},
			redo: () => {
				frame.layers.splice(newIndex, 0, layer);
				frame.activeLayerIndex = newIndex;
			}
		});

		sfx.playDraw();
		return layer;
	}

	addGroup(name?: string) {
		const frame = editor.project.activeFrame;
		const prevIndex = frame.activeLayerIndex;
		const group = frame.addGroup(name);
		const newIndex = frame.activeLayerIndex;

		history.push({
			isStructural: true,
			label: 'Add Group',
			undo: () => {
				frame.layers.splice(newIndex, 1);
				frame.activeLayerIndex = prevIndex;
			},
			redo: () => {
				frame.layers.splice(newIndex, 0, group);
				frame.activeLayerIndex = newIndex;
			}
		});

		sfx.playDraw();
		return group;
	}

	removeLayer(index: number) {
		const frame = editor.project.activeFrame;
		if (frame.layers.length <= 1) return;

		const removedLayer = frame.layers[index];
		const prevIndex = frame.activeLayerIndex;

		frame.removeLayer(index);
		const newIndex = frame.activeLayerIndex;

		history.push({
			isStructural: true,
			label: 'Remove Layer',
			undo: () => {
				frame.layers.splice(index, 0, removedLayer);
				frame.activeLayerIndex = prevIndex;
			},
			redo: () => {
				frame.removeLayer(index);
				frame.activeLayerIndex = newIndex;
			}
		});

		sfx.playErase();
	}

	duplicateLayer(index: number) {
		const frame = editor.project.activeFrame;
		const source = frame.layers[index];
		const prevIndex = frame.activeLayerIndex;

		const newLayer = source.clone(frame.width, frame.height);
		newLayer.name = `${source.name} (Copy)`;

		const newIndex = index + 1;
		frame.layers.splice(newIndex, 0, newLayer);
		frame.activeLayerIndex = newIndex;

		history.push({
			isStructural: true,
			label: 'Duplicate Layer',
			undo: () => {
				frame.layers.splice(newIndex, 1);
				frame.activeLayerIndex = prevIndex;
			},
			redo: () => {
				frame.layers.splice(newIndex, 0, newLayer);
				frame.activeLayerIndex = newIndex;
			}
		});

		sfx.playDraw();
	}

	nextLayer() {
		const frame = editor.project.activeFrame;
		const prevIndex = frame.activeLayerIndex;
		frame.activeLayerIndex = (frame.activeLayerIndex + 1) % frame.layers.length;

		history.push({
			isStructural: true,
			label: 'Next Layer',
			undo: () => (frame.activeLayerIndex = prevIndex),
			redo: () => (frame.activeLayerIndex = (prevIndex + 1) % frame.layers.length)
		});

		sfx.playMove();
	}

	prevLayer() {
		const frame = editor.project.activeFrame;
		const prevIndex = frame.activeLayerIndex;
		frame.activeLayerIndex =
			(frame.activeLayerIndex - 1 + frame.layers.length) % frame.layers.length;

		history.push({
			isStructural: true,
			label: 'Prev Layer',
			undo: () => (frame.activeLayerIndex = prevIndex),
			redo: () =>
				(frame.activeLayerIndex = (prevIndex - 1 + frame.layers.length) % frame.layers.length)
		});

		sfx.playMove();
	}

	toggleLock(index?: number) {
		const layer =
			index !== undefined
				? editor.project.activeFrame.layers[index]
				: editor.project.activeFrame.activeLayer;
		if (layer) {
			layer.isLocked = !layer.isLocked;
			sfx.playDraw();
		}
	}

	toggleVisibility(index?: number) {
		const layer =
			index !== undefined
				? editor.project.activeFrame.layers[index]
				: editor.project.activeFrame.activeLayer;
		if (layer) {
			layer.isVisible = !layer.isVisible;
			sfx.playDraw();
		}
	}

	toggleFrameVisibility(index?: number) {
		const project = editor.project;
		const targetIndex = index !== undefined ? index : project.activeFrameIndex;
		const frame = project.frames[targetIndex];

		if (frame) {
			frame.isVisible = !frame.isVisible;
			sfx.playDraw();

			history.push({
				isStructural: true,
				label: 'Toggle Frame Visibility',
				undo: () => (frame.isVisible = !frame.isVisible),
				redo: () => (frame.isVisible = !frame.isVisible)
			});
		}
	}

	reorderLayer(fromIndex: number, toIndex: number) {
		const frame = editor.project.activeFrame;
		if (fromIndex === toIndex) return;
		if (toIndex < 0 || toIndex >= frame.layers.length) return;

		const prevActiveIndex = frame.activeLayerIndex;

		const execute = (from: number, to: number) => {
			const [movedLayer] = frame.layers.splice(from, 1);
			frame.layers.splice(to, 0, movedLayer);

			if (frame.activeLayerIndex === from) {
				frame.activeLayerIndex = to;
			} else if (from < frame.activeLayerIndex && to >= frame.activeLayerIndex) {
				frame.activeLayerIndex--;
			} else if (from > frame.activeLayerIndex && to <= frame.activeLayerIndex) {
				frame.activeLayerIndex++;
			}
		};

		execute(fromIndex, toIndex);
		const newActiveIndex = frame.activeLayerIndex;

		history.push({
			isStructural: true,
			label: 'Reorder Layer',
			undo: () => {
				const [moved] = frame.layers.splice(toIndex, 1);
				frame.layers.splice(fromIndex, 0, moved);
				frame.activeLayerIndex = prevActiveIndex;
			},
			redo: () => {
				const [moved] = frame.layers.splice(fromIndex, 1);
				frame.layers.splice(toIndex, 0, moved);
				frame.activeLayerIndex = newActiveIndex;
			}
		});

		sfx.playMove();
	}

	reorderFrame(fromIndex: number, toIndex: number) {
		const project = editor.project;
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

	moveLayerUp() {
		const frame = editor.project.activeFrame;
		const current = frame.activeLayerIndex;
		if (current < frame.layers.length - 1) {
			this.reorderLayer(current, current + 1);
		}
	}

	moveLayerDown() {
		const frame = editor.project.activeFrame;
		const current = frame.activeLayerIndex;
		if (current > 0) {
			this.reorderLayer(current, current - 1);
		}
	}

	moveLayerToTop() {
		const frame = editor.project.activeFrame;
		const current = frame.activeLayerIndex;
		if (current < frame.layers.length - 1) {
			this.reorderLayer(current, frame.layers.length - 1);
		}
	}

	moveLayerToBottom() {
		const frame = editor.project.activeFrame;
		const current = frame.activeLayerIndex;
		if (current > 0) {
			this.reorderLayer(current, 0);
		}
	}

	/**
	 * Merge Layer Down: Combines the active layer with the one directly below it.
	 */
	mergeLayerDown() {
		const frame = editor.project.activeFrame;
		const topIdx = frame.activeLayerIndex;
		if (topIdx <= 0) return;

		const bottomIdx = topIdx - 1;
		const topLayer = frame.layers[topIdx];
		const bottomLayer = frame.layers[bottomIdx];

		const oldBottomPixels = new Uint32Array(bottomLayer.pixels);
		const mergedPixels = PixelLogic.mergeLayers(
			[bottomLayer.pixels, topLayer.pixels],
			frame.width,
			frame.height
		);

		// Apply merge
		bottomLayer.pixels = mergedPixels;
		frame.layers.splice(topIdx, 1);
		frame.activeLayerIndex = bottomIdx;
		editor.canvas.incrementVersion();

		history.push({
			isStructural: true,
			label: 'Merge Layer',
			undo: () => {
				bottomLayer.pixels = oldBottomPixels;
				frame.layers.splice(topIdx, 0, topLayer);
				frame.activeLayerIndex = topIdx;
				editor.canvas.incrementVersion();
			},
			redo: () => {
				bottomLayer.pixels = mergedPixels;
				frame.layers.splice(topIdx, 1);
				frame.activeLayerIndex = bottomIdx;
				editor.canvas.incrementVersion();
			}
		});

		sfx.playDraw();
	}

	/**
	 * Merges all currently selected layers into a single layer.
	 */
	mergeSelectedLayers() {
		const frame = editor.project.activeFrame;
		const selectedIndices = Array.from(frame.selectedLayerIndices).sort((a, b) => a - b);
		if (selectedIndices.length <= 1) return;

		const targetIdx = selectedIndices[0];
		const targetLayer = frame.layers[targetIdx];
		const oldTargetPixels = new Uint32Array(targetLayer.pixels);

		const layersToMerge = selectedIndices.map((idx) => frame.layers[idx]);
		const pixelsToMerge = layersToMerge.map((l) => l.pixels);

		const mergedPixels = PixelLogic.mergeLayers(pixelsToMerge, frame.width, frame.height);

		// Capture state for undo
		const oldLayers = [...frame.layers];
		const oldActiveIndex = frame.activeLayerIndex;
		const oldSelection = new Set(frame.selectedLayerIndices);

		// Perform merge
		const newLayers = frame.layers.filter(
			(_, idx) => !frame.selectedLayerIndices.has(idx) || idx === targetIdx
		);
		const newTargetIdx = newLayers.indexOf(targetLayer);

		frame.layers = newLayers;
		targetLayer.pixels = mergedPixels;
		frame.activeLayerIndex = newTargetIdx;
		frame.selectedLayerIndices = new Set([newTargetIdx]);
		editor.canvas.incrementVersion();

		history.push({
			isStructural: true,
			label: 'Merge Selected Layers',
			undo: () => {
				frame.layers = oldLayers;
				targetLayer.pixels = oldTargetPixels;
				frame.activeLayerIndex = oldActiveIndex;
				frame.selectedLayerIndices = oldSelection;
				editor.canvas.incrementVersion();
			},
			redo: () => {
				frame.layers = newLayers;
				targetLayer.pixels = mergedPixels;
				frame.activeLayerIndex = newTargetIdx;
				frame.selectedLayerIndices = new Set([newTargetIdx]);
				editor.canvas.incrementVersion();
			}
		});

		sfx.playDraw();
	}

	/**
	 * Merges selected frames into one.
	 * Each frame's composite image becomes a layer in the new frame.
	 */
	mergeFrames() {
		const project = editor.project;
		const selectedIndices = Array.from(project.selectedFrameIndices).sort((a, b) => a - b);
		if (selectedIndices.length <= 1) return;

		const firstIdx = selectedIndices[0];
		const baseFrame = project.frames[firstIdx];

		// Create a new frame to hold the merged results
		const mergedFrame = project.addFrame(`${baseFrame.name} (Merged)`);
		mergedFrame.layers = []; // Clear default layer

		selectedIndices.forEach((idx, i) => {
			const sourceFrame = project.frames[idx];
			const newLayer = mergedFrame.addLayer(`Frame ${idx + 1}`);
			newLayer.pixels = new Uint32Array(sourceFrame.compositePixels);
		});

		const newIdx = project.frames.indexOf(mergedFrame);
		project.activeFrameIndex = newIdx;

		history.push({
			isStructural: true,
			label: 'Merge Frames',
			undo: () => {
				project.frames.splice(newIdx, 1);
				project.activeFrameIndex = firstIdx;
			},
			redo: () => {
				project.frames.splice(newIdx, 0, mergedFrame);
				project.activeFrameIndex = newIdx;
			}
		});

		sfx.playDraw();
	}

	// --- Tag Management ---

	addTag(name: string, from: number, to: number, color = '#d33682') {
		const tag = {
			id: crypto.randomUUID(),
			name,
			color,
			from,
			to
		};
		editor.project.tags.push(tag);
		sfx.playDraw();
		return tag;
	}

	removeTag(id: string) {
		editor.project.tags = editor.project.tags.filter((t) => t.id !== id);
		sfx.playErase();
	}
}
