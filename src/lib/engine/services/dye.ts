import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';
import { SpinnerEngine } from '../spinner.js';

/**
 * DyeService: Manages the artisan's dyes, palette manipulation,
 * and advanced color processing.
 */
export class DyeService {
	/**
	 * Select a dye from the palette by index.
	 */
	select(index: number) {
		atelier.paletteState.select(index);
		sfx.playScale(index);
	}

	/**
	 * Set the active dye to a specific hex code.
	 */
	setDye(hex: string) {
		atelier.paletteState.setDye(hex);
		sfx.playStitch();
	}

	/**
	 * Pick a dye from the linen at the current needle position.
	 */
	pickFromLinen() {
		const { x, y } = atelier.needle.pos;
		const color = atelier.linen.getColor(x, y);

		if (color !== null) {
			this.setDye(color);
			atelier.studio.isPicking = true;
			setTimeout(() => {
				atelier.studio.isPicking = false;
			}, 1500);
		}
	}

	/**
	 * Weather the entire palette (Lighten/Darken).
	 */
	weatherPalette(amount: number) {
		atelier.paletteState.swatches = atelier.paletteState.swatches.map((dye) =>
			SpinnerEngine.weather(dye, amount)
		);
		sfx.playStitch();
	}

	/**
	 * Mix the current active dye with another color.
	 */
	mixActiveDye(otherHex: string, ratio = 0.5) {
		const newDye = SpinnerEngine.entwine(atelier.activeDye, otherHex, ratio);
		this.setDye(newDye);
	}

	/**
	 * Dye Soak (Flood Fill): Automatically fills connected stitches of the same color.
	 */
	soak() {
		const { x, y } = atelier.needle.pos;
		const targetColor = atelier.linen.getColor(x, y);
		const replacementColor = atelier.activeDye;

		// Don't fill if color is already the same
		if (targetColor === replacementColor) return;

		const width = atelier.linen.width;
		const height = atelier.linen.height;
		const queue: [number, number][] = [[x, y]];
		const visited = new Set<string>();
		const changes: { index: number; oldColor: string | null; newColor: string | null }[] = [];

		// Selection check
		const hasSelection = atelier.selection.isActive;
		const selectionIndices = atelier.selection.indices;

		while (queue.length > 0) {
			const [cx, cy] = queue.shift()!;
			const index = cy * width + cx;
			const key = `${cx},${cy}`;

			if (visited.has(key)) continue;
			visited.add(key);

			// Constraint: Must be target color AND (if selection exists, must be in selection)
			const isCorrectColor = atelier.linen.getColor(cx, cy) === targetColor;
			const isInsideSelection = !hasSelection || selectionIndices.has(index);

			if (isCorrectColor && isInsideSelection) {
				changes.push({
					index,
					oldColor: targetColor,
					newColor: replacementColor
				});

				// Update state immediately for visual feedback
				atelier.linen.stitches[index] = replacementColor;

				// Neighbors
				const neighbors: [number, number][] = [
					[cx + 1, cy],
					[cx - 1, cy],
					[cx, cy + 1],
					[cx, cy - 1]
				];

				for (const [nx, ny] of neighbors) {
					if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
						queue.push([nx, ny]);
					}
				}
			}
		}

		if (changes.length > 0) {
			history.beginBatch();
			changes.forEach((c) => history.push(c));
			history.endBatch();
			sfx.playStitch();
		}
	}
}
