import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';
import { ColorLogic } from '../../logic/color.js';
import { PixelLogic } from '../../logic/pixel.js';

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
		const val = editor.canvas.getColor(x, y);
		const hex = ColorLogic.uint32ToHex(val);

		if (hex !== null) {
			this.setColor(hex);
			editor.studio.isPicking = true;
			setTimeout(() => {
				editor.studio.isPicking = false;
			}, 1500);
		}
	}

	/**
	 * Adjust the entire palette brightness.
	 */
	adjustPaletteBrightness(amount: number) {
		editor.paletteState.swatches = editor.paletteState.swatches.map((color) =>
			ColorLogic.adjustBrightness(color, amount)
		);
		sfx.playDraw();
	}

	/**
	 * Mix the current active color with another color.
	 */
	mixActiveColor(otherHex: string, ratio = 0.5) {
		const newColor = ColorLogic.mix(editor.activeColor, otherHex, ratio);
		this.setColor(newColor);
	}

	/**
	 * Flood Fill: Automatically fills connected pixels of the same color.
	 */
	floodFill() {
		const { x, y } = editor.cursor.pos;
		const targetVal = editor.canvas.getColor(x, y);
		const replacementColor = editor.activeColor;
		const replacementVal = ColorLogic.hexToUint32(replacementColor);

		// Don't fill if color is already the same
		if (targetVal === replacementVal) return;

		const { width, height, pixels } = editor.canvas;

		// Perform scanline flood fill via Logic Layer
		const filledPixels = PixelLogic.floodFill<number>(
			Array.from(pixels),
			width,
			height,
			x,
			y,
			replacementVal
		);

		const resultPixels = new Uint32Array(filledPixels as any);
		let hasChanges = false;
		history.beginBatch();

		// Selection check
		const hasSelection = editor.selection.isActive;
		const selectionSet = editor.selection.activeIndicesSet;

		for (let i = 0; i < resultPixels.length; i++) {
			if (resultPixels[i] !== pixels[i]) {
				// If selection active, only allow changes inside selection
				if (hasSelection && !selectionSet.has(i)) {
					resultPixels[i] = pixels[i]; // Revert
					continue;
				}

				history.pushPixel(i, pixels[i], replacementVal);
				hasChanges = true;
			}
		}

		history.endBatch();

		if (hasChanges) {
			editor.canvas.pixels = resultPixels;
			editor.canvas.incrementVersion();
			sfx.playDraw();
		}
	}
}
