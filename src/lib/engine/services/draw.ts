import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';
import { BrushLogic } from '../../logic/brush.js';
import { PixelLogic } from '../../logic/pixel.js';
import { Geometry } from '../../logic/geometry.js';
import { Path } from '../../logic/path.js';
import { keyboard } from '../keyboard.svelte.js';
import { ColorLogic } from '../../logic/color.js';
import { mode } from '../mode.svelte.js';

/**
 * DrawService: Manages the lifecycle of digital drawing and painting.
 */
export class DrawService {
	draw(tx?: number, ty?: number) {
		const x = tx !== undefined ? Math.floor(tx) : editor.cursor.pos.x;
		const y = ty !== undefined ? Math.floor(ty) : editor.cursor.pos.y;

		const batch: Array<{ index: number; oldColor: string | null; newColor: string | null }> = [];
		const currentPixels = new Uint32Array(editor.canvas.pixels);

		// --- Pattern Brush Logic ---
		if (editor.studio.isPatternBrushActive && editor.studio.patternBrushData) {
			const pb = editor.studio.patternBrushData;
			const offX = Math.floor(pb.width / 2);
			const offY = Math.floor(pb.height / 2);

			for (let py = 0; py < pb.height; py++) {
				for (let px = 0; px < pb.width; px++) {
					const targetX = x + px - offX;
					const targetY = y + py - offY;

					if (editor.canvas.isValidCoord(targetX, targetY)) {
						const pbIdx = py * pb.width + px;
						const colorVal = pb.data[pbIdx];
						// 0 is transparent in our system
						if (colorVal === 0) continue;

						const index = editor.canvas.getIndex(targetX, targetY);

						// Filters
						if (editor.selection.isActive && !editor.selection.activeIndicesSet.has(index))
							continue;
						if (
							editor.studio.isAlphaLocked &&
							!editor.project.activeFrame.activeLayer.hasPixel(index)
						)
							continue;

						const isEraser = mode.current.type === 'ERASE';
						const finalColorVal = isEraser ? 0 : colorVal;

						const oldVal = currentPixels[index];
						if (oldVal !== finalColorVal) {
							batch.push({
								index,
								oldColor: ColorLogic.uint32ToHex(oldVal),
								newColor: ColorLogic.uint32ToHex(finalColorVal)
							});
							currentPixels[index] = finalColorVal;
						}
					}
				}
			}
		} else {
			// --- Standard Brush Logic ---
			const kernel = BrushLogic.getKernel(editor.studio.brushSize, editor.studio.brushShape);
			const rawPoints = kernel.map((p) => ({ x: x + p.x, y: y + p.y }));

			// Reflection: Symmetry
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

			// Wrapping & Application
			let pointsToDraw = editor.studio.isTilingEnabled
				? rawPoints.map((p) => PixelLogic.wrap(p.x, p.y, editor.canvas.width, editor.canvas.height))
				: rawPoints.filter((p) => editor.canvas.isValidCoord(p.x, p.y));

			// --- The Mist (Airbrush) ---
			if (editor.studio.isAirbrushActive) {
				const density = editor.studio.airbrushDensity;
				pointsToDraw = pointsToDraw.filter(() => Math.random() < density);
			}

			pointsToDraw.forEach((p) => {
				const index = editor.canvas.getIndex(p.x, p.y);

				// Selection Masking
				if (editor.selection.isActive && !editor.selection.activeIndicesSet.has(index)) return;

				// Alpha Lock
				if (editor.studio.isAlphaLocked && !editor.project.activeFrame.activeLayer.hasPixel(index))
					return;

				// Color Lock
				if (editor.studio.isColorLocked && editor.studio.colorLockSource !== null) {
					if (currentPixels[index] !== ColorLogic.hexToUint32(editor.studio.colorLockSource))
						return;
				}

				const activeColorVal = this.getEffectColorForPoint(p.x, p.y, currentPixels[index]);
				const oldVal = currentPixels[index];

				if (oldVal !== activeColorVal) {
					batch.push({
						index,
						oldColor: ColorLogic.uint32ToHex(oldVal),
						newColor: ColorLogic.uint32ToHex(activeColorVal)
					});
					currentPixels[index] = activeColorVal;
				}
			});
		}

		if (batch.length > 0) {
			editor.canvas.pixels = currentPixels;
			editor.canvas.triggerPulse();
			history.push(batch);
			if (mode.current.type === 'ERASE') sfx.playErase();
			else sfx.playDraw();
		}
	}

