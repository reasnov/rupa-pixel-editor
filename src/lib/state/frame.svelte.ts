import { VeilState } from './veil.svelte.js';

/**
 * FrameState: Represents a single canvas/composition (Frame) in the Folio.
 * It manages dimensions and a stack of Veils (Layers).
 */
export class FrameState {
	id = crypto.randomUUID();
	name = $state('Untitled Frame');
	width = $state(32);
	height = $state(32);

	// The stack of layers. Order: [Background, ..., Foreground]
	veils = $state<VeilState[]>([]);
	activeVeilIndex = $state(0);

	constructor(name: string, width = 32, height = 32) {
		this.name = name;
		this.width = width;
		this.height = height;
		// Always start with one base veil
		this.veils = [new VeilState('Base Veil', width, height)];
	}

	get activeVeil() {
		return this.veils[this.activeVeilIndex];
	}

	addVeil(name?: string) {
		const newName = name || `Veil ${this.veils.length + 1}`;
		const veil = new VeilState(newName, this.width, this.height);
		this.veils.push(veil);
		this.activeVeilIndex = this.veils.length - 1; // Auto-focus new layer
		return veil;
	}

	removeVeil(index: number) {
		if (this.veils.length <= 1) return; // Cannot delete the last veil
		this.veils.splice(index, 1);
		if (this.activeVeilIndex >= this.veils.length) {
			this.activeVeilIndex = this.veils.length - 1;
		}
	}

	// Composite projection for rendering (flattening layers)
	// This is computationally expensive, so use with care in tight loops.
	// Ideally, the renderer should iterate veils directly.
	get compositeStitches() {
		const result = new Array(this.width * this.height).fill(null);

		// Render from bottom to top
		for (const veil of this.veils) {
			if (!veil.isVisible) continue;

			for (let i = 0; i < result.length; i++) {
				const stitch = veil.stitches[i];
				if (stitch !== null) {
					result[i] = stitch; // Simple painter's algorithm (top covers bottom)
					// TODO: Implement alpha blending if we support semi-transparent dyes
				}
			}
		}
		return result;
	}
}
