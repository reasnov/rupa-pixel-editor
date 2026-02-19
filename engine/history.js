export class HistoryManager {
    undoStack = [];
    redoStack = [];
    maxHistory = 500;
    currentBatch = null;
    beginBatch() {
        this.currentBatch = [];
    }
    endBatch() {
        if (this.currentBatch && this.currentBatch.length > 0) {
            this.undoStack.push(this.currentBatch);
            this.redoStack = [];
            if (this.undoStack.length > this.maxHistory) {
                this.undoStack.shift();
            }
        }
        this.currentBatch = null;
    }
    push(entry) {
        // Only push if colors actually changed (for standard actions)
        if (!('isStructural' in entry) && !Array.isArray(entry)) {
            if (entry.oldColor === entry.newColor)
                return;
        }
        if (this.currentBatch && !('isStructural' in entry) && !Array.isArray(entry)) {
            this.currentBatch.push(entry);
        }
        else {
            this.undoStack.push(entry);
            this.redoStack = []; // Clear redo on new action
            if (this.undoStack.length > this.maxHistory) {
                this.undoStack.shift();
            }
        }
    }
    undo() {
        const entry = this.undoStack.pop();
        if (entry) {
            this.redoStack.push(entry);
            return entry;
        }
        return null;
    }
    redo() {
        const entry = this.redoStack.pop();
        if (entry) {
            this.undoStack.push(entry);
            return entry;
        }
        return null;
    }
    canUndo() {
        return this.undoStack.length > 0;
    }
    canRedo() {
        return this.redoStack.length > 0;
    }
    clear() {
        this.undoStack = [];
        this.redoStack = [];
        this.currentBatch = null;
    }
}
export const history = new HistoryManager();
