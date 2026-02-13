import { LinenState } from './linen.svelte.js';
import { NeedleState } from './needle.svelte.js';
import { PaletteState } from './palette.svelte.js';
import { StudioState } from './studio.svelte.js';
import { ProjectState } from './project.svelte.js';
import { SelectionState } from './selection.svelte.js';
import { history } from '../engine/history.js';
import { sfx } from '../engine/audio.js';
import { shuttle } from '../engine/shuttle.js';

/**
 * The AtelierState: The root orchestrator of the artisan's studio.
 * It delegates concerns to specialized sub-states.
 */
export class AtelierState {
	readonly version = __APP_VERSION__;

	// Sub-states (Initialization Order Matters!)
	project = new ProjectState(); // Folio must exist first
	linen = new LinenState(this.project); // Linen is now a proxy to the active Frame/Veil
	needle = new NeedleState();
	paletteState = new PaletteState();
	studio = new StudioState();
	selection = new SelectionState();

	// --- Legacy Compatibility Proxies (Read-only or Passthrough) ---

	get stitches() {
		return this.linen.stitches;
	}
	set stitches(v) {
		this.linen.stitches = v;
	}

	get linenWidth() {
		return this.linen.width;
	}
	set linenWidth(v) {
		this.linen.width = v;
	}

	get linenHeight() {
		return this.linen.height;
	}
	set linenHeight(v) {
		this.linen.height = v;
	}

	get needlePos() {
		return this.needle.pos;
	}
	set needlePos(v) {
		this.needle.pos = v;
	}

	get activeDye() {
		return this.paletteState.activeDye;
	}
	set activeDye(v) {
		this.paletteState.activeDye = v;
	}

	get palette() {
		return this.paletteState.swatches;
	}
	set palette(v) {
		this.paletteState.swatches = v;
	}

	get zoomLevel() {
		return this.studio.zoomLevel;
	}
	set zoomLevel(v) {
		this.studio.zoomLevel = v;
	}

	get isMuted() {
		return this.studio.isMuted;
	}
	set isMuted(v) {
		this.studio.isMuted = v;
	}

	get isAmbientPlaying() {
		return this.studio.isAmbientPlaying;
	}
	set isAmbientPlaying(v) {
		this.studio.isAmbientPlaying = v;
	}

	get isKineticMode() {
		return this.studio.isKineticMode;
	}
	set isKineticMode(v) {
		this.studio.isKineticMode = v;
	}

	get showGhostThreads() {
		return this.studio.showGhostThreads;
	}
	set showGhostThreads(v) {
		this.studio.showGhostThreads = v;
	}

	get bgmVolume() {
		return this.studio.bgmVolume;
	}
	set bgmVolume(v) {
		this.studio.bgmVolume = v;
	}

	get sfxVolume() {
		return this.studio.sfxVolume;
	}
	set sfxVolume(v) {
		this.studio.sfxVolume = v;
	}

	get usageMinutes() {
		return this.studio.usageMinutes;
	}

	constructor() {
		// Start Usage Heartbeat
		setInterval(() => {
			const elapsed = Date.now() - this.studio.sessionStartTime;
			this.studio.usageMinutes = Math.floor(elapsed / 60000);
			this.studio.usageSeconds = Math.floor(elapsed / 1000);
		}, 1000); // 1s precision for the working timer
	}

	get isPicking() {
		return this.studio.isPicking;
	}
	set isPicking(v) {
		this.studio.isPicking = v;
	}

	get isAppReady() {
		return this.studio.isAppReady;
	}
	set isAppReady(v) {
		this.studio.isAppReady = v;
	}

	get isNeedleVisible() {
		return this.needle.isVisible;
	}
	set isNeedleVisible(v) {
		this.needle.isVisible = v;
	}

	get projectName() {
		return this.project.name;
	}
	set projectName(v) {
		this.project.name = v;
	}

	get currentFilePath() {
		return this.project.currentFilePath;
	}
	set currentFilePath(v) {
		this.project.currentFilePath = v;
	}

	get lastSaved() {
		return this.project.lastSaved;
	}
	set lastSaved(v) {
		this.project.lastSaved = v;
	}

	get clipboard() {
		return this.project.clipboard;
	}
	set clipboard(v) {
		this.project.clipboard = v;
	}

	get showDyeBasin() {
		return this.studio.showDyeBasin;
	}
	set showDyeBasin(v) {
		this.studio.showDyeBasin = v;
	}

	get showAudioBasin() {
		return this.studio.showAudioBasin;
	}
	set showAudioBasin(v) {
		this.studio.showAudioBasin = v;
	}

	get showPatternCatalog() {
		return this.studio.showPatternCatalog;
	}
	set showPatternCatalog(v) {
		this.studio.showPatternCatalog = v;
	}

	get showArtisanGuide() {
		return this.studio.showArtisanGuide;
	}
	set showArtisanGuide(v) {
		this.studio.showArtisanGuide = v;
	}

