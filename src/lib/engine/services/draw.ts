import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';
import { PixelEngine } from '../pixel.js';
import { BrushLogic } from '../../logic/brush.js';
import { PixelLogic } from '../../logic/pixel.js';
import { keyboard } from '../keyboard.svelte.js';
import { ColorEngine } from '../color.js';

/**
 * DrawService: Manages the lifecycle of digital drawing and painting.
 */
export class DrawService {
	draw(tx?: number, ty?: number) {
		const x = tx !== undefined ? Math.floor(tx) : editor.cursor.pos.x;
		const y = ty !== undefined ? Math.floor(ty) : editor.cursor.pos.y;

		// 1. Expansion: Brush Kernel
		const kernel = BrushLogic.getKernel(editor.studio.brushSize, editor.studio.brushShape);
		const rawPoints = kernel.map((p) => ({ x: x + p.x, y: y + p.y }));

		// 2. Reflection: Symmetry
		if (editor.studio.symmetryMode !== 'OFF') {
			const symMode = editor.studio.symmetryMode;
			const { width, height } = editor.canvas;
			const mirrored: Array<{ x: number; y: number }> = [];

			rawPoints.forEach((p) => {
				const points = PixelLogic.getSymmetryPoints(p.x, p.y, width, height, symMode);
				mirrored.push(...points);
			});
			rawPoints.push(...mirrored);
		}

		// 3. Wrapping & Application
		const pointsToDraw = editor.studio.isTilingEnabled
			? rawPoints.map((p) => PixelLogic.wrap(p.x, p.y, editor.canvas.width, editor.canvas.height))
			: rawPoints.filter((p) => editor.canvas.isValidCoord(p.x, p.y));

		const activeColor = this.getEffectColor(x, y);
		const batch: Array<{ index: number; oldColor: string | null; newColor: string | null }> = [];
		const currentPixels = [...editor.canvas.pixels];

		pointsToDraw.forEach((p) => {
			const index = editor.canvas.getIndex(p.x, p.y);

			// Selection Masking
			if (editor.selection.isActive && !editor.selection.activeIndicesSet.has(index)) return;

			// Alpha Lock
			if (editor.studio.isAlphaLocked && !editor.project.activeFrame.activeLayer.hasPixel(index))
				return;

			// Color Lock
			if (editor.studio.isColorLocked && editor.studio.colorLockSource !== null) {
				if (currentPixels[index] !== editor.studio.colorLockSource) return;
			}

			const oldColor = currentPixels[index];
			if (oldColor !== activeColor) {
				batch.push({ index, oldColor, newColor: activeColor });
				currentPixels[index] = activeColor;
			}
		});

		if (batch.length > 0) {
			editor.canvas.pixels = currentPixels;
			history.push(batch);
			sfx.playDraw();
		}
	}

	erase(tx?: number, ty?: number) {
		const x = tx !== undefined ? Math.floor(tx) : editor.cursor.pos.x;
		const y = ty !== undefined ? Math.floor(ty) : editor.cursor.pos.y;

		// 1. Expansion: Brush Kernel
		const kernel = BrushLogic.getKernel(editor.studio.brushSize, editor.studio.brushShape);
		const rawPoints = kernel.map((p) => ({ x: x + p.x, y: y + p.y }));

		// 2. Reflection: Symmetry
		if (editor.studio.symmetryMode !== 'OFF') {
			const symMode = editor.studio.symmetryMode;
			const { width, height } = editor.canvas;
			const mirrored: Array<{ x: number; y: number }> = [];

			rawPoints.forEach((p) => {
				const points = PixelLogic.getSymmetryPoints(p.x, p.y, width, height, symMode);
				mirrored.push(...points);
			});
			rawPoints.push(...mirrored);
		}

		// 3. Wrapping & Application
		const pointsToDraw = editor.studio.isTilingEnabled
			? rawPoints.map((p) => PixelLogic.wrap(p.x, p.y, editor.canvas.width, editor.canvas.height))
			: rawPoints.filter((p) => editor.canvas.isValidCoord(p.x, p.y));

		const batch: Array<{ index: number; oldColor: string | null; newColor: string | null }> = [];
		const currentPixels = [...editor.canvas.pixels];

		pointsToDraw.forEach((p) => {
			const index = editor.canvas.getIndex(p.x, p.y);

			// Selection Masking
			if (editor.selection.isActive && !editor.selection.activeIndicesSet.has(index)) return;

			// Alpha Lock: Erase only if there is a pixel (implicit)
			if (editor.studio.isAlphaLocked && !editor.project.activeFrame.activeLayer.hasPixel(index))
				return;

			const oldColor = currentPixels[index];
			if (oldColor !== null) {
				batch.push({ index, oldColor, newColor: null });
				currentPixels[index] = null;
			}
		});

		if (batch.length > 0) {
			editor.canvas.pixels = currentPixels;
			history.push(batch);
			sfx.playErase();
		}
	}

	private getEffectColor(x: number, y: number): string | null {
		const baseColor = editor.paletteState.activeColor;
		const targetColor = editor.canvas.getColor(x, y);

		// Dither
		if (keyboard.isXDown) {
			return (x + y) % 2 === 0 ? baseColor : null;
		}

		// Shading: Only works if there's an existing color
		if (!targetColor) return baseColor;

		if (keyboard.isLDown) return ColorEngine.adjustBrightness(targetColor, 0.1);
		if (keyboard.isDDown) return ColorEngine.adjustBrightness(targetColor, -0.1);

		return baseColor;
	}

