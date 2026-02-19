/**
 * DrawService: Manages the lifecycle of digital drawing and painting.
 */
export declare class DrawService {
    draw(tx?: number, ty?: number): void;
    erase(tx?: number, ty?: number): void;
    private getEffectColorForPoint;
    beginStroke(x: number, y: number): void;
    continueStroke(x: number, y: number, lastX: number, lastY: number): void;
    endStroke(): void;
    cancelStroke(): void;
    snapCurrentStroke(): void;
    private commitBuffer;
    commitShape(): void;
}
