import { type ColorHex } from '../types/index.js';

/**
 * LayerState: Represents a single layer of the digital frame.
 * It holds the actual pixel data and visibility properties.
 */
export class LayerState {
	id = crypto.randomUUID();
	name = $state('New Layer');
	isVisible = $state(true);
	isLocked = $state(false);
	opacity = $state(1.0); // 0.0 to 1.0 (Density)

	// The actual pixel data for this layer
	pixels = $state<(ColorHex | null)[]>([]);

	constructor(name: string, width: number, height: number) {
		this.name = name;
		this.pixels = Array(width * height).fill(null);
	}

	clone(width: number, height: number) {
		const newLayer = new LayerState(this.name, width, height);
		newLayer.pixels = [...this.pixels];
		newLayer.isVisible = this.isVisible;
		newLayer.isLocked = this.isLocked;
		newLayer.opacity = this.opacity;
		return newLayer;
	}

	clear() {
		this.pixels.fill(null);
	}

	// Helper to check if a pixel exists at an index
	hasPixel(index: number): boolean {
		return this.pixels[index] !== null;
	}
}
