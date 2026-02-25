export interface HistoryBatch {
	isBatch: true;
	indices: Uint32Array;
	oldColors: Uint32Array;
	newColors: Uint32Array;
	byteSize: number;
}

export interface StructuralAction {
	isStructural: true;
	label: string;
	undo: () => void;
	redo: () => void;
	byteSize: number;
}

export type HistoryEntry = HistoryBatch | StructuralAction;

/**
 * HistoryManager: Binary-optimized history controller with memory-aware pruning.
 * Ensures the application remains stable on systems with limited RAM.
 */
export class HistoryManager {
	private undoStack: HistoryEntry[] = [];
	private redoStack: HistoryEntry[] = [];

	// Memory management (v0.9.3)
	private totalByteSize = 0;
	private readonly MAX_MEMORY_BYTES = 200 * 1024 * 1024; // 200MB limit

	// Accumulator for beginBatch/endBatch
	private currentBatchIndices: number[] = [];
	private currentBatchOldColors: number[] = [];
	private currentBatchNewColors: number[] = [];
	private inBatch = false;

	beginBatch() {
		this.inBatch = true;
		this.currentBatchIndices = [];
		this.currentBatchOldColors = [];
		this.currentBatchNewColors = [];
	}

	endBatch() {
		this.inBatch = false;
		if (this.currentBatchIndices.length > 0) {
			this.pushBatch(
				new Uint32Array(this.currentBatchIndices),
				new Uint32Array(this.currentBatchOldColors),
				new Uint32Array(this.currentBatchNewColors)
			);
		}
		this.clearBatch();
	}

	clearBatch() {
		this.inBatch = false;
		this.currentBatchIndices = [];
		this.currentBatchOldColors = [];
		this.currentBatchNewColors = [];
	}

	pushPixel(index: number, oldColor: number, newColor: number) {
		if (oldColor === newColor) return;
		if (this.inBatch) {
			this.currentBatchIndices.push(index);
			this.currentBatchOldColors.push(oldColor);
			this.currentBatchNewColors.push(newColor);
		} else {
			this.pushBatch(
				new Uint32Array([index]),
				new Uint32Array([oldColor]),
				new Uint32Array([newColor])
			);
		}
	}

	pushBatch(indices: Uint32Array, oldColors: Uint32Array, newColors: Uint32Array) {
		if (indices.length === 0) return;

		// Calculate byte size: (Index + Old + New) * 4 bytes
		const entryByteSize = indices.byteLength + oldColors.byteLength + newColors.byteLength;

		this.addEntry({
			isBatch: true,
			indices,
			oldColors,
			newColors,
			byteSize: entryByteSize
		});
	}

	push(action: Omit<StructuralAction, 'byteSize'>) {
		// Structural actions (like add layer) have negligible memory cost
		this.addEntry({ ...action, byteSize: 1024 } as StructuralAction);
	}

	private addEntry(entry: HistoryEntry) {
		this.undoStack.push(entry);
		this.totalByteSize += entry.byteSize;
		this.redoStack = [];

		// Prune if memory limit exceeded
		while (this.totalByteSize > this.MAX_MEMORY_BYTES && this.undoStack.length > 1) {
			const oldest = this.undoStack.shift();
			if (oldest) this.totalByteSize -= oldest.byteSize;
		}
	}

	undo(): HistoryEntry | null {
		const entry = this.undoStack.pop();
		if (entry) {
			this.redoStack.push(entry);
			// We keep the byte size in total for simplicity or we could manage redo size separately.
			// To be safe, we subtract it as it's no longer in the primary undo path.
			this.totalByteSize -= entry.byteSize;
			return entry;
		}
		return null;
	}

	redo(): HistoryEntry | null {
		const entry = this.redoStack.pop();
		if (entry) {
			this.undoStack.push(entry);
			this.totalByteSize += entry.byteSize;
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
		this.currentBatchIndices = [];
		this.currentBatchOldColors = [];
		this.currentBatchNewColors = [];
		this.totalByteSize = 0;
		this.inBatch = false;
	}

	get usageLabel() {
		return (this.totalByteSize / (1024 * 1024)).toFixed(1) + ' MB';
	}
}

export const history = new HistoryManager();
