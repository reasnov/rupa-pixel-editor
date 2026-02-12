import { atelier } from '../state/atelier.svelte';
import { sfx } from './audio';
import { history } from './history';

export class ShuttleEngine {
    
    moveNeedle(dx: number, dy: number) {
        const newX = Math.max(0, Math.min(atelier.linenWidth - 1, atelier.needlePos.x + dx));
        const newY = Math.max(0, Math.min(atelier.linenHeight - 1, atelier.needlePos.y + dy));

        if (newX !== atelier.needlePos.x || newY !== atelier.needlePos.y) {
            atelier.needlePos = { x: newX, y: newY };
            sfx.playMove();
            return true;
        }
        return false;
    }

    stitch() {
        const index = atelier.needlePos.y * atelier.linenWidth + atelier.needlePos.x;
        const oldColor = atelier.stitches[index];
        if (oldColor !== atelier.activeDye) {
            history.push({ index, oldColor, newColor: atelier.activeDye });
            atelier.stitches[index] = atelier.activeDye;
            sfx.playStitch();
        }
    }

    unstitch() {
        const index = atelier.needlePos.y * atelier.linenWidth + atelier.needlePos.x;
        const oldColor = atelier.stitches[index];
        const emptyColor = '#eee8d5';
        if (oldColor !== emptyColor) {
            history.push({ index, oldColor, newColor: emptyColor });
            atelier.stitches[index] = emptyColor;
            sfx.playUnstitch();
        }
    }

    pickDye() {
        const index = atelier.needlePos.y * atelier.linenWidth + atelier.needlePos.x;
        const color = atelier.stitches[index];
        if (color !== '#eee8d5') {
            atelier.activeDye = color;
            sfx.playStitch();
            atelier.isPicking = true;
            setTimeout(() => { atelier.isPicking = false; }, 1500);
        }
    }

