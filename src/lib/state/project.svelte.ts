import { type ColorHex } from '../types/index.js';

/**
 * ProjectState: Manages metadata and clipboard data.
 */
export class ProjectState {
    name = $state('Untitled Stitch');
    currentFilePath = $state<string | null>(null);
    lastSaved = $state<Date | null>(null);
    
    clipboard = $state<{ width: number; height: number; data: ColorHex[] } | null>(null);

    setMetadata(name: string, path: string | null = null) {
        this.name = name;
        this.currentFilePath = path;
        this.lastSaved = new Date();
    }
}
