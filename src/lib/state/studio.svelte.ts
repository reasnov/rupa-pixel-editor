import { untrack } from 'svelte';
import overlaysData from '../config/overlays.json' with { type: 'json' };

/**
 * StudioState: Manages the environment, UI flags, and viewport.
 */
export class StudioState {
	zoomLevel = $state(1);
	isMuted = $state(false);
	isAmbientPlaying = $state(true);
	isAppReady = $state(false);
	isPicking = $state(false);

	// Master Etching (v0.8.0)
	brushSize = $state(1); // 1 to 5
	brushShape = $state<'SQUARE' | 'CIRCLE'>('SQUARE');
	symmetryMode = $state<'OFF' | 'HORIZONTAL' | 'VERTICAL' | 'QUADRANT'>('OFF');
	isTilingEnabled = $state(false);
	isAlphaLocked = $state(false);
	isColorLocked = $state(false);
	isPixelPerfect = $state(false);
	colorLockSource = $state<string | null>(null);

	activeTool = $state<'BRUSH' | 'ERASER' | 'RECTANGLE' | 'ELLIPSE' | 'POLYGON' | 'GRADIENT'>(
		'BRUSH'
	);
	shapeAnchor = $state<{ x: number; y: number } | null>(null);
	polygonSides = $state(3); // 3 to 12
	polygonIndentation = $state(0); // 0 to 100 (percentage)

	// Gradient (Wave III)
	gradientStartColor = $state<string | null>(null);
	gradientEndColor = $state<string | null>(null);

	// Smoothing & Stabilization (0 to 100)
	stabilization = $state(50);

	// Audio Levels (0.0 to 1.0)
	bgmVolume = $state(0.5);
	sfxVolume = $state(0.5);

	// Timeline Settings
	fps = $state(10);
	isKineticMode = $state(false);
	showGhostLayers = $state(false);
	timelineZoom = $state(1);

	// Session Tracking
	sessionStartTime = Date.now();
	usageMinutes = $state(0);
	usageSeconds = $state(0);

	// Derived human-readable session time
	sessionTimeLabel = $derived.by(() => {
		const totalSeconds = this.usageSeconds;
		const h = Math.floor(totalSeconds / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = totalSeconds % 60;
		return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	});

	// Overlay Flags (Professional terminology)
	showColorPicker = $state(false);
	showAudioSettings = $state(false);
	showCommandPalette = $state(false);
	showGuideMenu = $state(false);
	showGuideBook = $state(false);
	showExportMenu = $state(false);
	showCanvasSettings = $state(false);
	showPersistenceMenu = $state(false);
	showUnderlayMenu = $state(false);
	showGoTo = $state(false);

	// Underlay (Wave II)
	underlayImage = $state<string | null>(null);
	isUnderlayVisible = $state(true);
	underlayOpacity = $state(0.2);
	underlayOffset = $state({ x: 0, y: 0 });
	underlayScale = $state(1.0);

	isTransforming = $state(false);

	// Shading & Toning (v0.8.0 Mouse Support)
	isShadingLighten = $state(false);
	isShadingDarken = $state(false);
	isShadingDither = $state(false);

	// Pattern Brush (Wave III)
	isPatternBrushActive = $state(false);
	patternBrushData = $state<{
		width: number;
		height: number;
		data: (string | null)[];
	} | null>(null);

	// Tab States
	projectActiveTab = $state<'frames' | 'layers'>('layers');

	// HUD Feedback (Toasts)
	toastMessage = $state('');
	showToast = $state(false);
	private toastTimer: any = null;

	show(message: string) {
		this.toastMessage = message;
		this.showToast = true;
		if (this.toastTimer) clearTimeout(this.toastTimer);
		this.toastTimer = setTimeout(() => {
			this.showToast = false;
		}, 2000);
	}

	// Environment Settings
	backgroundColor = $state('#eee8d5');

	// Export Settings
	exportScale = $state(10);
	exportBgColor = $state<string | 'transparent'>('transparent');
	includePixelBorders = $state(false);

	private escapeStack: (() => void)[] = [];
	private _overlayStack = $state<string[]>([]);

	private _managedOverlays = overlaysData.managed;

	constructor() {
		setInterval(() => {
			const elapsed = Date.now() - this.sessionStartTime;
			this.usageMinutes = Math.floor(elapsed / 60000);
			this.usageSeconds = Math.floor(elapsed / 1000);
		}, 1000);
	}

	mount() {
		$effect(() => {
			for (const flag of this._managedOverlays) {
				const isActive = (this as any)[flag];
				if (isActive) {
					if (!untrack(() => this._overlayStack.includes(flag))) {
						this._overlayStack = [...untrack(() => this._overlayStack), flag];
					}
				} else {
					if (untrack(() => this._overlayStack.includes(flag))) {
						this._overlayStack = untrack(() => this._overlayStack.filter((f) => f !== flag));
					}
				}
			}
		});
	}

	setZoom(delta: number) {
		const newZoom = this.zoomLevel + delta;
		this.zoomLevel = Math.max(0.1, Math.min(10, Number(newZoom.toFixed(1))));
	}

	resetZoom() {
		this.zoomLevel = 1;
	}

	toggleMute() {
		this.isMuted = !this.isMuted;
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

		const lastOverlay = this._overlayStack[this._overlayStack.length - 1];
		if (lastOverlay) {
			(this as any)[lastOverlay] = false;
			return true;
		}

		return false;
	}
}
