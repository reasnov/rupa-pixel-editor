/**
 * Storage Logic: Pure indexedDB wrapper for industrial-scale project persistence.
 */
export class StorageLogic {
	private static DB_NAME = 'rupa_sanctuary_db';
	private static DB_VERSION = 1;
	private static STORE_PROJECTS = 'projects';
	private static STORE_PRESETS = 'palette_presets';

	private static db: IDBDatabase | null = null;

	private static async getDB(): Promise<IDBDatabase> {
		if (this.db) return this.db;

		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

			request.onupgradeneeded = (e) => {
				const db = (e.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(this.STORE_PROJECTS)) {
					db.createObjectStore(this.STORE_PROJECTS, { keyPath: 'id' });
				}
				if (!db.objectStoreNames.contains(this.STORE_PRESETS)) {
					db.createObjectStore(this.STORE_PRESETS, { keyPath: 'id' });
				}
			};

			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};

			request.onerror = () => reject(request.error);
		});
	}

	static async saveProject(id: string, data: string): Promise<void> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(this.STORE_PROJECTS, 'readwrite');
			const store = transaction.objectStore(this.STORE_PROJECTS);
			const request = store.put({ id, content: data, timestamp: Date.now() });

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	static async loadProject(id: string): Promise<string | null> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(this.STORE_PROJECTS, 'readonly');
			const store = transaction.objectStore(this.STORE_PROJECTS);
			const request = store.get(id);

			request.onsuccess = () => resolve(request.result?.content || null);
			request.onerror = () => reject(request.error);
		});
	}

	static async savePresets(presets: any[]): Promise<void> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(this.STORE_PRESETS, 'readwrite');
			const store = transaction.objectStore(this.STORE_PRESETS);
			// For simplicity, we store presets as a single entry with id 'global'
			const request = store.put({ id: 'global_library', data: presets, timestamp: Date.now() });

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	static async loadPresets(): Promise<any[] | null> {
		const db = await this.getDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(this.STORE_PRESETS, 'readonly');
			const store = transaction.objectStore(this.STORE_PRESETS);
			const request = store.get('global_library');

			request.onsuccess = () => resolve(request.result?.data || null);
			request.onerror = () => reject(request.error);
		});
	}
}