    commitSelection() {
        if (!atelier.selectionStart) return;
        const x1 = Math.min(atelier.selectionStart.x, atelier.needlePos.x);
        const x2 = Math.max(atelier.selectionStart.x, atelier.needlePos.x);
        const y1 = Math.min(atelier.selectionStart.y, atelier.needlePos.y);
        const y2 = Math.max(atelier.selectionStart.y, atelier.needlePos.y);

        let changed = false;
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                const index = y * atelier.linenWidth + x;
                const oldColor = atelier.stitches[index];
                if (oldColor !== atelier.activeDye) {
                    history.push({ index, oldColor, newColor: atelier.activeDye });
                    atelier.stitches[index] = atelier.activeDye;
                    changed = true;
                }
            }
        }
        if (changed) sfx.playStitch();
        atelier.selectionStart = null;
    }

    clearLinen() {
        if (confirm('Are you sure you want to unravel the entire project?')) {
            atelier.stitches = atelier.stitches.map(() => '#eee8d5');
            history.clear();
            sfx.playUnstitch();
        }
    }

    // --- Manipulation ---

    resizeLinen(newWidth: number, newHeight: number) {
        const newStitches = Array(newWidth * newHeight).fill('#eee8d5');
        for (let y = 0; y < Math.min(atelier.linenHeight, newHeight); y++) {
            for (let x = 0; x < Math.min(atelier.linenWidth, newWidth); x++) {
                const oldIdx = y * atelier.linenWidth + x;
                const newIdx = y * newWidth + x;
                newStitches[newIdx] = atelier.stitches[oldIdx];
            }
        }
        atelier.linenWidth = newWidth;
        atelier.linenHeight = newHeight;
        atelier.stitches = newStitches;
        history.clear();
        sfx.playStitch();
    }

    flipLinen(axis: 'horizontal' | 'vertical') {
        const newStitches = [...atelier.stitches];
        if (axis === 'horizontal') {
            for (let y = 0; y < atelier.linenHeight; y++) {
                const row = atelier.stitches.slice(y * atelier.linenWidth, (y + 1) * atelier.linenWidth);
                row.reverse();
                for (let x = 0; x < atelier.linenWidth; x++) newStitches[y * atelier.linenWidth + x] = row[x];
            }
        } else {
            for (let y = 0; y < atelier.linenHeight; y++) {
                for (let x = 0; x < atelier.linenWidth; x++) {
                    const oldIdx = y * atelier.linenWidth + x;
                    const newIdx = (atelier.linenHeight - 1 - y) * atelier.linenWidth + x;
                    newStitches[newIdx] = atelier.stitches[oldIdx];
                }
            }
        }
        atelier.stitches = newStitches;
        history.clear();
        sfx.playStitch();
    }

    rotateLinen() {
        if (atelier.linenWidth !== atelier.linenHeight) return;
        const newStitches = Array(atelier.linenWidth * atelier.linenHeight).fill('#eee8d5');
        for (let y = 0; y < atelier.linenHeight; y++) {
            for (let x = 0; x < atelier.linenWidth; x++) {
                const oldIdx = y * atelier.linenWidth + x;
                const newIdx = x * atelier.linenWidth + (atelier.linenHeight - 1 - y);
                newStitches[newIdx] = atelier.stitches[oldIdx];
            }
        }
        atelier.stitches = newStitches;
        history.clear();
        sfx.playStitch();
    }

    // --- Clipboard ---

    copy() {
        if (!atelier.selectionStart) return;
        const x1 = Math.min(atelier.selectionStart.x, atelier.needlePos.x);
        const x2 = Math.max(atelier.selectionStart.x, atelier.needlePos.x);
        const y1 = Math.min(atelier.selectionStart.y, atelier.needlePos.y);
        const y2 = Math.max(atelier.selectionStart.y, atelier.needlePos.y);
        const w = x2 - x1 + 1;
        const h = y2 - y1 + 1;
        const data = [];
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) data.push(atelier.stitches[y * atelier.linenWidth + x]);
        }
        atelier.clipboard = { width: w, height: h, data };
        sfx.playStitch();
    }

    cut() {
        this.copy();
        if (!atelier.selectionStart) return;
        const x1 = Math.min(atelier.selectionStart.x, atelier.needlePos.x);
        const x2 = Math.max(atelier.selectionStart.x, atelier.needlePos.x);
        const y1 = Math.min(atelier.selectionStart.y, atelier.needlePos.y);
        const y2 = Math.max(atelier.selectionStart.y, atelier.needlePos.y);
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) atelier.stitches[y * atelier.linenWidth + x] = '#eee8d5';
        }
        sfx.playUnstitch();
    }

    paste() {
        if (!atelier.clipboard) return;
        for (let y = 0; y < atelier.clipboard.height; y++) {
            for (let x = 0; x < atelier.clipboard.width; x++) {
                const tx = atelier.needlePos.x + x;
                const ty = atelier.needlePos.y + y;
                if (tx < atelier.linenWidth && ty < atelier.linenHeight) {
                    atelier.stitches[ty * atelier.linenWidth + tx] = atelier.clipboard.data[y * atelier.clipboard.width + x];
                }
            }
        }
        sfx.playStitch();
    }

    // --- Persistence ---

    private serialize() {
        return JSON.stringify({
            version: atelier.version,
            metadata: { name: atelier.projectName, lastModified: new Date().toISOString() },
            dimensions: { width: atelier.linenWidth, height: atelier.linenHeight },
            palette: atelier.palette,
            pixelData: atelier.stitches
        });
    }

    async save() {
        if (typeof window.electronAPI === 'undefined') {
            const blob = new Blob([this.serialize()], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${atelier.projectName.toLowerCase().replace(/\s+/g, '-')}.rupa`;
            a.click();
            return;
        }
        const res = await window.electronAPI.saveFile(this.serialize(), atelier.currentFilePath || undefined);
        if (res) {
            atelier.currentFilePath = res;
            atelier.lastSaved = new Date();
            sfx.playStitch();
        }
    }

    async load() {
        if (typeof window.electronAPI === 'undefined') {
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
            return;
        }
        const res = await window.electronAPI.openFile();
        if (res) {
            this.deserialize(res.content);
            atelier.currentFilePath = res.filePath;
            atelier.lastSaved = new Date();
            sfx.playStitch();
        }
    }

    async backup() {
        if (window.electronAPI) {
            await window.electronAPI.autoSave(this.serialize());
            atelier.lastSaved = new Date();
        } else {
            localStorage.setItem('rupa_auto_backup', this.serialize());
        }
    }

    private deserialize(json: string) {
        try {
            const d = JSON.parse(json);
            atelier.linenWidth = d.dimensions.width;
            atelier.linenHeight = d.dimensions.height;
            atelier.stitches = d.pixelData;
            atelier.palette = d.palette;
            atelier.projectName = d.metadata.name;
            history.clear();
        } catch (e) { console.error(e); }
    }
}

export const shuttle = new ShuttleEngine();
