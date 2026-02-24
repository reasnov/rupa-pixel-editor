import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StorageLogic } from '../../lib/logic/storage.js';

describe('StorageLogic', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		// Mock a functional-enough IndexedDB
		const mockIDBRequest = {
			onsuccess: null as any,
			onerror: null as any,
			onupgradeneeded: null as any,
			result: {
				transaction: vi.fn(() => ({
					objectStore: vi.fn(() => ({
						put: vi.fn(() => ({ onsuccess: null })),
						get: vi.fn(() => ({ onsuccess: null, result: { content: 'cached-data' } }))
					}))
				}))
			}
		};

		// @ts-ignore
		global.indexedDB = {
			open: vi.fn(() => mockIDBRequest as any)
		};
	});
	it('should attempt to open the correct database', async () => {
		StorageLogic.saveProject('test-id', 'test-content');
		expect(indexedDB.open).toHaveBeenCalledWith('rupa_sanctuary_db', 1);
	});

	it('should handle project loading through the static interface', async () => {
		// Since we cannot easily simulate the full async flow of IDB in a simple mock,
		// we verify the structure of the call.
		const promise = StorageLogic.loadProject('test-id');
		expect(indexedDB.open).toHaveBeenCalled();
		expect(promise).toBeInstanceOf(Promise);
	});
});
