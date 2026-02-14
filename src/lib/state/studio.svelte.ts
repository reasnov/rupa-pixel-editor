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

	// Smoothing & Stabilization (0 to 100)
	stabilization = $state(50);

	// Audio Levels (0.0 to 1.0)
	bgmVolume = $state(0.5);
	sfxVolume = $state(0.5);

	// Kinetic Settings
	fps = $state(10); // Default 10 FPS
	isKineticMode = $state(false);
	showGhostThreads = $state(false);
	timelineZoom = $state(1); // 1x = 0.25px/ms, 2x = 0.5px/ms, etc.

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

	// Overlay Flags
	showDyeBasin = $state(false);
	showAudioBasin = $state(false);
	showPatternCatalog = $state(false);
	showArtisanGuide = $state(false);
	showArtisanCodex = $state(false);
	showArtifactCrate = $state(false);
	showLinenSettings = $state(false);
	showArchivePattern = $state(false);
	showGoTo = $state(false);

	// Tab States
	folioActiveTab = $state<'frames' | 'veils'>('veils');

	// Environment Settings
	canvasBgColor = $state('#eee8d5'); // Studio Cream (Default)

	// Export Settings
	exportScale = $state(10);
	exportBgColor = $state<string | 'transparent'>('transparent');

	private escapeStack: (() => void)[] = [];
	private _overlayStack = $state<string[]>([]);

	// The registry of all global overlay flags that should be handled by ESC automatically
	// Data-Driven: Loaded from src/lib/config/overlays.json
	private _managedOverlays = overlaysData.managed;

	constructor() {
		// Initialize session heartbeat
		setInterval(() => {
			const elapsed = Date.now() - this.sessionStartTime;
			this.usageMinutes = Math.floor(elapsed / 60000);
			this.usageSeconds = Math.floor(elapsed / 1000);
		}, 1000);
	}

	/**
	 * Mount the reactive observers for the studio.
	 * Must be called within a Svelte effect scope (e.g. from a component).
	 */
	mount() {
		// Global Observer: Maintain the stack order based on which flags become true
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
		// 1. Try explicitly registered custom actions first (legacy/local components)
		const lastAction = this.escapeStack.pop();
		if (lastAction) {
			lastAction();
			return true;
		}

		// 2. Global Managed Stack: Close the last opened overlay
		const lastOverlay = this._overlayStack[this._overlayStack.length - 1];
		if (lastOverlay) {
			(this as any)[lastOverlay] = false;
			// The effect will automatically remove it from _overlayStack
			return true;
		}

		return false;
	}
}
