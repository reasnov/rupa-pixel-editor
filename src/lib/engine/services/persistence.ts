import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../../engine/audio.js';
import { history } from '../../engine/history.js';
import { FrameState } from '../../state/frame.svelte.js';
import { LayerState } from '../../state/layer.svelte.js';

export class PersistenceService {
	private serialize() {
		// Professional Structure
		return JSON.stringify({
			version: editor.version,
			metadata: {
				name: 'Untitled Project',
				lastModified: new Date().toISOString()
			},
			palette: editor.paletteState.swatches,
			project: {
				frames: editor.project.frames.map((f) => ({
					name: f.name,
					width: f.width,
					height: f.height,
					layers: f.layers.map((v) => ({
						name: v.name,
						isVisible: v.isVisible,
						isLocked: v.isLocked,
						pixels: v.pixels
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
			editor.project.currentFilePath || undefined
		);
		if (res) {
			editor.project.setMetadata(res);
			sfx.playDraw();
		}
	}

	private webDownload(data: string) {
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `rupa-project.rupa`;
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
			editor.project.setMetadata(res.filePath);
			sfx.playDraw();
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
			editor.project.lastSaved = new Date();
		} else {
			localStorage.setItem('rupa_auto_backup', data);
		}
	}

	private deserialize(json: string) {
		try {
			const d = JSON.parse(json);

			// 1. Restore Palette
			if (d.palette) editor.paletteState.swatches = d.palette;

			// 2. Restore Project Structure (with Backward Compatibility)
			const projectData = d.project || d.folio;
			if (projectData) {
				// Professional format
				editor.project.frames = projectData.frames.map((fd: any) => {
					const frame = new FrameState(fd.name, fd.width, fd.height);
					// Fallback for old "veils" key if it exists in the file
					const layersData = fd.layers || fd.veils || [];
					frame.layers = layersData.map((vd: any) => {
						const layer = new LayerState(vd.name, fd.width, fd.height);
						layer.isVisible = vd.isVisible;
						layer.isLocked = vd.isLocked;
						layer.pixels = vd.pixels || vd.stitches || [];
						return layer;
					});
					return frame;
				});
			} else if (d.pixelData) {
				// Legacy v0.3.0 format
				const frame = new FrameState('Restored Project', d.dimensions.width, d.dimensions.height);
				frame.layers[0].pixels = d.pixelData;
				editor.project.frames = [frame];
			}

			editor.project.activeFrameIndex = 0;
			history.clear();
		} catch (e) {
			console.error('Failed to restore project:', e);
		}
	}
}
