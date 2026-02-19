import { editor as state } from '../state/editor.svelte.js';
import { editor as engine } from './editor.svelte.js';
import { input } from './input.svelte.js';
import { mode } from './mode.svelte.js';
import { services } from './services.js';

/**
 * PointerEngine: Manages fluid pointer interactions.
 */
export class PointerEngine {
	private isPointerDown = false;
	private lastPosition = { x: -1, y: -1 };
	private buttonType: 'primary' | 'secondary' | null = null;
	private holdTimer: any = null;
	private isSnapped = false;
	private rafId: number | null = null;
	isSnappedState = $state(false);

	mapToGrid(clientX: number, clientY: number, canvasElement: HTMLElement) {
		const rect = canvasElement.getBoundingClientRect();
		const { width, height } = state.canvas;

		const xPct = (clientX - rect.left) / rect.width;
		const yPct = (clientY - rect.top) / rect.height;

		return {
			x: xPct * width,
			y: yPct * height
		};
	}

	handleStart(e: PointerEvent, canvasElement: HTMLElement) {
		engine.resetAutoSaveTimer();
		this.isPointerDown = true;
		this.isSnapped = false;
		this.buttonType = e.button === 2 ? 'secondary' : 'primary';

		const pos = this.mapToGrid(e.clientX, e.clientY, canvasElement);
		this.lastPosition = { x: pos.x, y: pos.y };

		state.cursor.pos = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

		// Geometric Tool Support
		const tool = state.studio.activeTool;
		if (
			this.buttonType === 'primary' &&
			['RECTANGLE', 'ELLIPSE', 'POLYGON', 'GRADIENT'].includes(tool)
		) {
			state.studio.shapeAnchor = { ...state.cursor.pos };
			if (tool === 'GRADIENT') state.studio.gradientStartColor = state.paletteState.activeColor;
			return;
		}

		const currentMode = mode.current.type;
		const isShading =
			keyboard.isLDown ||
			keyboard.isDDown ||
			keyboard.isXDown ||
			state.studio.isShadingLighten ||
			state.studio.isShadingDarken ||
			state.studio.isShadingDither;

		if (this.buttonType === 'primary' && currentMode !== 'SELECT') {
			if (isShading) {
				services.draw.draw(pos.x, pos.y);
			} else {
				services.draw.beginStroke(pos.x, pos.y);
				this.startHoldTimer();
			}
		}
	}

	handleMove(e: PointerEvent, canvasElement: HTMLElement) {
		if (!this.isPointerDown) return;
		engine.resetAutoSaveTimer();

		if (this.rafId) return;

		this.rafId = requestAnimationFrame(() => {
			const pos = this.mapToGrid(e.clientX, e.clientY, canvasElement);
			state.cursor.pos = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

			const currentMode = mode.current.type;
			const tool = state.studio.activeTool;

			const isShading =
				keyboard.isLDown ||
				keyboard.isDDown ||
				keyboard.isXDown ||
				state.studio.isShadingLighten ||
				state.studio.isShadingDarken ||
				state.studio.isShadingDither;

			// Shapes and Gradients handle their own visual preview via Canvas.svelte
			if (
				this.buttonType === 'primary' &&
				['RECTANGLE', 'ELLIPSE', 'POLYGON', 'GRADIENT'].includes(tool)
			) {
				this.lastPosition = { x: pos.x, y: pos.y };
				this.rafId = null;
				return;
			}

			if (this.buttonType === 'primary' && currentMode !== 'SELECT') {
				if (isShading) {
					// Immediate feedback for shading/toning
					services.draw.draw(pos.x, pos.y);
				} else if (!this.isSnapped) {
					services.draw.continueStroke(pos.x, pos.y, this.lastPosition.x, this.lastPosition.y);
					this.resetHoldTimer();
				}
			}

			this.lastPosition = { x: pos.x, y: pos.y };
			this.rafId = null;
		});
	}

	handleEnd() {
		if (!this.isPointerDown) return;
		this.isPointerDown = false;
		this.clearHoldTimer();
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}

		const currentMode = mode.current.type;
		const tool = state.studio.activeTool;

		// Shape/Gradient Commit on Mouse Up
		if (
			this.buttonType === 'primary' &&
			['RECTANGLE', 'ELLIPSE', 'POLYGON', 'GRADIENT'].includes(tool)
		) {
			engine.commitShape();
		} else if (this.buttonType === 'primary' && currentMode !== 'SELECT') {
			services.draw.endStroke();
		} else {
			state.canvas.clearBuffer();
		}

		this.buttonType = null;
		this.lastPosition = { x: -1, y: -1 };
		this.isSnapped = false;
		this.isSnappedState = false;
	}

	cancel() {
		this.isPointerDown = false;
		this.clearHoldTimer();
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
		this.buttonType = null;
		this.lastPosition = { x: -1, y: -1 };
		this.isSnapped = false;
		this.isSnappedState = false;
		services.draw.cancelStroke();
	}

	private startHoldTimer() {
		this.clearHoldTimer();
		this.holdTimer = setTimeout(() => {
			if (this.isPointerDown) {
				this.triggerSnap();
			}
		}, 600);
	}

	private resetHoldTimer() {
		if (!this.isSnapped) this.startHoldTimer();
	}

	private clearHoldTimer() {
		if (this.holdTimer) clearTimeout(this.holdTimer);
		this.holdTimer = null;
	}

	private triggerSnap() {
		this.isSnapped = true;
		this.isSnappedState = true;
		services.draw.snapCurrentStroke();
	}
}

export const pointer = new PointerEngine();
