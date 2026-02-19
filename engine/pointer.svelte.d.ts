/**
 * PointerEngine: Manages fluid pointer interactions.
 */
export declare class PointerEngine {
    private isPointerDown;
    isPointerDownActive: boolean;
    private lastPosition;
    private lastScreenPos;
    private buttonType;
    private holdTimer;
    private isSnapped;
    private rafId;
    isSnappedState: boolean;
    mapToGrid(clientX: number, clientY: number, canvasElement: HTMLElement): {
        x: number;
        y: number;
    };
    handleStart(e: PointerEvent, canvasElement: HTMLElement): void;
    handleMove(e: PointerEvent, canvasElement: HTMLElement): void;
    handleEnd(): void;
    cancel(): void;
    private startHoldTimer;
    private resetHoldTimer;
    private clearHoldTimer;
    private triggerSnap;
}
export declare const pointer: PointerEngine;
