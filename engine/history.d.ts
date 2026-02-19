export interface HistoryAction {
    index: number;
    oldColor: string | null;
    newColor: string | null;
}
export interface StructuralAction {
    isStructural: true;
    label: string;
    undo: () => void;
    redo: () => void;
}
export type HistoryEntry = HistoryAction | HistoryAction[] | StructuralAction;
export declare class HistoryManager {
    private undoStack;
    private redoStack;
    private maxHistory;
    private currentBatch;
    beginBatch(): void;
    endBatch(): void;
    push(entry: HistoryEntry): void;
    undo(): HistoryEntry | null;
    redo(): HistoryEntry | null;
    canUndo(): boolean;
    canRedo(): boolean;
    clear(): void;
}
export declare const history: HistoryManager;
