import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../audio.js';
import { history } from '../history.js';

export class PersistenceService {
    private serialize() {
        return JSON.stringify({
            version: atelier.version,
            metadata: { 
                name: atelier.project.name, 
                lastModified: new Date().toISOString() 
            },
            dimensions: { 
                width: atelier.linen.width, 
                height: atelier.linen.height 
            },
            palette: atelier.paletteState.swatches,
            pixelData: atelier.linen.stitches
        });
    }

    async save() {
        const data = this.serialize();
        if (typeof window.electronAPI === 'undefined') {
            this.webDownload(data);
            return;
        }

        const res = await window.electronAPI.saveFile(data, atelier.project.currentFilePath || undefined);
        if (res) {
            atelier.project.setMetadata(atelier.project.name, res);
            sfx.playStitch();
        }
    }

    private webDownload(data: string) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${atelier.project.name.toLowerCase().replace(/\s+/g, '-')}.rupa`;
        a.click();
    }

    async load() {
        if (typeof window.electronAPI === 'undefined') {
            this.webUpload();
            return;
        }

        const res = await window.electronAPI.openFile();
        if (res) {
            this.deserialize(res.content);
            atelier.project.setMetadata(atelier.project.name, res.filePath);
            sfx.playStitch();
        }
    }

    private webUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.rupa';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (re) => this.deserialize(re.target?.result as string);
                reader.readAsText(file);
            }
        };
        input.click();
    }

    async backup() {
        const data = this.serialize();
        if (window.electronAPI) {
            await window.electronAPI.autoSave(data);
            atelier.project.lastSaved = new Date();
        } else {
            localStorage.setItem('rupa_auto_backup', data);
        }
    }

    private deserialize(json: string) {
        try {
            const d = JSON.parse(json);
            atelier.linen.reset(d.dimensions.width, d.dimensions.height, d.pixelData);
            atelier.paletteState.swatches = d.palette;
            atelier.project.name = d.metadata.name;
            history.clear();
        } catch (e) {
            console.error('Failed to restore pattern book:', e);
        }
    }
}