	erase(tx?: number, ty?: number) {
		const x = tx !== undefined ? Math.floor(tx) : editor.cursor.pos.x;
		const y = ty !== undefined ? Math.floor(ty) : editor.cursor.pos.y;

		const kernel = BrushLogic.getKernel(editor.studio.brushSize, editor.studio.brushShape);
		const rawPoints = kernel.map((p) => ({ x: x + p.x, y: y + p.y }));

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

		const pointsToDraw = editor.studio.isTilingEnabled
			? rawPoints.map((p) => PixelLogic.wrap(p.x, p.y, editor.canvas.width, editor.canvas.height))
			: rawPoints.filter((p) => editor.canvas.isValidCoord(p.x, p.y));

		const batch: Array<{ index: number; oldColor: string | null; newColor: string | null }> = [];
		const currentPixels = new Uint32Array(editor.canvas.pixels);

		pointsToDraw.forEach((p) => {
			const index = editor.canvas.getIndex(p.x, p.y);

			if (editor.selection.isActive && !editor.selection.activeIndicesSet.has(index)) return;

			if (editor.studio.isAlphaLocked && !editor.project.activeFrame.activeLayer.hasPixel(index))
				return;

			const oldVal = currentPixels[index];
			if (oldVal !== 0) {
				batch.push({ index, oldColor: ColorLogic.uint32ToHex(oldVal), newColor: null });
				currentPixels[index] = 0;
			}
		});

		if (batch.length > 0) {
			editor.canvas.pixels = currentPixels;
			editor.canvas.triggerPulse();
			history.push(batch);
			sfx.playErase();
		}
	}

	private getEffectColorForPoint(x: number, y: number, targetVal: number): number {
		if (mode.current.type === 'ERASE') return 0;

		const baseColor = editor.paletteState.activeColor;
		const baseVal = ColorLogic.hexToUint32(baseColor);

		if (editor.studio.isShadingDither) {
			return (x + y) % 2 === 0 ? baseVal : 0;
		}

		if (targetVal === 0) return baseVal;

		if (editor.studio.isShadingLighten) {
			const hex = ColorLogic.uint32ToHex(targetVal);
			return ColorLogic.hexToUint32(ColorLogic.adjustBrightness(hex!, 0.1));
		}
		if (editor.studio.isShadingDarken) {
			const hex = ColorLogic.uint32ToHex(targetVal);
			return ColorLogic.hexToUint32(ColorLogic.adjustBrightness(hex!, -0.1));
		}

		return baseVal;
	}

	beginStroke(x: number, y: number) {
		editor.canvas.clearBuffer();
		editor.canvas.addToBuffer(x, y);
	}

	continueStroke(x: number, y: number, lastX: number, lastY: number) {
		const points = Geometry.getLinePoints(lastX, lastY, x, y, 0);

		if (editor.studio.isPixelPerfect) {
			const currentPath = [...editor.canvas.strokePoints, ...points];
			const filtered = PixelLogic.pixelPerfectFilter(currentPath);
			editor.canvas.clearBuffer();
			editor.canvas.addBatchToBuffer(filtered);
		} else {
			editor.canvas.addBatchToBuffer(points);
		}
	}

	endStroke() {
		this.commitBuffer();
	}

	cancelStroke() {
		editor.canvas.clearBuffer();
		sfx.playErase();
	}

