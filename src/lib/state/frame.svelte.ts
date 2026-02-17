import { LayerState } from './layer.svelte.js';

/**
 * FrameState: Represents a single cup/composition (Frame) in the Recipe Book.
 * It manages dimensions and a stack of Layers (Infusions).
 */
export class FrameState {
	id = crypto.randomUUID();
	name = $state('Untitled Cup');
	width = $state(32);
	height = $state(32);
	duration = $state(100); // Duration in ms (Default 100ms = 10 FPS)

	// The stack of layers. Order: [Background, ..., Foreground]
	layers = $state<LayerState[]>([]);
	activeLayerIndex = $state(0);

	constructor(name: string, width = 32, height = 32) {
		this.name = name;
		this.width = width;
		this.height = height;
		// Always start with one base layer
		this.layers = [new LayerState('Base Layer', width, height)];
	}

	get activeLayer() {
		return this.layers[this.activeLayerIndex];
	}

	addLayer(name?: string) {
		const newName = name || `Layer ${this.layers.length + 1}`;
		const layer = new LayerState(newName, this.width, this.height);
		this.layers.push(layer);
		this.activeLayerIndex = this.layers.length - 1; // Auto-focus new layer
		return layer;
	}

	removeLayer(index: number) {
		if (this.layers.length <= 1) return; // Cannot delete the last layer
		this.layers.splice(index, 1);
		if (this.activeLayerIndex >= this.layers.length) {
			this.activeLayerIndex = this.layers.length - 1;
		}
	}

	// Composite projection for rendering (flattening layers)
	get compositePixels() {
		const result = new Array(this.width * this.height).fill(null);

		// Render from bottom to top
		for (const layer of this.layers) {
			if (!layer.isVisible) continue;

			for (let i = 0; i < result.length; i++) {
				const pixel = layer.pixels[i];
				if (pixel !== null) {
					result[i] = pixel; // Simple painter's algorithm (top covers bottom)
				}
			}
		}
		return result;
	}
}