	get showArtisanCodex() {
		return this.studio.showArtisanCodex;
	}
	set showArtisanCodex(v) {
		this.studio.showArtisanCodex = v;
	}

	get showArtifactCrate() {
		return this.studio.showArtifactCrate;
	}
	set showArtifactCrate(v) {
		this.studio.showArtifactCrate = v;
	}

	get showLinenSettings() {
		return this.studio.showLinenSettings;
	}
	set showLinenSettings(v) {
		this.studio.showLinenSettings = v;
	}

	get showArchivePattern() {
		return this.studio.showArchivePattern;
	}
	set showArchivePattern(v) {
		this.studio.showArchivePattern = v;
	}

	get showGoTo() {
		return this.studio.showGoTo;
	}
	set showGoTo(v) {
		this.studio.showGoTo = v;
	}

	get exportScale() {
		return this.studio.exportScale;
	}
	set exportScale(v) {
		this.studio.exportScale = v;
	}

	get exportBgColor() {
		return this.studio.exportBgColor;
	}
	set exportBgColor(v) {
		this.studio.exportBgColor = v;
	}

	get selectionStart() {
		return this.selection.start;
	}
	set selectionStart(v) {
		this.selection.start = v;
	}

	get selectionEnd() {
		return this.selection.end;
	}
	set selectionEnd(v) {
		this.selection.end = v;
	}

	// --- Derived Projections ---

	usedColors = $derived.by(() => {
		const colors = new Set<string>();
		this.linen.compositeStitches.forEach((color) => {
			if (color !== null) colors.add(color);
		});
		return Array.from(colors);
	});

	displayCoords = $derived.by(() => {
		const calc = (pos: number, size: number) => {
			const mid = Math.floor(size / 2);
			return size % 2 === 0 ? (pos < mid ? pos - mid : pos - mid + 1) : pos - mid;
		};
		return {
			x: calc(this.needle.pos.x, this.linen.width),
			y: -calc(this.needle.pos.y, this.linen.height)
		};
	});

	cameraTransform = $derived.by(() => {
		const effectiveZoom = this.studio.zoomLevel * 0.5;

		// Overview Mode (100% zoom or less)
		if (this.studio.zoomLevel <= 1) {
			return `translate(-50%, -50%) scale(${effectiveZoom})`;
		}

		// Focused Mode (Follow Needle)
		// We calculate the percentage position of the needle within the linen
		const xPct = ((this.needle.pos.x + 0.5) / this.linen.width) * 100;
		const yPct = ((this.needle.pos.y + 0.5) / this.linen.height) * 100;

		// By translating by negative xPct/yPct, we move that specific point to the
		// origin (which we will set to the center of the viewport).
		return `translate(-${xPct}%, -${yPct}%) scale(${effectiveZoom})`;
	});

	// --- Passthrough Methods ---

	resetInactivityTimer() {
		this.needle.resetInactivityTimer();
	}
	toggleMute() {
		this.studio.toggleMute();
	}
	setZoom(delta: number) {
		this.studio.setZoom(delta);
	}
	resetZoom() {
		this.studio.resetZoom();
	}
	selectPalette(index: number) {
		this.paletteState.select(index);
	}
	pushEscapeAction(fn: () => void) {
		this.studio.pushEscapeAction(fn);
	}
	popEscapeAction(fn: () => void) {
		this.studio.popEscapeAction(fn);
	}
	handleEscape() {
		return this.studio.handleEscape();
	}

	undo() {
		const entry = history.undo();
		if (entry) {
			if ('isStructural' in entry) {
				entry.undo();
				sfx.playUnstitch();
			} else if (Array.isArray(entry)) {
				// Revert in reverse order
				for (let i = entry.length - 1; i >= 0; i--) {
					const action = entry[i];
					this.linen.stitches[action.index] = action.oldColor;
				}
				sfx.playUnstitch();
			} else {
				this.linen.stitches[entry.index] = entry.oldColor;
				sfx.playUnstitch();
			}
		}
		this.needle.resetInactivityTimer();
	}

	redo() {
		const entry = history.redo();
		if (entry) {
			if ('isStructural' in entry) {
				entry.redo();
				sfx.playStitch();
			} else if (Array.isArray(entry)) {
				for (const action of entry) {
					this.linen.stitches[action.index] = action.newColor;
				}
				sfx.playStitch();
			} else {
				this.linen.stitches[entry.index] = entry.newColor;
				sfx.playStitch();
			}
		}
		this.needle.resetInactivityTimer();
	}

	// New delegates for components using atelier instance directly
	clearLinen() {
		shuttle.clearLinen();
	}
	pickDye() {
		shuttle.pickDye();
	}
	loadProject() {
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
	flipLinen(axis: 'horizontal' | 'vertical') {
		shuttle.flipLinen(axis);
	}
	rotateLinen() {
		shuttle.rotateLinen();
	}
}

export const atelier = new AtelierState();
