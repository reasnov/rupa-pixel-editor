import { CanvasState } from './canvas.svelte.js';
import { CursorState } from './cursor.svelte.js';
import { PaletteState } from './palette.svelte.js';
import { StudioState } from './studio.svelte.js';
import { ProjectState } from './project.svelte.js';
import { SelectionState } from './selection.svelte.js';
import { history } from '../engine/history.js';
import { sfx } from '../engine/audio.js';
import { services } from '../engine/services.js';
import { ColorLogic } from '../logic/color.js';
import { Geometry } from '../logic/geometry.js';
import { pointer } from '../engine/pointer.svelte.js';

/**
 * The EditorState: The root orchestrator of the application.
 * It delegates concerns to specialized sub-states.
 */
export class EditorState {
	readonly version = __APP_VERSION__;

	// Sub-states (Initialization Order Matters!)
	project = new ProjectState();
	canvas = new CanvasState(this.project);
	cursor = new CursorState();
	paletteState = new PaletteState();
	studio = new StudioState();
	selection = new SelectionState();

	// --- Logic Proxies ---

	get pixels() {
		return this.canvas.pixels;
	}
	set pixels(v) {
		this.canvas.pixels = v;
	}

	get canvasWidth() {
		return this.canvas.width;
	}
	set canvasWidth(v) {
		this.canvas.width = v;
	}

	get canvasHeight() {
		return this.canvas.height;
	}
	set canvasHeight(v) {
		this.canvas.height = v;
	}

	get activeColor() {
		return this.paletteState.activeColor;
	}
	set activeColor(v) {
		this.paletteState.activeColor = v;
	}

	get palette() {
		return this.paletteState.swatches;
	}
	set palette(v) {
		this.paletteState.swatches = v;
	}

	get isMuted() {
		return this.studio.isMuted;
	}
	set isMuted(v) {
		this.studio.isMuted = v;
	}

	get sfxVolume() {
		return this.studio.sfxVolume;
	}
	set sfxVolume(v) {
		this.studio.sfxVolume = v;
	}

	get bgmVolume() {
		return this.studio.bgmVolume;
	}
	set bgmVolume(v) {
		this.studio.bgmVolume = v;
	}

	get usageMinutes() {
		return this.studio.usageMinutes;
	}

	get backgroundColor() {
		return this.studio.backgroundColor;
	}
	set backgroundColor(v) {
		this.studio.backgroundColor = v;
	}

	constructor() {
		// Start Usage Heartbeat
		setInterval(() => {
			const elapsed = Date.now() - this.studio.sessionStartTime;
			this.studio.usageMinutes = Math.floor(elapsed / 60000);
			this.studio.usageSeconds = Math.floor(elapsed / 1000);
		}, 1000);
	}

	get isAppReady() {
		return this.studio.isAppReady;
	}
	set isAppReady(v) {
		this.studio.isAppReady = v;
	}

	get isPicking() {
		return this.studio.isPicking;
	}
	set isPicking(v) {
		this.studio.isPicking = v;
	}

	get isCursorVisible() {
		return this.cursor.isVisible;
	}
	set isCursorVisible(v) {
		this.cursor.isVisible = v;
	}

	// UI Overlays
	get showColorPicker() {
		return this.studio.showColorPicker;
	}
	set showColorPicker(v) {
		this.studio.showColorPicker = v;
	}

	get showAudioSettings() {
		return this.studio.showAudioSettings;
	}
	set showAudioSettings(v) {
		this.studio.showAudioSettings = v;
	}

	get showCommandPalette() {
		return this.studio.showCommandPalette;
	}
	set showCommandPalette(v) {
		this.studio.showCommandPalette = v;
	}

	get showGuideBook() {
		return this.studio.showGuideBook;
	}
	set showGuideBook(v) {
		this.studio.showGuideBook = v;
	}

	get showGuideMenu() {
		return this.studio.showGuideMenu;
	}
	set showGuideMenu(v) {
		this.studio.showGuideMenu = v;
	}

	get showExportMenu() {
		return this.studio.showExportMenu;
	}
	set showExportMenu(v) {
		this.studio.showExportMenu = v;
	}

	get showCanvasSettings() {
		return this.studio.showCanvasSettings;
	}
	set showCanvasSettings(v) {
		this.studio.showCanvasSettings = v;
	}

	get showPersistenceMenu() {
		return this.studio.showPersistenceMenu;
	}
	set showPersistenceMenu(v) {
		this.studio.showPersistenceMenu = v;
	}

	get showGoTo() {
		return this.studio.showGoTo;
	}
	set showGoTo(v) {
		this.studio.showGoTo = v;
	}

	get showGhostLayers() {
		return this.studio.showGhostLayers;
	}
	set showGhostLayers(v) {
		this.studio.showGhostLayers = v;
	}

	// --- Derived Projections ---

