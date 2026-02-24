import { editor } from '../../state/editor.svelte.js';
import { sfx } from '../../engine/audio.js';
import { history } from '../../engine/history.js';
import { FrameState } from '../../state/frame.svelte.js';
import { LayerState } from '../../state/layer.svelte.js';
import { StorageLogic } from '../../logic/storage.js';
import JSZip from 'jszip';

/**
 * PersistenceService: Handles project serialization using an industrial-grade
 * binary format (ZIP-based) for efficiency and compatibility with GitHub Pages.
 */
export class PersistenceService {
	/**
	 * Serializes the project into a binary Blob.
	 */
	private async serialize(): Promise<Blob> {
		const zip = new JSZip();

		const metadata = {
			version: editor.version,
			name: 'Untitled Project',
			lastModified: new Date().toISOString(),
			palette: editor.paletteState.swatches,
			presets: editor.paletteState.presets,
			dimensions: { width: editor.canvas.width, height: editor.canvas.height },
			fps: editor.project.fps,
			structure: editor.project.frames.map((f, fIdx) => ({
				name: f.name,
				layers: f.layers.map((l, lIdx) => ({
					name: l.name,
					isVisible: l.isVisible,
					isLocked: l.isLocked,
					isLinked: l.isLinked || false,
					type: l.type,
					parentId: l.parentId,
					isCollapsed: l.isCollapsed,
					dataPath: l.type === 'LAYER' ? `f${fIdx}_l${lIdx}.bin` : null
				}))
			}))
		};

		zip.file('project.json', JSON.stringify(metadata));

		editor.project.frames.forEach((f, fIdx) => {
			f.layers.forEach((l, lIdx) => {
				if (l.type === 'LAYER') {
					// Cast pixels.buffer to ArrayBuffer to satisfy JSZip types
					zip.file(`f${fIdx}_l${lIdx}.bin`, l.pixels.buffer as ArrayBuffer);
				}
			});
		});

		return await zip.generateAsync({
			type: 'blob',
			compression: 'DEFLATE'
		});
	}

	async save() {
		try {
			const blob = await this.serialize();

			if (typeof window.electronAPI === 'undefined') {
				this.webDownload(blob);
				return;
			}

			// Electron: Convert Blob to base64 string for safe IPC transfer
			const reader = new FileReader();
			reader.onload = async () => {
				const result = reader.result as string;
				const base64 = result.split(',')[1];
				if (window.electronAPI) {
					const res = await window.electronAPI.saveFile(
						base64,
						editor.project.currentFilePath || undefined
					);
					if (res) {
						editor.project.setMetadata(res);
						sfx.playDraw();
					}
				}
			};
			reader.readAsDataURL(blob);
		} catch (e) {
			editor.studio.reportError('Save Failed', 'Could not serialize binary data.', String(e));
		}
	}

