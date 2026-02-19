/**
 * CursorState: Manages the professional cursor and its focus.
 */
export declare class CursorState {
    pos: {
        x: number;
        y: number;
    };
    isVisible: boolean;
    private inactivityTimer;
    private readonly INACTIVITY_TIMEOUT;
    resetInactivityTimer(): void;
    setPos(x: number, y: number): void;
}