	displayCoords = $derived.by(() => {
		return {
			x: Geometry.toCartesianLabel(this.cursor.pos.x, this.canvas.width),
			y: Geometry.toCartesianLabel(this.cursor.pos.y, this.canvas.height, true)
		};
	});

	cameraTransform = $derived.by(() => {
		return Geometry.calculateCameraTransform(
			this.studio.zoomLevel,
			this.studio.panOffset,
			this.cursor.pos,
			this.canvas.width,
			this.canvas.height
		);
	});

	usedColors = $derived.by(() => {
		const colors = new Set<string>();
		this.canvas.compositePixels.forEach((val) => {
			const hex = ColorLogic.uint32ToHex(val);
			if (hex !== null) colors.add(hex);
		});
		return Array.from(colors);
	});

	// --- Passthrough Methods ---

	pushEscapeAction(fn: (onClose?: any) => void) {
		this.studio.pushEscapeAction(fn);
	}
	popEscapeAction(fn: (onClose?: any) => void) {
		this.studio.popEscapeAction(fn);
	}
	toggleMute() {
		this.studio.toggleMute();
	}

	handleEscape() {
		const lastAction = this.studio.handleEscape();
		if (lastAction) return true;

		// 1. Reset Multiple Selections in UI
		let wasMulti = false;
		if (this.project.selectedFrameIndices.size > 1) {
			this.project.selectedFrameIndices = new Set([this.project.activeFrameIndex]);
			wasMulti = true;
		}

		const frame = this.project.activeFrame;
		if (frame.selectedLayerIndices.size > 1) {
			frame.selectedLayerIndices = new Set([frame.activeLayerIndex]);
			wasMulti = true;
		}

		if (wasMulti) return true;

		// 2. Handle drawing/tool escapes
		if (pointer.isPointerDownActive) {
			pointer.cancel();
			return true;
		}

		if (this.selection.isActive) {
			if (this.studio.isTransforming) {
				this.studio.isTransforming = false;
				return true;
			}
			this.selection.clear();
			return true;
		}

		if (this.studio.activeTool !== 'BRUSH') {
			this.studio.activeTool = 'BRUSH';
			this.studio.shapeAnchor = null;
			return true;
		}

		// Shading Reset
		if (
			this.studio.isShadingLighten ||
			this.studio.isShadingDarken ||
			this.studio.isShadingDither
		) {
			this.studio.isShadingLighten = false;
			this.studio.isShadingDarken = false;
			this.studio.isShadingDither = false;
			this.studio.show('Shading Reset');
			return true;
		}

		return false;
	}

	undo() {
		const entry = history.undo();
		if (entry) {
			if ('isStructural' in entry) {
				entry.undo();
				sfx.playErase();
			} else if (Array.isArray(entry)) {
				const currentPixels = new Uint32Array(this.canvas.pixels);
				for (let i = entry.length - 1; i >= 0; i--) {
					const action = entry[i];
					currentPixels[action.index] = ColorLogic.hexToUint32(action.oldColor);
				}
				this.canvas.pixels = currentPixels;
				this.canvas.triggerPulse();
				sfx.playErase();
			} else {
				const currentPixels = new Uint32Array(this.canvas.pixels);
				currentPixels[entry.index] = ColorLogic.hexToUint32(entry.oldColor);
				this.canvas.pixels = currentPixels;
				this.canvas.triggerPulse();
				sfx.playErase();
			}
		}
		this.cursor.resetInactivityTimer();
	}

	redo() {
		const entry = history.redo();
		if (entry) {
			if ('isStructural' in entry) {
				entry.redo();
				sfx.playDraw();
			} else if (Array.isArray(entry)) {
				const currentPixels = new Uint32Array(this.canvas.pixels);
				for (const action of entry) {
					currentPixels[action.index] = ColorLogic.hexToUint32(action.newColor);
				}
				this.canvas.pixels = currentPixels;
				this.canvas.triggerPulse();
				sfx.playDraw();
			} else {
				const currentPixels = new Uint32Array(this.canvas.pixels);
				currentPixels[entry.index] = ColorLogic.hexToUint32(entry.newColor);
				this.canvas.pixels = currentPixels;
				this.canvas.triggerPulse();
				sfx.playDraw();
			}
		}
		this.cursor.resetInactivityTimer();
	}

	clearCanvas() {
		services.clearCanvas();
	}
	pickColor() {
		services.pickColor();
	}
	loadProject() {
		services.load();
	}
	copySelection() {
		services.copy();
	}
	cutSelection() {
		services.cut();
	}
	pasteSelection() {
		services.paste();
	}
	flipCanvas(axis: 'horizontal' | 'vertical') {
		services.flipCanvas(axis);
	}
	rotateCanvas() {
		services.rotateCanvas();
	}
}

export const editor = new EditorState();
