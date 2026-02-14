import { atelier } from '../../state/atelier.svelte.js';
import { sfx } from '../../engine/audio.js';
import { history } from '../../engine/history.js';
import { FrameState } from '../../state/frame.svelte.js';
import { VeilState } from '../../state/veil.svelte.js';

export class PersistenceService {
	private serialize() {
		// New v0.4.0 Folio Structure
		return JSON.stringify({
			version: atelier.version,
			metadata: {
				name: 'Artisan Pattern',
				lastModified: new Date().toISOString()
			},
			palette: atelier.paletteState.swatches,
			folio: {
				frames: atelier.project.frames.map((f) => ({
					name: f.name,
					width: f.width,
					height: f.height,
					veils: f.veils.map((v) => ({
						name: v.name,
						isVisible: v.isVisible,
						isLocked: v.isLocked,
						stitches: v.stitches
					}))
				}))
			}
		});
	}

	async save() {
		const data = this.serialize();
		if (typeof window.electronAPI === 'undefined') {
			this.webDownload(data);
			return;
		}

		const res = await window.electronAPI.saveFile(
			data,
			atelier.project.currentFilePath || undefined
		);
		if (res) {
			atelier.project.setMetadata(res);
			sfx.playStitch();
		}
	}

	private webDownload(data: string) {
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `rupa-motif.rupa`;
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
			atelier.project.setMetadata(res.filePath);
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

			// 1. Restore Palette
			atelier.paletteState.swatches = d.palette;

			// 2. Restore Folio Structure (with Backward Compatibility)
			if (d.folio) {
				// Modern v0.4.0+ format
				atelier.project.frames = d.folio.frames.map((fd: any) => {
					const frame = new FrameState(fd.name, fd.width, fd.height);
					frame.veils = fd.veils.map((vd: any) => {
						const veil = new VeilState(vd.name, fd.width, fd.height);
						veil.isVisible = vd.isVisible;
						veil.isLocked = vd.isLocked;
						veil.stitches = vd.stitches;
						return veil;
					});
					return frame;
				});
			} else if (d.pixelData) {
				// Legacy v0.3.0 format
				const frame = new FrameState('Restored Motif', d.dimensions.width, d.dimensions.height);
				frame.veils[0].stitches = d.pixelData;
				atelier.project.frames = [frame];
			}

			atelier.project.activeFrameIndex = 0;
			history.clear();
		} catch (e) {
			console.error('Failed to restore pattern book:', e);
		}
	}
}
