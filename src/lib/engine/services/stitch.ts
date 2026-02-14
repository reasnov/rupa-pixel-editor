import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';
import { FiberEngine } from '../fiber.js';

/**
 * StitchService: Manages the lifecycle of digital stitching.
 * Uses FiberEngine for pixel math and ensures sequential processing.
 */
export class StitchService {
	stitch(tx?: number, ty?: number) {
		const x = tx !== undefined ? Math.floor(tx) : atelier.needle.pos.x;
		const y = ty !== undefined ? Math.floor(ty) : atelier.needle.pos.y;

		const index = atelier.linen.getIndex(x, y);
		const oldColor = atelier.linen.stitches[index];
		const activeDye = atelier.paletteState.activeDye;

		if (oldColor !== activeDye) {
			const currentStitches = [...atelier.linen.stitches];
			currentStitches[index] = activeDye;
			atelier.linen.stitches = currentStitches;
			history.push({ index, oldColor, newColor: activeDye });
			sfx.playStitch();
		}
	}

	unstitch(tx?: number, ty?: number) {
		const x = tx !== undefined ? Math.floor(tx) : atelier.needle.pos.x;
		const y = ty !== undefined ? Math.floor(ty) : atelier.needle.pos.y;

		const index = atelier.linen.getIndex(x, y);
		const oldColor = atelier.linen.stitches[index];

		if (oldColor !== null) {
			const currentStitches = [...atelier.linen.stitches];
			currentStitches[index] = null;
			atelier.linen.stitches = currentStitches;
			history.push({ index, oldColor, newColor: null });
			sfx.playUnstitch();
		}
	}

	// --- Sequential Stroke Management (The Render) ---

	beginStroke(x: number, y: number) {
		atelier.linen.clearBuffer();
		atelier.linen.addToBuffer(x, y);
	}

	continueStroke(x: number, y: number, lastX: number, lastY: number) {
		// Normal rendering: Standard Bresenham (8-connect) for clean 1px lines
		// Gaps are avoided by interpolation, but diagonal zigzags are minimized.
		const points = FiberEngine.getLinePoints(lastX, lastY, x, y, 0);
		atelier.linen.addBatchToBuffer(points);
	}

	endStroke() {
		this.commitBuffer();
	}

	/**
	 * Forcefully stops and clears the current drawing state.
	 */
	cancelStroke() {
		atelier.linen.clearBuffer();
		sfx.playUnstitch(); // Subtle audio feedback for cancellation
	}

	/**
	 * Quick Shape Correction: Snaps current buffer to perfect geometric forms.
	 */
	snapCurrentStroke() {
		const rawPoints = atelier.linen.strokePoints;
		if (rawPoints.length < 5) return;

		const stab = atelier.studio.stabilization;
		const smoothed = FiberEngine.smoothPath(rawPoints, stab / 10);
		const arcData = FiberEngine.fitArc(smoothed, stab);
		
		atelier.linen.clearBuffer();
		let finalPixels: Array<{ x: number; y: number }> = [];
		let visualPoints: Array<{ x: number; y: number }> = [];

		if (arcData && arcData.isFull) {
			// 1. PERFECT CIRCLE (Midpoint Circle Algorithm)
			visualPoints = arcData.points;
			finalPixels = FiberEngine.getCirclePoints(arcData.cx, arcData.cy, arcData.r);
		} else {
			const simplified = FiberEngine.simplifyPath(smoothed, (stab / 100) * 2.0);
			
			if (simplified.length === 2) {
				// 2. PERFECT LINES (H, V, 45D)
				let p1 = { ...simplified[0] };
				let p2 = { ...simplified[simplified.length - 1] };
				
				const dx = Math.abs(p2.x - p1.x);
				const dy = Math.abs(p2.y - p1.y);
				const snapThreshold = 3.0; // Leniency for special curves

				if (dx < snapThreshold) {
					p2.x = p1.x; // Force Vertical
				} else if (dy < snapThreshold) {
					p2.y = p1.y; // Force Horizontal
				} else if (Math.abs(dx - dy) < snapThreshold) {
					// Force Diagonal 45deg
					const size = Math.max(dx, dy);
					p2.x = p1.x + size * Math.sign(p2.x - p1.x);
					p2.y = p1.y + size * Math.sign(p2.y - p1.y);
				}

				visualPoints = [p1, p2];
				// Use 0 broadness for special lines to ensure they are 1-pixel thin
				finalPixels = FiberEngine.getLinePoints(p1.x, p1.y, p2.x, p2.y, 0);
			} else if (arcData) {
				// 3. PERFECT ARC
				visualPoints = arcData.points;
				for (let i = 0; i < visualPoints.length - 1; i++) {
					finalPixels.push(...FiberEngine.getLinePoints(
						visualPoints[i].x, visualPoints[i].y, 
						visualPoints[i+1].x, visualPoints[i+1].y, 
						stab / 100
					));
				}
			} else {
				// 4. GENERAL SMOOTHING
				visualPoints = simplified;
				for (let i = 0; i < visualPoints.length - 1; i++) {
					finalPixels.push(...FiberEngine.getLinePoints(
						visualPoints[i].x, visualPoints[i].y, 
						visualPoints[i+1].x, visualPoints[i+1].y, 
						stab / 100
					));
				}
			}
		}

		atelier.linen.addBatchToBuffer(finalPixels);
		atelier.linen.strokePoints = visualPoints;
		sfx.playStitch();
	}

	private commitBuffer() {
		const buffer = atelier.linen.stitchBuffer;
		if (buffer.length === 0) {
			atelier.linen.clearBuffer();
			return;
		}

		const activeDye = atelier.paletteState.activeDye;
		const batch: Array<{ index: number; oldColor: string | null; newColor: string | null }> = [];
		const currentStitches = [...atelier.linen.stitches];

		buffer.forEach((index) => {
			const oldColor = currentStitches[index];
			if (oldColor !== activeDye) {
				batch.push({ index, oldColor, newColor: activeDye });
				currentStitches[index] = activeDye;
			}
		});

		if (batch.length > 0) {
			atelier.linen.stitches = currentStitches;
			history.push(batch);
			sfx.playStitch();
		}
		atelier.linen.clearBuffer();
	}
}
