export interface HistoryAction {
	index: number;
	oldColor: string;
	newColor: string;
}

export type HistoryEntry = HistoryAction | HistoryAction[];

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

	push(action: HistoryAction) {
		// Only push if colors actually changed
		if (action.oldColor === action.newColor) return;

		if (this.currentBatch) {
			this.currentBatch.push(action);
		} else {
			this.undoStack.push(action);
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
