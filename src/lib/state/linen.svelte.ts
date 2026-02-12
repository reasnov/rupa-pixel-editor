import { type ColorHex } from '../types/index.js';

/**
 * LinenState: Manages the digital fabric (grid).
 * Stitches are stored as ColorHex strings or null if the cell is empty.
 */
export class LinenState {
	width = $state(32);
	height = $state(32);
	// Use null to represent an empty cell (no stitch)
	stitches = $state<(ColorHex | null)[]>([]);

	constructor(width = 32, height = 32) {
		this.width = width;
		this.height = height;
		this.stitches = Array(width * height).fill(null);
	}

	reset(width: number, height: number, stitches: (ColorHex | null)[]) {
		this.width = width;
		this.height = height;
		this.stitches = stitches;
	}

	clear() {
		this.stitches = this.stitches.map(() => null);
	}

	getIndex(x: number, y: number): number {
		return y * this.width + x;
	}

	getColor(x: number, y: number): ColorHex | null {
		return this.stitches[this.getIndex(x, y)];
	}

	setColor(x: number, y: number, color: ColorHex | null) {
		this.stitches[this.getIndex(x, y)] = color;
	}

	isValidCoord(x: number, y: number): boolean {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}
}
