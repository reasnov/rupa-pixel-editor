export declare class ManipulationService {
    resize(newWidth: number, newHeight: number): void;
    flip(axis: 'horizontal' | 'vertical'): void;
    rotate(): void;
    clearAll(): void;
    /**
     * Recolor All: Replaces all occurrences of a color with the active one.
     */
    bleach(): void;
}
