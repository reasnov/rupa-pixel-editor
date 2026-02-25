import { untrack } from 'svelte';
import overlaysData from '../config/overlays.json' with { type: 'json' };

/**
 * StudioState: Manages the environment, UI flags, and viewport.
 * Uses Svelte 5 Runes for fine-grained reactivity.
 */
export class StudioState {
	// Viewport & Zoom
	zoomLevel = $state(1);
	panOffset = $state({ x: 0, y: 0 });
	isHandToolActive = $state(false);

	// App Status
	isMuted = $state(false);
	isAmbientPlaying = $state(true);
	isAppReady = $state(false);
	isPicking = $state(false);
	isTransforming = $state(false);

	// Theme (v0.9.3)
	theme = $state<'light' | 'dark'>('light');

	// Master Etching (Brush Settings)
	brushSize = $state(1);
	brushHardness = $state(100);
	isDitherBlendActive = $state(false);
	brushShape = $state<'SQUARE' | 'CIRCLE'>('SQUARE');
	symmetryMode = $state<'OFF' | 'HORIZONTAL' | 'VERTICAL' | 'QUADRANT'>('OFF');
	isTilingEnabled = $state(false);
	isAlphaLocked = $state(false);
	isColorLocked = $state(false);
	isPixelPerfect = $state(false);
	colorLockSource = $state<string | null>(null);

	// The Mist (Airbrush)
	isAirbrushActive = $state(false);
	airbrushDensity = $state(0.2);

	// Shading & Toning
	isShadingLighten = $state(false);
	isShadingDarken = $state(false);
	isShadingDither = $state(false);

	// Active Tool & Construction
	activeTool = $state<
		| 'BRUSH'
		| 'ERASER'
		| 'RECT_SELECT'
		| 'LASSO_SELECT'
		| 'POLY_SELECT'
		| 'RECTANGLE'
		| 'ELLIPSE'
		| 'POLYGON'
		| 'MAGIC_WAND'
	>('BRUSH');
	shapeAnchor = $state<{ x: number; y: number } | null>(null);
	polygonSides = $state(3);
	polygonIndentation = $state(0);

	// Smoothing & Stabilization
	stabilization = $state(50);

	// Audio Levels
	bgmVolume = $state(0.5);
	sfxVolume = $state(0.5);

	// Timeline & Frame Overlays
	isKineticMode = $state(false);
	showGhostLayers = $state(false);
	timelineZoom = $state(1);
	isTimelineMinimized = $state(false);
	isTimelineMaximized = $state(false);

	// Session Tracking
	sessionStartTime = Date.now();
	usageMinutes = $state(0);
	usageSeconds = $state(0);

	// Underlay (Wave II)
	underlayImage = $state<string | null>(null);
	isUnderlayVisible = $state(true);
	underlayOpacity = $state(0.2);
	underlayOffset = $state({ x: 0, y: 0 });
	underlayScale = $state(1.0);

	// Pattern Brush (Wave III)
	isPatternBrushActive = $state(false);
	patternBrushData = $state<{
		width: number;
		height: number;
		data: Uint32Array;
	} | null>(null);

	// Tab States
	projectActiveTab = $state<'frames' | 'layers'>('layers');

	// Overlay Flags
	showColorPicker = $state(false);
	showAudioSettings = $state(false);
	showCommandPalette = $state(false);
	showShortcuts = $state(false);
	showManual = $state(false);
	showExportMenu = $state(false);
	showPaletteLibrary = $state(false);
	showCanvasSettings = $state(false);
	showPersistenceMenu = $state(false);
	showUnderlayMenu = $state(false);
	showGoTo = $state(false);
	showPourBasin = $state(false);
	showMinimap = $state(true);
	showErrorDialog = $state(false);
	showRecoveryPrompt = $state(false);

	// Toast System
	toastMessage = $state('');
	showToast = $state(false);
	private toastTimer: any = null;

	// Error & Context
	lastError = $state<{
		title: string;
		message: string;
		technical?: string;
		timestamp: Date;
	} | null>(null);

	contextMenu = $state<{
		x: number;
		y: number;
		items: Array<{
			label: string;
			icon?: string;
			action: () => void;
			danger?: boolean;
			disabled?: boolean;
		}>;
	} | null>(null);

	// Environment Settings
	backgroundColor = $state('#fdf6e3');

	// Export State
	exportScale = $state(10);
	exportBgColor = $state<string | 'transparent'>('transparent');
	exportFrameSelection = $state<'ACTIVE' | 'VISIBLE' | 'SELECTED' | 'ALL' | 'SELECTED_LAYERS'>(
		'ACTIVE'
	);
	exportProgress = $state(0);
	includePixelBorders = $state(false);

	// Private Orchestration
	private escapeStack: (() => void)[] = [];
	private _overlayStack = $state<string[]>([]);
	private _managedOverlays = overlaysData.managed;

	constructor() {
		// Initialize theme from persistence or preference
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('rupa_theme');
			if (savedTheme === 'dark' || savedTheme === 'light') {
				this.theme = savedTheme;
			} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.theme = 'dark';
			}
		}

		// Usage Heartbeat
		setInterval(() => {
			const elapsed = Date.now() - this.sessionStartTime;
			this.usageMinutes = Math.floor(elapsed / 60000);
			this.usageSeconds = Math.floor(elapsed / 1000);
		}, 1000);
	}

	mount() {
		// Sync Theme Attribute to Document
		$effect(() => {
			if (typeof document !== 'undefined') {
				document.documentElement.setAttribute('data-theme', this.theme);
			}
		});

		// Manage Overlay Stack for Escape handling
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

	// Actions
	show(message: string) {
		this.toastMessage = message;
		this.showToast = true;
		if (this.toastTimer) clearTimeout(this.toastTimer);
		this.toastTimer = setTimeout(() => {
			this.showToast = false;
		}, 2000);
	}

	reportError(title: string, message: string, technical?: string) {
		this.lastError = { title, message, technical, timestamp: new Date() };
		this.showErrorDialog = true;
	}

	toggleTheme() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('rupa_theme', this.theme);
		}
	}

	setZoom(delta: number) {
		const newZoom = this.zoomLevel + delta;
		this.zoomLevel = Math.max(0.1, Math.min(10, Number(newZoom.toFixed(1))));
	}

	resetZoom() {
		this.zoomLevel = 1;
	}

	resetPan() {
		this.panOffset = { x: 0, y: 0 };
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

	// Derived Props
	sessionTimeLabel = $derived.by(() => {
		const totalSeconds = this.usageSeconds;
		const h = Math.floor(totalSeconds / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = totalSeconds % 60;
		return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	});
}
