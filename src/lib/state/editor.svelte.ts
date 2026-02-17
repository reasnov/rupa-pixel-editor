import { CanvasState } from './canvas.svelte.js';
import { CursorState } from './cursor.svelte.js';
import { PaletteState } from './palette.svelte.js';
import { StudioState } from './studio.svelte.js';
import { ProjectState } from './project.svelte.js';
import { SelectionState } from './selection.svelte.js';
import { history } from '../engine/history.js';
import { sfx } from '../engine/audio.js';
import { shuttle } from '../engine/shuttle.js';

/**
 * The EditorState: The root orchestrator of the café editor.
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

	// --- Professional Logic Proxies ---

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

	// UI Overlays (Professional Naming)
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
		const calc = (pos: number, size: number) => {
			const mid = Math.floor(size / 2);
			return size % 2 === 0 ? (pos < mid ? pos - mid : pos - mid + 1) : pos - mid;
		};
		return {
			x: calc(this.cursor.pos.x, this.canvas.width),
			y: -calc(this.cursor.pos.y, this.canvas.height)
		};
	});

	cameraTransform = $derived.by(() => {
		const effectiveZoom = this.studio.zoomLevel;

		if (this.studio.zoomLevel <= 1) {
			return `translate(-50%, -50%) scale(${effectiveZoom})`;
		}

		const xPct = ((this.cursor.pos.x + 0.5) / this.canvas.width) * 100;
		const yPct = ((this.cursor.pos.y + 0.5) / this.canvas.height) * 100;

		return `translate(-${xPct}%, -${yPct}%) scale(${effectiveZoom})`;
	});

	usedColors = $derived.by(() => {
		const colors = new Set<string>();
		this.canvas.compositePixels.forEach((color) => {
			if (color !== null) colors.add(color);
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
		return this.studio.handleEscape();
	}

	undo() {
		const entry = history.undo();
		if (entry) {
			if ('isStructural' in entry) {
				entry.undo();
				sfx.playErase();
			} else if (Array.isArray(entry)) {
				for (let i = entry.length - 1; i >= 0; i--) {
					const action = entry[i];
					this.canvas.pixels[action.index] = action.oldColor;
				}
				sfx.playErase();
			} else {
				this.canvas.pixels[entry.index] = entry.oldColor;
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
				for (const action of entry) {
					this.canvas.pixels[action.index] = action.newColor;
				}
				sfx.playDraw();
			} else {
				this.canvas.pixels[entry.index] = entry.newColor;
				sfx.playDraw();
			}
		}
		this.cursor.resetInactivityTimer();
	}

	clearCanvas() {
		shuttle.clearCanvas();
	}
	tasteColor() {
		shuttle.pickColor();
	}
	loadRecipe() {
		shuttle.load();
	}
	copySelection() {
		shuttle.copy();
	}
	cutSelection() {
		shuttle.cut();
	}
	pasteSelection() {
		shuttle.paste();
	}
	flipCanvas(axis: 'horizontal' | 'vertical') {
		shuttle.flipCanvas(axis);
	}
	rotateCanvas() {
		shuttle.rotateCanvas();
	}
}

export const editor = new EditorState();
