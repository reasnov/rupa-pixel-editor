import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';
import { ColorEngine } from '../color.js';

/**
 * ColorService: Manages colors, palette manipulation,
 * and advanced color processing.
 */
export class ColorService {
	/**
	 * Select a color from the palette by index.
	 */
	select(index: number) {
		editor.paletteState.select(index);
		sfx.playScale(index);
	}

	/**
	 * Set the active color to a specific hex code.
	 */
	setColor(hex: string) {
		editor.paletteState.setColor(hex);
		sfx.playDraw();
	}

	/**
	 * Pick a color from the canvas at the current cursor position.
	 */
	pickFromCanvas() {
		const { x, y } = editor.cursor.pos;
		const color = editor.canvas.getColor(x, y);

		if (color !== null) {
			this.setColor(color);
			editor.studio.isPicking = true;
			setTimeout(() => {
				editor.studio.isPicking = false;
			}, 1500);
		}
	}

	/**
	 * Adjust the entire palette (Lighten/Darken).
	 */
	weatherPalette(amount: number) {
		editor.paletteState.swatches = editor.paletteState.swatches.map((color) =>
			ColorEngine.adjustBrightness(color, amount)
		);
		sfx.playDraw();
	}

	/**
	 * Mix the current active color with another color.
	 */
	mixActiveColor(otherHex: string, ratio = 0.5) {
		const newColor = ColorEngine.mix(editor.activeColor, otherHex, ratio);
		this.setColor(newColor);
	}

	/**
	 * Flood Fill: Automatically fills connected pixels of the same color.
	 */
	floodFill() {
		const { x, y } = editor.cursor.pos;
		const targetColor = editor.canvas.getColor(x, y);
		const replacementColor = editor.activeColor;

		// Don't fill if color is already the same
		if (targetColor === replacementColor) return;

		const width = editor.canvas.width;
		const height = editor.canvas.height;
		const queue: [number, number][] = [[x, y]];
		const visited = new Set<string>();
		const changes: { index: number; oldColor: string | null; newColor: string | null }[] = [];

		// Selection check
		const hasSelection = editor.selection.isActive;
		const selectionIndices = editor.selection.indices;

		while (queue.length > 0) {
			const [cx, cy] = queue.shift()!;
			const index = cy * width + cx;
			const key = `${cx},${cy}`;

			if (visited.has(key)) continue;
			visited.add(key);

			// Constraint: Must be target color AND (if selection exists, must be in selection)
			const isCorrectColor = editor.canvas.getColor(cx, cy) === targetColor;
			const isInsideSelection = !hasSelection || selectionIndices.includes(index);

			if (isCorrectColor && isInsideSelection) {
				changes.push({
					index,
					oldColor: targetColor,
					newColor: replacementColor
				});

				// Update state immediately for visual feedback
				editor.canvas.pixels[index] = replacementColor;

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
			sfx.playDraw();
		}
	}
}