	private webDownload(blob: Blob) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `rupa-project.rupa`;
		a.click();
		URL.revokeObjectURL(url);
	}

	async load() {
		if (typeof window.electronAPI === 'undefined') {
			this.webUpload();
			return;
		}

		const res = await window.electronAPI.openFile();
		if (res) {
			await this.deserialize(res.content);
			editor.project.setMetadata(res.filePath);
			sfx.playDraw();
		}
	}

	private webUpload() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.rupa';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				await this.deserialize(file);
				sfx.playDraw();
			}
		};
		input.click();
	}

	async backup() {
		try {
			const blob = await this.serialize();
			if (window.electronAPI) {
				const reader = new FileReader();
				reader.onload = async () => {
					const result = reader.result as string;
					const base64 = result.split(',')[1];
					await window.electronAPI!.autoSave(base64);
				};
				reader.readAsDataURL(blob);
			} else {
				const reader = new FileReader();
				reader.onload = async () => {
					await StorageLogic.saveProject('auto_backup', reader.result as string);
				};
				reader.readAsDataURL(blob);
			}
			editor.project.lastSaved = new Date();
		} catch (e) {
			console.warn('Backup failed:', e);
		}
	}

	async autoSaveSession() {
		try {
			const blob = await this.serialize();
			const reader = new FileReader();
			reader.onload = async () => {
				await StorageLogic.saveProject('autosave_session', reader.result as string);
				editor.project.lastSaved = new Date();
			};
			reader.readAsDataURL(blob);
		} catch (e) {
			console.warn('Autosave failed:', e);
		}
	}

	async restoreLastSession() {
		const data = await StorageLogic.loadProject('autosave_session');
		if (data) {
			const res = await fetch(data);
			const blob = await res.blob();
			await this.deserialize(blob);
			return true;
		}
		return false;
	}

	async saveGlobalPalettes() {
		try {
			await StorageLogic.savePresets(editor.paletteState.presets);
		} catch (e) {
			console.warn('Failed to save global palettes:', e);
		}
	}

	async loadGlobalPalettes() {
		try {
			const presets = await StorageLogic.loadPresets();
			if (presets) {
				const defaults = editor.paletteState.presets.filter((p) => p.isDefault);
				const customs = presets.filter((p: any) => !p.isDefault);
				editor.paletteState.presets = [...defaults, ...customs];
			}
		} catch (e) {
			console.warn('Failed to load global palettes:', e);
		}
	}

	private async deserialize(input: string | Blob | File) {
		try {
			const zip = new JSZip();
			let contents;

			if (typeof input === 'string') {
				// Base64 string from Electron or Legacy JSON
				if (input.startsWith('{')) {
					return this.deserializeLegacy(input);
				}
				const res = await fetch(`data:application/zip;base64,${input}`);
				contents = await zip.loadAsync(await res.blob());
			} else {
				contents = await zip.loadAsync(input);
			}

			const projectJson = await contents.file('project.json')?.async('string');
			if (!projectJson) throw new Error('Invalid .rupa file');

			const d = JSON.parse(projectJson);
			editor.project.fps = d.fps || 10;
			editor.paletteState.swatches = d.palette || editor.paletteState.swatches;

			editor.project.frames = await Promise.all(
				d.structure.map(async (fd: any) => {
					const frame = new FrameState(fd.name, d.dimensions.width, d.dimensions.height);
					frame.layers = await Promise.all(
						fd.layers.map(async (ld: any) => {
							const layer = new LayerState(
								ld.name,
								d.dimensions.width,
								d.dimensions.height,
								ld.type || 'LAYER'
							);
							layer.isVisible = ld.isVisible;
							layer.isLocked = ld.isLocked;
							layer.isLinked = ld.isLinked || false;
							layer.parentId = ld.parentId || null;
							layer.isCollapsed = ld.isCollapsed || false;

							if (layer.type === 'LAYER' && ld.dataPath) {
								const binary = await contents.file(ld.dataPath)?.async('arraybuffer');
								if (binary) layer.pixels = new Uint32Array(binary);
							}
							return layer;
						})
					);
					return frame;
				})
			);

			editor.project.activeFrameIndex = 0;
			editor.canvas.incrementVersion();
			history.clear();
		} catch (e) {
			editor.studio.reportError('Load Failed', 'Could not parse project file.', String(e));
		}
	}

	private deserializeLegacy(json: string) {
		try {
			const d = JSON.parse(json);
			if (d.palette) editor.paletteState.swatches = d.palette;
			const projectData = d.project || d.folio;
			if (projectData) {
				editor.project.frames = projectData.frames.map((fd: any) => {
					const frame = new FrameState(fd.name, fd.width, fd.height);
					frame.layers = (fd.layers || []).map((vd: any) => {
						const layer = new LayerState(vd.name, fd.width, fd.height, vd.type || 'LAYER');
						layer.pixels = new Uint32Array(vd.pixels || []);
						return layer;
					});
					return frame;
				});
			}
			editor.canvas.incrementVersion();
			history.clear();
		} catch (e) {}
	}
}