	snapCurrentStroke() {
		const rawPoints = editor.canvas.strokePoints;
		if (rawPoints.length < 5) return;

		const stab = editor.studio.stabilization;
		const smoothed = Path.smooth(rawPoints, stab / 10);
		const circularityLimit = 0.05 + (stab / 100) * 0.35;
		const arcData = Geometry.fitArc(smoothed, circularityLimit);

		editor.canvas.clearBuffer();
		let finalPixels: Array<{ x: number; y: number }> = [];
		let visualPoints: Array<{ x: number; y: number }> = [];

		if (arcData && arcData.isFull) {
			visualPoints = arcData.points;
			finalPixels = Geometry.getCirclePoints(arcData.cx, arcData.cy, arcData.r);
		} else {
			const simplified = Path.simplify(smoothed, (stab / 100) * 2.0);

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
				finalPixels = Geometry.getLinePoints(p1.x, p1.y, p2.x, p2.y, 0);
			} else if (arcData) {
				visualPoints = arcData.points;
				for (let i = 0; i < visualPoints.length - 1; i++) {
					finalPixels.push(
						...Geometry.getLinePoints(
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
						...Geometry.getLinePoints(
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
		const currentPixels = new Uint32Array(editor.canvas.pixels);

		if (editor.studio.isPatternBrushActive && editor.studio.patternBrushData) {
			const pb = editor.studio.patternBrushData;
			const offX = Math.floor(pb.width / 2);
			const offY = Math.floor(pb.height / 2);

			buffer.forEach((idx) => {
				const x = idx % editor.canvas.width;
				const y = Math.floor(idx / editor.canvas.width);

				for (let py = 0; py < pb.height; py++) {
					for (let px = 0; px < pb.width; px++) {
						const targetX = x + px - offX;
						const targetY = y + py - offY;

						if (editor.canvas.isValidCoord(targetX, targetY)) {
							const pbIdx = py * pb.width + px;
							const colorVal = pb.data[pbIdx];
							if (colorVal === 0) continue;

							const index = editor.canvas.getIndex(targetX, targetY);

							if (editor.selection.isActive && !editor.selection.activeIndicesSet.has(index))
								continue;
							if (
								editor.studio.isAlphaLocked &&
								!editor.project.activeFrame.activeLayer.hasPixel(index)
							)
								continue;

							const isEraser = mode.current.type === 'ERASE';
							const finalColorVal = isEraser ? 0 : colorVal;

							const oldVal = currentPixels[index];
							if (oldVal !== finalColorVal) {
								batch.push({
									index,
									oldColor: ColorLogic.uint32ToHex(oldVal),
									newColor: ColorLogic.uint32ToHex(finalColorVal)
								});
								currentPixels[index] = finalColorVal;
							}
						}
					}
				}
			});
		} else {
			const kernel = BrushLogic.getKernel(editor.studio.brushSize, editor.studio.brushShape);

			buffer.forEach((idx) => {
				const x = idx % editor.canvas.width;
				const y = Math.floor(idx / editor.canvas.width);

				const rawPoints = kernel.map((p) => ({ x: x + p.x, y: y + p.y }));

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

				const pointsToDraw = editor.studio.isTilingEnabled
					? rawPoints.map((p) =>
							PixelLogic.wrap(p.x, p.y, editor.canvas.width, editor.canvas.height)
						)
					: rawPoints.filter((p) => editor.canvas.isValidCoord(p.x, p.y));

				pointsToDraw.forEach((p) => {
					const index = editor.canvas.getIndex(p.x, p.y);

					if (editor.selection.isActive && !editor.selection.activeIndicesSet.has(index)) return;

					if (
						editor.studio.isAlphaLocked &&
						!editor.project.activeFrame.activeLayer.hasPixel(index)
					)
						return;

					const activeColorVal = this.getEffectColorForPoint(p.x, p.y, currentPixels[index]);
					const oldVal = currentPixels[index];
					if (oldVal !== activeColorVal) {
						batch.push({
							index,
							oldColor: ColorLogic.uint32ToHex(oldVal),
							newColor: ColorLogic.uint32ToHex(activeColorVal)
						});
						currentPixels[index] = activeColorVal;
					}
				});
			});
		}

		if (batch.length > 0) {
			editor.canvas.pixels = currentPixels;
			editor.canvas.triggerPulse();
			history.push(batch);
			if (mode.current.type === 'ERASE') sfx.playErase();
			else sfx.playDraw();
		}
		editor.canvas.clearBuffer();
	}

	commitShape() {
		const anchor = editor.studio.shapeAnchor;
		if (!anchor) return;

		const { x, y } = editor.cursor.pos;
		const tool = editor.studio.activeTool;

		if (tool === 'GRADIENT') {
			const startColor = editor.studio.gradientStartColor;
			const endColor = editor.paletteState.activeColor;
			if (!startColor) return;

			// If selection exists, fill selection. Otherwise fill whole frame.
			const targetIndices = editor.selection.isActive
				? editor.selection.indices
				: Array.from({ length: editor.canvas.width * editor.canvas.height }, (_, i) => i);

			const gradientMap = PixelLogic.getLinearGradientMap(
				anchor.x,
				anchor.y,
				x,
				y,
				targetIndices,
				editor.canvas.width
			);

			const currentPixels = new Uint32Array(editor.canvas.pixels);
			const batch: Array<{ index: number; oldColor: string | null; newColor: string | null }> = [];

			gradientMap.forEach((m: { index: number; ratio: number }) => {
				const mixed = ColorLogic.mix(startColor, endColor, m.ratio);
				const mixedVal = ColorLogic.hexToUint32(mixed);
				const oldVal = currentPixels[m.index];
				if (oldVal !== mixedVal) {
					batch.push({
						index: m.index,
						oldColor: ColorLogic.uint32ToHex(oldVal),
						newColor: mixed
					});
					currentPixels[m.index] = mixedVal;
				}
			});

			if (batch.length > 0) {
				editor.canvas.pixels = currentPixels;
				editor.canvas.triggerPulse();
				history.push(batch);
				sfx.playDraw();
			}

			editor.studio.activeTool = 'BRUSH';
			editor.studio.shapeAnchor = null;
			editor.studio.gradientStartColor = null;
			return;
		}

		let points: Array<{ x: number; y: number }> = [];
		if (tool === 'RECTANGLE') {
			points = PixelLogic.getRectanglePoints(anchor.x, anchor.y, x, y);
		} else if (tool === 'ELLIPSE') {
			points = PixelLogic.getEllipsePoints(anchor.x, anchor.y, x, y);
		} else if (tool === 'POLYGON') {
			points = PixelLogic.getPolygonPoints(
				anchor.x,
				anchor.y,
				x,
				y,
				editor.studio.polygonSides,
				editor.studio.polygonIndentation
			);
		}

		if (points.length > 0) {
			const activeColor = editor.paletteState.activeColor;
			const activeVal = ColorLogic.hexToUint32(activeColor);
			const batch: Array<{ index: number; oldColor: string | null; newColor: string | null }> = [];
			const currentPixels = new Uint32Array(editor.canvas.pixels);

			points.forEach((p) => {
				if (editor.canvas.isValidCoord(p.x, p.y)) {
					const index = editor.canvas.getIndex(p.x, p.y);
					const oldVal = currentPixels[index];
					if (oldVal !== activeVal) {
						batch.push({
							index,
							oldColor: ColorLogic.uint32ToHex(oldVal),
							newColor: activeColor
						});
						currentPixels[index] = activeVal;
					}
				}
			});

			if (batch.length > 0) {
				editor.canvas.pixels = currentPixels;
				editor.canvas.triggerPulse();
				history.push(batch);
				sfx.playDraw();
			}
		}

		editor.studio.activeTool = 'BRUSH';
		editor.studio.shapeAnchor = null;
	}
}
