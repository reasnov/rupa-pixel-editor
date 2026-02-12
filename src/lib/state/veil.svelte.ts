import { type ColorHex } from '../types/index.js';

/**
 * VeilState: Represents a single layer (Veil) of the digital fabric.
 * It holds the actual stitch data and visibility properties.
 */
export class VeilState {
	id = crypto.randomUUID();
	name = $state('New Veil');
	isVisible = $state(true);
	isLocked = $state(false);
	opacity = $state(1.0); // 0.0 to 1.0 (Density)

	// The actual pixel data for this layer
	stitches = $state<(ColorHex | null)[]>([]);

	constructor(name: string, width: number, height: number) {
		this.name = name;
		this.stitches = Array(width * height).fill(null);
	}

	clear() {
		this.stitches.fill(null);
	}

	// Helper to check if a stitch exists at an index
	hasStitch(index: number): boolean {
		return this.stitches[index] !== null;
	}
}
