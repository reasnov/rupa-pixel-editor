import { editor as state } from '../state/editor.svelte.js';
import { editor as engine } from './editor.svelte.js';
import { keyboard } from './keyboard.svelte.js';
import { input } from './input.svelte.js';
import { mode } from './mode.svelte.js';
import { services } from './services.js';
import { Geometry } from '../logic/geometry.js';

/**
 * PointerEngine: Manages fluid pointer interactions.
 */
export class PointerEngine {
	private isPointerDown = false;
	isPointerDownActive = $state(false);
	private lastPosition = { x: -1, y: -1 };
	private lastScreenPos: { x: number; y: number } | null = null;
	private buttonType: 'primary' | 'secondary' | null = null;
	private holdTimer: any = null;
	private isSnapped = false;
	private rafId: number | null = null;
	isSnappedState = $state(false);

	mapToGrid(clientX: number, clientY: number, canvasElement: HTMLElement) {
		const rect = canvasElement.getBoundingClientRect();
		return Geometry.mapScreenToGrid(
			clientX,
			clientY,
			rect,
			state.canvas.width,
			state.canvas.height
		);
	}

	handleStart(e: PointerEvent, canvasElement: HTMLElement) {
		engine.resetAutoSaveTimer();
		this.isPointerDown = true;
		this.isPointerDownActive = true;
		this.isSnapped = false;
		this.buttonType = e.button === 2 ? 'secondary' : 'primary';
		this.lastScreenPos = { x: e.clientX, y: e.clientY };

		const pos = this.mapToGrid(e.clientX, e.clientY, canvasElement);
		this.lastPosition = { x: pos.x, y: pos.y };

		// Quick Navigation: CTRL + CLICK to Jump To without drawing
		if (e.ctrlKey || e.metaKey) {
			state.cursor.pos = { x: Math.floor(pos.x), y: Math.floor(pos.y) };
			this.isPointerDown = false; // Prevent further move/end logic
			this.isPointerDownActive = false;
			return;
		}

		const currentMode = mode.current.type;
		if (currentMode === 'PAN') return;

		state.cursor.pos = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

		const tool = state.studio.activeTool;

		// Selection Tool Support
		if (this.buttonType === 'primary' && tool === 'SELECT') {
			services.selection.begin(state.cursor.pos.x, state.cursor.pos.y);
			return;
		}

		// Geometric Tool Support
		if (
			this.buttonType === 'primary' &&
			['RECTANGLE', 'ELLIPSE', 'POLYGON', 'GRADIENT'].includes(tool)
		) {
			state.studio.shapeAnchor = { ...state.cursor.pos };
			if (tool === 'GRADIENT') state.studio.gradientStartColor = state.paletteState.activeColor;
			return;
		}

		const isShading =
			state.studio.isShadingLighten || state.studio.isShadingDarken || state.studio.isShadingDither;

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
			const currentMode = mode.current.type;
			const tool = state.studio.activeTool;

			// --- Pan Mode Support ---
			if (currentMode === 'PAN') {
				const delta = Geometry.calculatePanDelta(
					e.clientX,
					e.clientY,
					this.lastScreenPos?.x || e.clientX,
					this.lastScreenPos?.y || e.clientY
				);
				state.studio.panOffset.x += delta.dx;
				state.studio.panOffset.y += delta.dy;
				this.lastScreenPos = { x: e.clientX, y: e.clientY };
				this.rafId = null;
				return;
			}

			state.cursor.pos = { x: Math.floor(pos.x), y: Math.floor(pos.y) };

			if (this.buttonType === 'primary' && tool === 'SELECT') {
				services.selection.update(state.cursor.pos.x, state.cursor.pos.y);
				this.rafId = null;
				return;
			}

			const isShading =
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
			this.lastScreenPos = { x: e.clientX, y: e.clientY };
			this.rafId = null;
		});
	}

	handleEnd() {
		if (!this.isPointerDown) return;
		this.isPointerDown = false;
		this.isPointerDownActive = false;
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
			services.draw.commitShape();
		} else if (this.buttonType === 'primary' && tool === 'SELECT') {
			services.selection.commit();
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
		this.isPointerDownActive = false;
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
