import { type ColorHex } from '../types/index';
import { sfx } from '../engine/audio';
import { history } from '../engine/history';
import { stance } from '../engine/stance.svelte';

/**
 * The AtelierState: The central heart of the artisan's studio.
 * Manages the linen, the needle, and the overall workshop environment.
 */
export class AtelierState {
	readonly version = __APP_VERSION__;
	projectName = $state('Untitled Stitch');
	currentFilePath = $state<string | null>(null);
	lastSaved = $state<Date | null>(null);
	clipboard = $state<{ width: number; height: number; data: ColorHex[] } | null>(null);

	// --- The Linen (Grid) ---
	linenWidth = $state(32);
	linenHeight = $state(32);
	stitches = $state<ColorHex[]>([]);
	
	// --- The Needle (Cursor) ---
	needlePos = $state({ x: 0, y: 0 });
	activeDye = $state<ColorHex>('#859900'); // Grass Green (Palette 3)
	
	palette = $state<ColorHex[]>([
		'#073642', // Base 02 (Dark)
		'#586e75', // Base 01 (Gray)
		'#859900', // Green
		'#2aa198', // Cyan
		'#268bd2', // Blue
		'#6c71c4', // Violet
		'#d33682', // Magenta
		'#dc322f', // Red
		'#cb4b16', // Orange
		'#b58900'  // Yellow
	]);

	zoomLevel = $state(1);
	
	// --- Studio Flags ---
	showDyeBasin = $state(false);
	showPatternCatalog = $state(false);
	showArtisanGuide = $state(false);
	showArtifactCrate = $state(false);
	
	exportScale = $state(10);
	exportBgColor = $state<string | 'transparent'>('transparent');
	isMuted = $state(false);
	isPicking = $state(false);
	isAppReady = $state(false);
	isNeedleVisible = $state(true);
	
	// Internal Keyboard States (LoomPad feedback)
	isShiftPressed = $state(false);
	isCtrlPressed = $state(false);
	isAltPressed = $state(false);
	isSelecting = $state(false);

	// Inactivity Logic
	private inactivityTimer: any = null;
	private readonly INACTIVITY_TIMEOUT = 20000;

	// Selection/Block mode
	selectionStart = $state<{ x: number; y: number } | null>(null);
	selectionEnd = $state<{ x: number; y: number } | null>(null);

	// Universal Escape Stack
	private escapeStack: (() => void)[] = [];

	constructor(width = 32, height = 32) {
		this.linenWidth = width;
		this.linenHeight = height;
		this.stitches = Array(width * height).fill('#eee8d5'); // Soft Cream/Linen
		this.resetInactivityTimer();
	}

	// --- Workshop Environment Methods ---

	resetInactivityTimer() {
		this.isNeedleVisible = true;
		if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
		this.inactivityTimer = setTimeout(() => {
			this.isNeedleVisible = false;
		}, this.INACTIVITY_TIMEOUT);
	}

	toggleMute() {
		this.isMuted = !this.isMuted;
	}

	setZoom(delta: number) {
		const newZoom = this.zoomLevel + delta;
		this.zoomLevel = Math.max(0.5, Math.min(5, Number(newZoom.toFixed(1))));
		this.resetInactivityTimer();
	}

	resetZoom() {
		this.zoomLevel = 1;
		this.resetInactivityTimer();
	}

	// --- Needle Navigation ---

	moveNeedle(dx: number, dy: number) {
		const newX = Math.max(0, Math.min(this.linenWidth - 1, this.needlePos.x + dx));
		const newY = Math.max(0, Math.min(this.linenHeight - 1, this.needlePos.y + dy));

		if (newX !== this.needlePos.x || newY !== this.needlePos.y) {
			this.needlePos = { x: newX, y: newY };
			sfx.playMove();

			// Sovereignty check via StanceEngine
			switch (stance.current.type) {
				case 'LOOMING':
					this.updateSelection();
					break;
				case 'UNRAVELLING':
					this.unstitch();
					break;
				case 'THREADING':
					this.stitch();
					break;
			}
		}
		this.resetInactivityTimer();
	}

	// --- Stitching Actions ---

	stitch() {
		const index = this.needlePos.y * this.linenWidth + this.needlePos.x;
		const oldColor = this.stitches[index];
		if (oldColor !== this.activeDye) {
			history.push({ index, oldColor, newColor: this.activeDye });
			this.stitches[index] = this.activeDye;
			sfx.playStitch();
		}
		this.resetInactivityTimer();
	}

	unstitch() {
		const index = this.needlePos.y * this.linenWidth + this.needlePos.x;
		const oldColor = this.stitches[index];
		const emptyColor = '#eee8d5';
		if (oldColor !== emptyColor) {
			history.push({ index, oldColor, newColor: emptyColor });
			this.stitches[index] = emptyColor;
			sfx.playUnstitch();
		}
		this.resetInactivityTimer();
	}

	clearLinen() {
		if (confirm('Are you sure you want to unravel the entire project?')) {
			this.stitches = this.stitches.map(() => '#eee8d5');
			history.clear();
			sfx.playUnstitch();
		}
		this.resetInactivityTimer();
	}

