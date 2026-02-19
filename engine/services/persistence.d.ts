export declare class PersistenceService {
    private serialize;
    save(): Promise<void>;
    private webDownload;
    load(): Promise<void>;
    private webUpload;
    backup(): Promise<void>;
    /**
     * Autosave to browser storage (LocalStorage).
     */
    autoSaveSession(): void;
    /**
     * Check and restore the last autosaved session if it exists.
     */
    restoreLastSession(): boolean;
    private deserialize;
}
