import { type ColorHex } from '../types/index';
import { sfx } from '../engine/audio';
import { history } from '../engine/history';

/**
 * The AtelierState: The central heart of the artisan's studio.
 * A pure reactive data container representing the current project state.
 */
export class AtelierState {
	readonly version = __APP_VERSION__;
	projectName = $state('Untitled Stitch');
	currentFilePath = $state<string | null>(null);
	lastSaved = $state<Date | null>(null);
	clipboard = $state<{ width: number; height: number; data: ColorHex[] } | null>(null);

	// --- The Linen (Grid) ---
	linenWidth = $state(32);
	linenHeight = $state(32);
	stitches = $state<ColorHex[]>([]);
	
	// --- The Needle (Cursor) ---
	needlePos = $state({ x: 0, y: 0 });
	activeDye = $state<ColorHex>('#859900');
	
	palette = $state<ColorHex[]>([
		'#073642', '#586e75', '#859900', '#2aa198', '#268bd2', 
		'#6c71c4', '#d33682', '#dc322f', '#cb4b16', '#b58900'
	]);

	zoomLevel = $state(1);
	
	// --- Studio Flags ---
	showDyeBasin = $state(false);
	showPatternCatalog = $state(false);
	showArtisanGuide = $state(false);
	showArtifactCrate = $state(false);
	
	exportScale = $state(10);
	exportBgColor = $state<string | 'transparent'>('transparent');
	isMuted = $state(false);
	isPicking = $state(false);
	isAppReady = $state(false);
	isNeedleVisible = $state(true);
	
	// Internal Flow States (LoomPad feedback)
	isFlowStitch = $state(false);
	isFlowUnstitch = $state(false);
	isFlowSelect = $state(false);

	// Inactivity Logic
	private inactivityTimer: any = null;
	private readonly INACTIVITY_TIMEOUT = 20000;

	// Selection/Block mode
	selectionStart = $state<{ x: number; y: number } | null>(null);
	selectionEnd = $state<{ x: number; y: number } | null>(null);

	// Universal Escape Stack
	private escapeStack: (() => void)[] = [];

	constructor(width = 32, height = 32) {
		this.linenWidth = width;
		this.linenHeight = height;
		this.stitches = Array(width * height).fill('#eee8d5');
		this.resetInactivityTimer();
	}

	// --- Core State Management ---

	resetInactivityTimer() {
		this.isNeedleVisible = true;
		if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
		this.inactivityTimer = setTimeout(() => {
			this.isNeedleVisible = false;
		}, this.INACTIVITY_TIMEOUT);
	}

	toggleMute() {
		this.isMuted = !this.isMuted;
	}

	setZoom(delta: number) {
		const newZoom = this.zoomLevel + delta;
		this.zoomLevel = Math.max(0.5, Math.min(5, Number(newZoom.toFixed(1))));
		this.resetInactivityTimer();
	}

	resetZoom() {
		this.zoomLevel = 1;
		this.resetInactivityTimer();
	}

	selectPalette(index: number) {
		if (index >= 0 && index < this.palette.length) {
			this.activeDye = this.palette[index];
		}
		this.resetInactivityTimer();
	}

	pushEscapeAction(fn: () => void) {
		this.escapeStack.push(fn);
	}

	popEscapeAction(fn: () => void) {
		this.escapeStack = this.escapeStack.filter((item) => item !== fn);
	}

	handleEscape() {
		const lastAction = this.escapeStack.pop();
		if (lastAction) {
			lastAction();
			return true;
		}
		return false;
	}

	undo() {
		const action = history.undo();
		if (action) {
			this.stitches[action.index] = action.oldColor;
			sfx.playUnstitch();
		}
		this.resetInactivityTimer();
	}

	redo() {
		const action = history.redo();
		if (action) {
			this.stitches[action.index] = action.newColor;
			sfx.playStitch();
		}
		this.resetInactivityTimer();
	}

	// --- Derived Projections ---

	usedColors = $derived.by(() => {
		const colors = new Set<string>();
		this.stitches.forEach((color) => {
			if (color !== '#eee8d5') colors.add(color);
		});
		return Array.from(colors);
	});

	displayCoords = $derived.by(() => {
		const calc = (pos: number, size: number) => {
			const mid = Math.floor(size / 2);
			return size % 2 === 0 ? (pos < mid ? pos - mid : pos - mid + 1) : pos - mid;
		};
		return { x: calc(this.needlePos.x, this.linenWidth), y: -calc(this.needlePos.y, this.linenHeight) };
	});

	cameraTransform = $derived.by(() => {
		if (this.zoomLevel <= 1) return `scale(${this.zoomLevel})`;
		const xPos = ((this.needlePos.x + 0.5) / this.linenWidth) * 100;
		const yPos = ((this.needlePos.y + 0.5) / this.linenHeight) * 100;
		return `translate(${50 - xPos}%, ${50 - yPos}%) scale(${this.zoomLevel})`;
	});
}

export const atelier = new AtelierState();