	undo() {
		const action = history.undo();
		if (action) {
			this.stitches[action.index] = action.oldColor;
			sfx.playUnstitch();
		}
		this.resetInactivityTimer();
	}

	redo() {
		const action = history.redo();
		if (action) {
			this.stitches[action.index] = action.newColor;
			sfx.playStitch();
		}
		this.resetInactivityTimer();
	}

	// --- Dye Management ---

	selectPalette(index: number) {
		if (index >= 0 && index < this.palette.length) {
			this.activeDye = this.palette[index];
		}
		this.resetInactivityTimer();
	}

	pickDye() {
		const index = this.needlePos.y * this.linenWidth + this.needlePos.x;
		const color = this.stitches[index];
		if (color !== '#eee8d5') {
			this.activeDye = color;
			sfx.playStitch();
			this.isPicking = true;
			setTimeout(() => {
				this.isPicking = false;
			}, 1500);
		}
		this.resetInactivityTimer();
	}

	// --- Block & Selection Methods ---

	startSelection() {
		this.selectionStart = { ...this.needlePos };
		this.selectionEnd = { ...this.needlePos };
		this.resetInactivityTimer();
	}

	updateSelection() {
		if (this.selectionStart) {
			this.selectionEnd = { ...this.needlePos };
		}
		this.resetInactivityTimer();
	}

	commitSelection() {
		if (!this.selectionStart || !this.selectionEnd) return;

		const x1 = Math.min(this.selectionStart.x, this.selectionEnd.x);
		const x2 = Math.max(this.selectionStart.x, this.selectionEnd.x);
		const y1 = Math.min(this.selectionStart.y, this.selectionEnd.y);
		const y2 = Math.max(this.selectionStart.y, this.selectionEnd.y);

		for (let y = y1; y <= y2; y++) {
			for (let x = x1; x <= x2; x++) {
				const index = y * this.linenWidth + x;
				const oldColor = this.stitches[index];
				if (oldColor !== this.activeDye) {
					history.push({ index, oldColor, newColor: this.activeDye });
					this.stitches[index] = this.activeDye;
				}
			}
		}
		sfx.playStitch();
		this.selectionStart = null;
		this.selectionEnd = null;
		this.resetInactivityTimer();
	}

	// --- Persistence Logic ---

	private serialize() {
		return JSON.stringify({
			version: this.version,
			metadata: {
				name: this.projectName,
				created: new Date().toISOString(),
				lastModified: new Date().toISOString()
			},
			dimensions: {
				width: this.linenWidth,
				height: this.linenHeight
			},
			palette: $state.snapshot(this.palette),
			pixelData: $state.snapshot(this.stitches)
		});
	}

