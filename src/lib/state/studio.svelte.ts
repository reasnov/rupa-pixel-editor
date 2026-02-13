/**
 * StudioState: Manages the environment, UI flags, and viewport.
 */
export class StudioState {
	zoomLevel = $state(1);
	isMuted = $state(false);
	isAmbientPlaying = $state(true);
	isAppReady = $state(false);
	isPicking = $state(false);

	// Audio Levels (0.0 to 1.0)
	bgmVolume = $state(0.5);
	sfxVolume = $state(0.5);

	// Kinetic Settings
	fps = $state(10); // Default 10 FPS
	isKineticMode = $state(false);
	showGhostThreads = $state(false);

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

	setZoom(delta: number) {
		const newZoom = this.zoomLevel + delta;
		this.zoomLevel = Math.max(0.5, Math.min(5, Number(newZoom.toFixed(1))));
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
		return false;
	}
}
