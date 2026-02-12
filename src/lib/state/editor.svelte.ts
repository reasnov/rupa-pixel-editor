import { type ColorHex } from '../types/index';
import { sfx } from '../engine/audio';
import { history } from '../engine/history';

export class EditorState {
	version = __APP_VERSION__;
	projectName = $state('Untitled Stitch');
	currentFilePath = $state<string | null>(null);
	lastSaved = $state<Date | null>(null);
	clipboard = $state<{ width: number; height: number; data: ColorHex[] } | null>(null);

	gridWidth = $state(32);
	gridHeight = $state(32);
	pixelData = $state<ColorHex[]>([]);
	cursorPos = $state({ x: 0, y: 0 });
	activeColor = $state<ColorHex>('#859900'); // Grass Green (Palette 3)
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
	showColorPicker = $state(false);
	showCommandPalette = $state(false);
	showHelp = $state(false);
	exportScale = $state(10); // Default to 10x for a decent 320px size
	exportBgColor = $state<string | 'transparent'>('transparent');
	isMuted = $state(false);
	isPicking = $state(false);
	isAppReady = $state(false);
	isCursorVisible = $state(true);
	isShiftPressed = $state(false);
	isCtrlPressed = $state(false);
	isAltPressed = $state(false);
	isSelecting = $state(false);

	// Inactivity Logic
	private inactivityTimer: any = null;
	private readonly INACTIVITY_TIMEOUT = 20000; // 20 seconds

	// Selection/Block mode
	selectionStart = $state<{ x: number; y: number } | null>(null);
	selectionEnd = $state<{ x: number; y: number } | null>(null);

	isBlockMode = $derived(this.isSelecting);

	// Universal Escape Stack
	private escapeStack: (() => void)[] = [];

	constructor(width = 32, height = 32) {
		this.gridWidth = width;
		this.gridHeight = height;
		this.pixelData = Array(width * height).fill('#eee8d5'); // Soft Cream/Linen
		this.resetInactivityTimer();
	}

	resetInactivityTimer() {
		this.isCursorVisible = true;
		if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
		this.inactivityTimer = setTimeout(() => {
			this.isCursorVisible = false;
		}, this.INACTIVITY_TIMEOUT);
	}

	toggleMute() {
		this.isMuted = !this.isMuted;
	}

	startSelection() {
		this.selectionStart = { ...this.cursorPos };
		this.selectionEnd = { ...this.cursorPos };
		this.resetInactivityTimer();
	}