	// --- Sequential Stroke Management (The Render) ---

	beginStroke(x: number, y: number) {
		editor.canvas.clearBuffer();
		editor.canvas.addToBuffer(x, y);
	}

	continueStroke(x: number, y: number, lastX: number, lastY: number) {
		const points = PixelEngine.getLinePoints(lastX, lastY, x, y, 0);
		editor.canvas.addBatchToBuffer(points);
	}

	endStroke() {
		this.commitBuffer();
	}

	cancelStroke() {
		editor.canvas.clearBuffer();
		sfx.playErase();
	}

	/**
	 * Path Smoothing: Snaps current buffer to perfect geometric forms.
	 */
	snapCurrentStroke() {
		const rawPoints = editor.canvas.strokePoints;
		if (rawPoints.length < 5) return;

		const stab = editor.studio.stabilization;
		const smoothed = PixelEngine.smoothPath(rawPoints, stab / 10);
		const arcData = PixelEngine.fitArc(smoothed, stab);

		editor.canvas.clearBuffer();
		let finalPixels: Array<{ x: number; y: number }> = [];
		let visualPoints: Array<{ x: number; y: number }> = [];

		if (arcData && arcData.isFull) {
			visualPoints = arcData.points;
			finalPixels = PixelEngine.getCirclePoints(arcData.cx, arcData.cy, arcData.r);
		} else {
			const simplified = PixelEngine.simplifyPath(smoothed, (stab / 100) * 2.0);

			if (simplified.length === 2) {
				let p1 = { ...simplified[0] };
				let p2 = { ...simplified[simplified.length - 1] };

				const dx = Math.abs(p2.x - p1.x);
				const dy = Math.abs(p2.y - p1.y);
				const snapThreshold = 3.0;

				if (dx < snapThreshold) {
					p2.x = p1.x;
				} else if (dy < snapThreshold) {
					p2.y = p1.y;
				} else if (Math.abs(dx - dy) < snapThreshold) {
					const size = Math.max(dx, dy);
					p2.x = p1.x + size * Math.sign(p2.x - p1.x);
					p2.y = p1.y + size * Math.sign(p2.y - p1.y);
				}

				visualPoints = [p1, p2];
				finalPixels = PixelEngine.getLinePoints(p1.x, p1.y, p2.x, p2.y, 0);
			} else if (arcData) {
				visualPoints = arcData.points;
				for (let i = 0; i < visualPoints.length - 1; i++) {
					finalPixels.push(
						...PixelEngine.getLinePoints(
							visualPoints[i].x,
							visualPoints[i].y,
							visualPoints[i + 1].x,
							visualPoints[i + 1].y,
							stab / 100
						)
					);
				}
			} else {
				visualPoints = simplified;
				for (let i = 0; i < visualPoints.length - 1; i++) {
					finalPixels.push(
						...PixelEngine.getLinePoints(
							visualPoints[i].x,
							visualPoints[i].y,
							visualPoints[i + 1].x,
							visualPoints[i + 1].y,
							stab / 100
						)
					);
				}
			}
		}

		editor.canvas.addBatchToBuffer(finalPixels);
		editor.canvas.strokePoints = visualPoints;
		sfx.playDraw();
	}

	private commitBuffer() {
		const buffer = editor.canvas.pixelBuffer;
		if (buffer.length === 0) {
			editor.canvas.clearBuffer();
			return;
		}

		const batch: Array<{ index: number; oldColor: string | null; newColor: string | null }> = [];
		const currentPixels = [...editor.canvas.pixels];

		const kernel = BrushLogic.getKernel(editor.studio.brushSize, editor.studio.brushShape);

		buffer.forEach((idx) => {
			const x = idx % editor.canvas.width;
			const y = Math.floor(idx / editor.canvas.width);

			// 1. Expansion: Brush Kernel
			const rawPoints = kernel.map((p) => ({ x: x + p.x, y: y + p.y }));

			// 2. Reflection: Symmetry
			if (editor.studio.symmetryMode !== 'OFF') {
				const symMode = editor.studio.symmetryMode;
				const { width, height } = editor.canvas;
				const mirrored: Array<{ x: number; y: number }> = [];

				rawPoints.forEach((p) => {
					const points = PixelLogic.getSymmetryPoints(p.x, p.y, width, height, symMode);
					mirrored.push(...points);
				});
				rawPoints.push(...mirrored);
			}

			// 3. Wrapping & Application
			const pointsToDraw = editor.studio.isTilingEnabled
				? rawPoints.map((p) => PixelLogic.wrap(p.x, p.y, editor.canvas.width, editor.canvas.height))
				: rawPoints.filter((p) => editor.canvas.isValidCoord(p.x, p.y));

			const activeColor = this.getEffectColor(x, y);

			pointsToDraw.forEach((p) => {
				const index = editor.canvas.getIndex(p.x, p.y);

				// Selection Masking
				if (editor.selection.isActive && !editor.selection.activeIndicesSet.has(index)) return;

				// Alpha Lock
				if (editor.studio.isAlphaLocked && !editor.project.activeFrame.activeLayer.hasPixel(index))
					return;

				const oldColor = currentPixels[index];
				if (oldColor !== activeColor) {
					batch.push({ index, oldColor, newColor: activeColor });
					currentPixels[index] = activeColor;
				}
			});
		});

		if (batch.length > 0) {
			editor.canvas.pixels = currentPixels;
			history.push(batch);
			sfx.playDraw();
		}
		editor.canvas.clearBuffer();
	}
}
