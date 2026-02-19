/**
 * CursorState: Manages the professional cursor and its focus.
 */
export class CursorState {
    pos = $state({ x: 0, y: 0 });
    isVisible = $state(true);
    inactivityTimer = null;
    INACTIVITY_TIMEOUT = 20000;
    resetInactivityTimer() {
        this.isVisible = true;
        if (this.inactivityTimer)
            clearTimeout(this.inactivityTimer);
        this.inactivityTimer = setTimeout(() => {
            this.isVisible = false;
        }, this.INACTIVITY_TIMEOUT);
    }
    setPos(x, y) {
        this.pos = { x, y };
        this.resetInactivityTimer();
    }
}
