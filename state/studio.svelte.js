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
    isTimelineMinimized = $state(false);
    isTimelineMaximized = $state(false);
    // Master Etching (v0.8.0)
    brushSize = $state(1); // 1 to 100
    brushShape = $state('SQUARE');
    symmetryMode = $state('OFF');
    isTilingEnabled = $state(false);
    isAlphaLocked = $state(false);
    isColorLocked = $state(false);
    isPixelPerfect = $state(false);
    colorLockSource = $state(null);
    // The Mist (v0.8.0 Airbrush)
    isAirbrushActive = $state(false);
    airbrushDensity = $state(0.2); // 0.0 to 1.0 (Mist Thickness)
    activeTool = $state('BRUSH');
    shapeAnchor = $state(null);
    polygonSides = $state(3); // 3 to 12
    polygonIndentation = $state(0); // 0 to 100 (percentage)
    // Gradient (Wave III)
    gradientStartColor = $state(null);
    gradientEndColor = $state(null);
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
    showPourBasin = $state(false);
    showMinimap = $state(true);
    // Underlay (Wave II)
    underlayImage = $state(null);
    isUnderlayVisible = $state(true);
    underlayOpacity = $state(0.2);
    underlayOffset = $state({ x: 0, y: 0 });
    underlayScale = $state(1.0);
    // Panning & Navigation (v0.9.0)
    panOffset = $state({ x: 0, y: 0 });
    isHandToolActive = $state(false);
    isTransforming = $state(false);
    // Shading & Toning (v0.8.0 Mouse Support)
    isShadingLighten = $state(false);
    isShadingDarken = $state(false);
    isShadingDither = $state(false);
    // Pattern Brush (Wave III)
    isPatternBrushActive = $state(false);
    patternBrushData = $state(null);
    // Tab States
    projectActiveTab = $state('layers');
    // HUD Feedback (Toasts)
    toastMessage = $state('');
    showToast = $state(false);
    toastTimer = null;
    contextMenu = $state(null);
    show(message) {
        this.toastMessage = message;
        this.showToast = true;
        if (this.toastTimer)
            clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            this.showToast = false;
        }, 2000);
    }
    // Environment Settings
    backgroundColor = $state('#eee8d5');
    // Export Settings
    exportScale = $state(10);
    exportBgColor = $state('transparent');
    includePixelBorders = $state(false);
    escapeStack = [];
    _overlayStack = $state([]);
    _managedOverlays = overlaysData.managed;
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
                const isActive = this[flag];
                if (isActive) {
                    if (!untrack(() => this._overlayStack.includes(flag))) {
                        this._overlayStack = [...untrack(() => this._overlayStack), flag];
                    }
                }
                else {
                    if (untrack(() => this._overlayStack.includes(flag))) {
                        this._overlayStack = untrack(() => this._overlayStack.filter((f) => f !== flag));
                    }
                }
            }
        });
    }
    setZoom(delta) {
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
    pushEscapeAction(fn) {
        this.escapeStack.push(fn);
    }
    popEscapeAction(fn) {
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
            this[lastOverlay] = false;
            return true;
        }
        return false;
    }
}