	async saveProject() {
		if (typeof window.electronAPI === 'undefined') {
			const blob = new Blob([this.serialize()], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${this.projectName.toLowerCase().replace(/\s+/g, '-')}.rupa`;
			a.click();
			return;
		}

		const result = await window.electronAPI.saveFile(this.serialize(), this.currentFilePath || undefined);
		if (result) {
			this.currentFilePath = result;
			this.lastSaved = new Date();
			sfx.playStitch();
		}
	}

	async loadProject() {
		if (typeof window.electronAPI === 'undefined') {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = '.rupa';
			input.onchange = async (e) => {
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

		const result = await window.electronAPI.openFile();
		if (result) {
			this.deserialize(result.content);
			this.currentFilePath = result.filePath;
			this.lastSaved = new Date();
			sfx.playStitch();
		}
	}

	async backupProject() {
		if (window.electronAPI) {
			await window.electronAPI.autoSave(this.serialize());
			this.lastSaved = new Date();
		} else {
			localStorage.setItem('rupa_auto_backup', this.serialize());
		}
	}

	private deserialize(json: string) {
		try {
			const data = JSON.parse(json);
			this.linenWidth = data.dimensions.width;
			this.linenHeight = data.dimensions.height;
			this.stitches = data.pixelData;
			this.palette = data.palette;
			this.projectName = data.metadata.name;
			history.clear();
		} catch (e) {
			console.error('Failed to unravel project:', e);
		}
	}

	// --- Linen Manipulation ---

	resizeLinen(newWidth: number, newHeight: number) {
		const newStitches = Array(newWidth * newHeight).fill('#eee8d5');
		for (let y = 0; y < Math.min(this.linenHeight, newHeight); y++) {
			for (let x = 0; x < Math.min(this.linenWidth, newWidth); x++) {
				const oldIdx = y * this.linenWidth + x;
				const newIdx = y * newWidth + x;
				newStitches[newIdx] = this.stitches[oldIdx];
			}
		}
		this.linenWidth = newWidth;
		this.linenHeight = newHeight;
		this.stitches = newStitches;
		history.clear();
		sfx.playStitch();
	}

	flipLinen(axis: 'horizontal' | 'vertical') {
		const newStitches = [...this.stitches];
		if (axis === 'horizontal') {
			for (let y = 0; y < this.linenHeight; y++) {
				const row = this.stitches.slice(y * this.linenWidth, (y + 1) * this.linenWidth);
				row.reverse();
				for (let x = 0; x < this.linenWidth; x++) {
					newStitches[y * this.linenWidth + x] = row[x];
				}
			}
		} else {
			for (let y = 0; y < this.linenHeight; y++) {
				for (let x = 0; x < this.linenWidth; x++) {
					const oldIdx = y * this.linenWidth + x;
					const newIdx = (this.linenHeight - 1 - y) * this.linenWidth + x;
					newStitches[newIdx] = this.stitches[oldIdx];
				}
			}
		}
		this.stitches = newStitches;
		history.clear();
		sfx.playStitch();
	}

	rotateLinen() {
		if (this.linenWidth !== this.linenHeight) return;
		const newStitches = Array(this.linenWidth * this.linenHeight).fill('#eee8d5');
		for (let y = 0; y < this.linenHeight; y++) {
			for (let x = 0; x < this.linenWidth; x++) {
				const oldIdx = y * this.linenWidth + x;
				const newIdx = x * this.linenWidth + (this.linenHeight - 1 - y);
				newStitches[newIdx] = this.stitches[oldIdx];
			}
		}
		this.stitches = newStitches;
		history.clear();
		sfx.playStitch();
	}

	// --- Clipboard Manipulation ---

	copySelection() {
		if (!this.selectionStart || !this.selectionEnd) return;
		const x1 = Math.min(this.selectionStart.x, this.selectionEnd.x);
		const x2 = Math.max(this.selectionStart.x, this.selectionEnd.x);
		const y1 = Math.min(this.selectionStart.y, this.selectionEnd.y);
		const y2 = Math.max(this.selectionStart.y, this.selectionEnd.y);
		const w = x2 - x1 + 1;
		const h = y2 - y1 + 1;

		const data: ColorHex[] = [];
		for (let y = y1; y <= y2; y++) {
			for (let x = x1; x <= x2; x++) {
				data.push(this.stitches[y * this.linenWidth + x]);
			}
		}
		this.clipboard = { width: w, height: h, data };
		sfx.playStitch();
	}

	cutSelection() {
		this.copySelection();
		if (!this.selectionStart || !this.selectionEnd) return;
		const x1 = Math.min(this.selectionStart.x, this.selectionEnd.x);
		const x2 = Math.max(this.selectionStart.x, this.selectionEnd.x);
		const y1 = Math.min(this.selectionStart.y, this.selectionEnd.y);
		const y2 = Math.max(this.selectionStart.y, this.selectionEnd.y);

		for (let y = y1; y <= y2; y++) {
			for (let x = x1; x <= x2; x++) {
				const idx = y * this.linenWidth + x;
				this.stitches[idx] = '#eee8d5';
			}
		}
		sfx.playUnstitch();
	}

	pasteSelection() {
		if (!this.clipboard) return;
		for (let y = 0; y < this.clipboard.height; y++) {
			for (let x = 0; x < this.clipboard.width; x++) {
				const targetX = this.needlePos.x + x;
				const targetY = this.needlePos.y + y;
				if (targetX < this.linenWidth && targetY < this.linenHeight) {
					const targetIdx = targetY * this.linenWidth + targetX;
					const sourceIdx = y * this.clipboard.width + x;
					this.stitches[targetIdx] = this.clipboard.data[sourceIdx];
				}
			}
		}
		sfx.playStitch();
	}

	// --- Universal Escape Stack ---

	pushEscapeAction(fn: () => void) {
		this.escapeStack.push(fn);
	}

	popEscapeAction(fn: () => void) {
		this.escapeStack = this.escapeStack.filter((item) => item !== fn);
	}

	handleEscape() {
		const lastAction = this.escapeStack.pop();
		if (lastAction) {
			lastAction();
			return true;
		}
		return false;
	}

	// --- Derived Projections ---

	// Derived palette of colors currently present on the canvas
	usedColors = $derived.by(() => {
		const colors = new Set<string>();
		this.stitches.forEach((color) => {
			if (color !== '#eee8d5') {
				colors.add(color);
			}
		});
		return Array.from(colors);
	});

	displayCoords = $derived.by(() => {
		const calc = (pos: number, size: number) => {
			const mid = Math.floor(size / 2);
			const isEven = size % 2 === 0;
			if (isEven) {
				const val = pos - mid;
				return val >= 0 ? val + 1 : val;
			}
			return pos - mid;
		};
		return {
			x: calc(this.needlePos.x, this.linenWidth),
			y: -calc(this.needlePos.y, this.linenHeight)
		};
	});

	cameraTransform = $derived.by(() => {
		if (this.zoomLevel <= 1) {
			// Overview Mode: Keep the linen perfectly centered
			return `scale(${this.zoomLevel})`;
		} else {
			// Detail Mode: Track the needle as the focal point
			const xPos = ((this.needlePos.x + 0.5) / this.linenWidth) * 100;
			const yPos = ((this.needlePos.y + 0.5) / this.linenHeight) * 100;

			const tx = 50 - xPos;
			const ty = 50 - yPos;

			return `translate(${tx}%, ${ty}%) scale(${this.zoomLevel})`;
		}
	});
}

export const atelier = new AtelierState();
