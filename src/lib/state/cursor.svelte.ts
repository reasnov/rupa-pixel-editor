/**
 * CursorState: Manages the professional cursor and its focus.
 */
export class CursorState {
	pos = $state({ x: 0, y: 0 });
	isVisible = $state(true);

	private inactivityTimer: any = null;
	private readonly INACTIVITY_TIMEOUT = 20000;

	resetInactivityTimer() {
		this.isVisible = true;
		if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
		this.inactivityTimer = setTimeout(() => {
			this.isVisible = false;
		}, this.INACTIVITY_TIMEOUT);
	}

	setPos(x: number, y: number) {
		this.pos = { x, y };
		this.resetInactivityTimer();
	}
}
