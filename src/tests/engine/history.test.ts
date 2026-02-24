import { describe, it, expect, beforeEach } from 'vitest';
import { HistoryManager } from '../../lib/engine/history.js';

describe('HistoryManager', () => {
	let history: HistoryManager;

	beforeEach(() => {
		history = new HistoryManager();
	});

	it('pushPixel should store data and canUndo should be true', () => {
		history.pushPixel(0, 0xff0000ff, 0xff00ff00);
		expect(history.canUndo()).toBe(true);
		expect(history.canRedo()).toBe(false);
	});

	it('undo/redo should return the correct entry', () => {
		const oldCol = 0xff0000ff;
		const newCol = 0xff00ff00;
		history.pushPixel(5, oldCol, newCol);

		const undoEntry = history.undo();
		expect(undoEntry).toBeDefined();
		if (undoEntry && 'isBatch' in undoEntry) {
			expect(undoEntry.indices[0]).toBe(5);
			expect(undoEntry.oldColors[0]).toBe(oldCol);
		}

		const redoEntry = history.redo();
		expect(redoEntry).toBeDefined();
		if (redoEntry && 'isBatch' in redoEntry) {
			expect(redoEntry.newColors[0]).toBe(newCol);
		}
	});

	it('should handle batches correctly', () => {
		history.beginBatch();
		history.pushPixel(1, 0, 100);
		history.pushPixel(2, 0, 200);
		history.endBatch();

		const entry = history.undo();
		expect(entry).toBeDefined();
		if (entry && 'isBatch' in entry) {
			expect(entry.indices.length).toBe(2);
			expect(entry.newColors).toEqual(new Uint32Array([100, 200]));
		}
	});

	it('should prune history when memory limit is exceeded', () => {
		// Mock a very small limit for testing pruning
		// Access private member via any cast
		(history as any).MAX_MEMORY_BYTES = 100;

		// Each pixel push is (4+4+4) = 12 bytes
		// 10 pushes = 120 bytes
		for (let i = 0; i < 10; i++) {
			history.pushPixel(i, 0, 1);
		}

		// It should have shifted out the oldest entries
		expect((history as any).undoStack.length).toBeLessThan(10);
		expect((history as any).totalByteSize).toBeLessThanOrEqual(100);
	});

	it('clear should reset everything', () => {
		history.pushPixel(0, 1, 2);
		history.clear();
		expect(history.canUndo()).toBe(false);
		expect((history as any).totalByteSize).toBe(0);
	});
});
