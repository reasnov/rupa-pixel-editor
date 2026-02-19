/**
 * StudioState: Manages the environment, UI flags, and viewport.
 */
export declare class StudioState {
    zoomLevel: number;
    isMuted: boolean;
    isAmbientPlaying: boolean;
    isAppReady: boolean;
    isPicking: boolean;
    isTimelineMinimized: boolean;
    isTimelineMaximized: boolean;
    brushSize: number;
    brushShape: "SQUARE" | "CIRCLE";
    symmetryMode: "OFF" | "HORIZONTAL" | "VERTICAL" | "QUADRANT";
    isTilingEnabled: boolean;
    isAlphaLocked: boolean;
    isColorLocked: boolean;
    isPixelPerfect: boolean;
    colorLockSource: string | null;
    isAirbrushActive: boolean;
    airbrushDensity: number;
    activeTool: "BRUSH" | "ERASER" | "SELECT" | "RECTANGLE" | "ELLIPSE" | "POLYGON" | "GRADIENT";
    shapeAnchor: {
        x: number;
        y: number;
    } | null;
    polygonSides: number;
    polygonIndentation: number;
    gradientStartColor: string | null;
    gradientEndColor: string | null;
    stabilization: number;
    bgmVolume: number;
    sfxVolume: number;
    fps: number;
    isKineticMode: boolean;
    showGhostLayers: boolean;
    timelineZoom: number;
    sessionStartTime: number;
    usageMinutes: number;
    usageSeconds: number;
    sessionTimeLabel: string;
    showColorPicker: boolean;
    showAudioSettings: boolean;
    showCommandPalette: boolean;
    showGuideMenu: boolean;
    showGuideBook: boolean;
    showExportMenu: boolean;
    showCanvasSettings: boolean;
    showPersistenceMenu: boolean;
    showUnderlayMenu: boolean;
    showGoTo: boolean;
    showPourBasin: boolean;
    showMinimap: boolean;
    underlayImage: string | null;
    isUnderlayVisible: boolean;
    underlayOpacity: number;
    underlayOffset: {
        x: number;
        y: number;
    };
    underlayScale: number;
    panOffset: {
        x: number;
        y: number;
    };
    isHandToolActive: boolean;
    isTransforming: boolean;
    isShadingLighten: boolean;
    isShadingDarken: boolean;
    isShadingDither: boolean;
    isPatternBrushActive: boolean;
    patternBrushData: {
        width: number;
        height: number;
        data: Uint32Array;
    } | null;
    projectActiveTab: "frames" | "layers";
    toastMessage: string;
    showToast: boolean;
    private toastTimer;
    contextMenu: {
        x: number;
        y: number;
        items: Array<{
            label: string;
            icon?: string;
            action: () => void;
            danger?: boolean;
            disabled?: boolean;
        }>;
    } | null;
    show(message: string): void;
    backgroundColor: string;
    exportScale: number;
    exportBgColor: string;
    includePixelBorders: boolean;
    private escapeStack;
    private _overlayStack;
    private _managedOverlays;
    constructor();
    mount(): void;
    setZoom(delta: number): void;
    resetZoom(): void;
    resetPan(): void;
    toggleMute(): void;
    pushEscapeAction(fn: () => void): void;
    popEscapeAction(fn: () => void): void;
    handleEscape(): boolean;
}
