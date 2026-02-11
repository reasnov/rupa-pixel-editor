export interface HistoryAction {
	index: number;
	oldColor: string;
	newColor: string;
}

export class HistoryManager {
	private undoStack: HistoryAction[] = [];
	private redoStack: HistoryAction[] = [];
	private maxHistory = 500;

	push(action: HistoryAction) {
		// Only push if colors actually changed
		if (action.oldColor === action.newColor) return;

		this.undoStack.push(action);
		this.redoStack = []; // Clear redo on new action

		if (this.undoStack.length > this.maxHistory) {
			this.undoStack.shift();
		}
	}

	undo(): HistoryAction | null {
		const action = this.undoStack.pop();
		if (action) {
			this.redoStack.push(action);
			return action;
		}
		return null;
	}

	redo(): HistoryAction | null {
		const action = this.redoStack.pop();
		if (action) {
			this.undoStack.push(action);
			return action;
		}
		return null;
	}

	canUndo() {
		return this.undoStack.length > 0;
	}
	canRedo() {
		return this.redoStack.length > 0;
	}
}

export const history = new HistoryManager();