	updateSelection() {
		if (this.selectionStart) {
			this.selectionEnd = { ...this.cursorPos };
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
				const index = y * this.gridWidth + x;
				const oldColor = this.pixelData[index];
				if (oldColor !== this.activeColor) {
					history.push({ index, oldColor, newColor: this.activeColor });
					this.pixelData[index] = this.activeColor;
				}
			}
		}
		sfx.playStitch();
		this.selectionStart = null;
		this.selectionEnd = null;
		this.resetInactivityTimer();
	}

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

	// Derived palette of colors currently present on the canvas
	usedColors = $derived.by(() => {
		const colors = new Set<string>();
		this.pixelData.forEach((color) => {
			if (color !== '#eee8d5') {
				colors.add(color);
			}
		});
		return Array.from(colors);
	});

	// Artisan coordinates: (0,0) only for odd grids. Even grids skip zero.
	displayCoords = $derived.by(() => {
		const calc = (pos: number, size: number) => {
			const mid = Math.floor(size / 2);
			const isEven = size % 2 === 0;

			if (isEven) {
				return pos < mid ? pos - mid : pos - mid + 1;
			} else {
				return pos - mid;
			}
		};

		return {
			x: calc(this.cursorPos.x, this.gridWidth),
			y: calc(this.cursorPos.y, this.gridHeight) * -1
		};
	});

	cameraTransform = $derived.by(() => {
		if (this.zoomLevel <= 1) {
			return `scale(${this.zoomLevel})`;
		} else {
			// Precise tracking: calculate offset to bring needle to (50%, 50%)
			const xPos = ((this.cursorPos.x + 0.5) / this.gridWidth) * 100;
			const yPos = ((this.cursorPos.y + 0.5) / this.gridHeight) * 100;

			const tx = 50 - xPos;
			const ty = 50 - yPos;

			return `translate(${tx}%, ${ty}%) scale(${this.zoomLevel})`;
		}
	});

	setZoom(delta: number) {
		const newZoom = this.zoomLevel + delta;
		this.zoomLevel = Math.max(0.5, Math.min(5, Number(newZoom.toFixed(1))));
		this.resetInactivityTimer();
	}

	resetZoom() {
		this.zoomLevel = 1;
		this.resetInactivityTimer();
	}

	selectPalette(index: number) {
		if (index >= 0 && index < this.palette.length) {
			this.activeColor = this.palette[index];
		}
		this.resetInactivityTimer();
	}

	clearCanvas() {
		if (confirm('Are you sure you want to unravel the entire project?')) {
			this.pixelData = this.pixelData.map(() => '#eee8d5');
			sfx.playUnstitch();
		}
		this.resetInactivityTimer();
	}

	pickColor() {
		const index = this.cursorPos.y * this.gridWidth + this.cursorPos.x;
		const color = this.pixelData[index];
		if (color !== '#eee8d5') {
			this.activeColor = color;
			sfx.playStitch();
			this.isPicking = true;
			setTimeout(() => {
				this.isPicking = false;
			}, 1500);
		}
		this.resetInactivityTimer();
	}

	moveCursor(dx: number, dy: number) {
		const newX = Math.max(0, Math.min(this.gridWidth - 1, this.cursorPos.x + dx));
		const newY = Math.max(0, Math.min(this.gridHeight - 1, this.cursorPos.y + dy));

		if (newX !== this.cursorPos.x || newY !== this.cursorPos.y) {
			this.cursorPos = { x: newX, y: newY };
			sfx.playMove();

			if (this.isSelecting) {
				this.updateSelection();
			} else if (this.isAltPressed) {
				this.unstitch();
			} else if (this.isCtrlPressed) {
				this.stitch();
			}
		}
		this.resetInactivityTimer();
	}

	stitch() {
		const index = this.cursorPos.y * this.gridWidth + this.cursorPos.x;
		const oldColor = this.pixelData[index];
		if (oldColor !== this.activeColor) {
			history.push({ index, oldColor, newColor: this.activeColor });
			this.pixelData[index] = this.activeColor;
			sfx.playStitch();
		}
		this.resetInactivityTimer();
	}

	unstitch() {
		const index = this.cursorPos.y * this.gridWidth + this.cursorPos.x;
		const oldColor = this.pixelData[index];
		const emptyColor = '#eee8d5';
		if (oldColor !== emptyColor) {
			history.push({ index, oldColor, newColor: emptyColor });
			this.pixelData[index] = emptyColor;
			sfx.playUnstitch();
		}
		this.resetInactivityTimer();
	}

	undo() {
		const action = history.undo();
		if (action) {
			this.pixelData[action.index] = action.oldColor;
			sfx.playUnstitch();
		}
		this.resetInactivityTimer();
	}

	redo() {
		const action = history.redo();
		if (action) {
			this.pixelData[action.index] = action.newColor;
			sfx.playStitch();
		}
		this.resetInactivityTimer();
	}

	setColor(color: ColorHex) {
		this.activeColor = color;
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
				width: this.gridWidth,
				height: this.gridHeight
			},
			palette: $state.snapshot(this.palette),
			pixelData: $state.snapshot(this.pixelData)
		});
	}

	async saveProject() {
		if (typeof window.electronAPI === 'undefined') {
			// Web Fallback (Download)
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
			sfx.playStitch(); // Tactile feedback for save
		}
	}

	async loadProject() {
		if (typeof window.electronAPI === 'undefined') {
			// Web Fallback: Open file picker
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
			// Web: Save to LocalStorage
			localStorage.setItem('rupa_auto_backup', this.serialize());
		}
	}

	private deserialize(json: string) {
		try {
			const data = JSON.parse(json);
			this.gridWidth = data.dimensions.width;
			this.gridHeight = data.dimensions.height;
			this.pixelData = data.pixelData;
			this.palette = data.palette;
			this.projectName = data.metadata.name;
			history.clear(); // Clear history on load to prevent cross-project undo
		} catch (e) {
			console.error('Failed to unravel project:', e);
		}
	}

	// --- Linen Manipulation ---

	resizeLinen(newWidth: number, newHeight: number) {
		const newPixelData = Array(newWidth * newHeight).fill('#eee8d5');

		// Transfer existing stitches
		for (let y = 0; y < Math.min(this.gridHeight, newHeight); y++) {
			for (let x = 0; x < Math.min(this.gridWidth, newWidth); x++) {
				const oldIdx = y * this.gridWidth + x;
				const newIdx = y * newWidth + x;
				newPixelData[newIdx] = this.pixelData[oldIdx];
			}
		}

		this.gridWidth = newWidth;
		this.gridHeight = newHeight;
		this.pixelData = newPixelData;
		history.clear(); // Resizing invalidates history indices
		sfx.playStitch();
	}

	flipLinen(axis: 'horizontal' | 'vertical') {
		const newPixelData = [...this.pixelData];
		if (axis === 'horizontal') {
			for (let y = 0; y < this.gridHeight; y++) {
				const row = this.pixelData.slice(y * this.gridWidth, (y + 1) * this.gridWidth);
				row.reverse();
				for (let x = 0; x < this.gridWidth; x++) {
					newPixelData[y * this.gridWidth + x] = row[x];
				}
			}
		} else {
			for (let y = 0; y < this.gridHeight; y++) {
				for (let x = 0; x < this.gridWidth; x++) {
					const oldIdx = y * this.gridWidth + x;
					const newIdx = (this.gridHeight - 1 - y) * this.gridWidth + x;
					newPixelData[newIdx] = this.pixelData[oldIdx];
				}
			}
		}
		this.pixelData = newPixelData;
		history.clear();
		sfx.playStitch();
	}

	rotateLinen() {
		// Only supports square rotation for now to avoid dimension complexity
		if (this.gridWidth !== this.gridHeight) return;

		const newPixelData = Array(this.gridWidth * this.gridHeight).fill('#eee8d5');
		for (let y = 0; y < this.gridHeight; y++) {
			for (let x = 0; x < this.gridWidth; x++) {
				const oldIdx = y * this.gridWidth + x;
				const newIdx = x * this.gridWidth + (this.gridHeight - 1 - y);
				newPixelData[newIdx] = this.pixelData[oldIdx];
			}
		}
		this.pixelData = newPixelData;
		history.clear();
		sfx.playStitch();
	}

	// --- Clipboard & Pattern Manipulation ---

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
				data.push(this.pixelData[y * this.gridWidth + x]);
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
				const idx = y * this.gridWidth + x;
				this.pixelData[idx] = '#eee8d5';
			}
		}
		sfx.playUnstitch();
	}

	pasteSelection() {
		if (!this.clipboard) return;

		for (let y = 0; y < this.clipboard.height; y++) {
			for (let x = 0; x < this.clipboard.width; x++) {
				const targetX = this.cursorPos.x + x;
				const targetY = this.cursorPos.y + y;

				if (targetX < this.gridWidth && targetY < this.gridHeight) {
					const targetIdx = targetY * this.gridWidth + targetX;
					const sourceIdx = y * this.clipboard.width + x;
					this.pixelData[targetIdx] = this.clipboard.data[sourceIdx];
				}
			}
		}
		sfx.playStitch();
	}
}

export const editor = new EditorState();
