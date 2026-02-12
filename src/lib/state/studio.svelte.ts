/**
 * StudioState: Manages the environment, UI flags, and viewport.
 */
export class StudioState {
    zoomLevel = $state(1);
    isMuted = $state(false);
    isAppReady = $state(false);
    isPicking = $state(false);

    // Overlay Flags
    showDyeBasin = $state(false);
    showPatternCatalog = $state(false);
    showArtisanGuide = $state(false);
    showArtifactCrate = $state(false);
    showLinenSettings = $state(false);
    showArchivePattern = $state(false);
    showGoTo = $state(false);

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
