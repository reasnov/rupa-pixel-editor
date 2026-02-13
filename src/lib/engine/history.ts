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

export class HistoryManager {
	private undoStack: HistoryEntry[] = [];
	private redoStack: HistoryEntry[] = [];
	private maxHistory = 500;

	private currentBatch: HistoryAction[] | null = null;

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

	push(entry: HistoryEntry) {
		// Only push if colors actually changed (for standard actions)
		if (!('isStructural' in entry) && !Array.isArray(entry)) {
			if (entry.oldColor === entry.newColor) return;
		}

		if (this.currentBatch && !('isStructural' in entry) && !Array.isArray(entry)) {
			this.currentBatch.push(entry);
		} else {
			this.undoStack.push(entry);
			this.redoStack = []; // Clear redo on new action

			if (this.undoStack.length > this.maxHistory) {
				this.undoStack.shift();
			}
		}
	}

	undo(): HistoryEntry | null {
		const entry = this.undoStack.pop();
		if (entry) {
			this.redoStack.push(entry);
			return entry;
		}
		return null;
	}

	redo(): HistoryEntry | null {
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
