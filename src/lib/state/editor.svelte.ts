import { type ColorHex } from '../types/index';
import { sfx } from '../engine/audio';
import { history } from '../engine/history';

export class EditorState {
	gridWidth = $state(32);
	gridHeight = $state(32);
	pixelData = $state<ColorHex[]>([]);
	cursorPos = $state({ x: 0, y: 0 });
	activeColor = $state<ColorHex>('#859900'); // Grass Green
	palette = $state<ColorHex[]>([
		'#859900', // Grass Green
		'#2aa198', // Soft Teal
		'#b58900', // Earthy Yellow
		'#cb4b16', // Burnt Orange
		'#dc322f', // Soft Red
		'#d33682', // Magenta
		'#6c71c4', // Violet
		'#268bd2', // Blue
		'#93a1a1', // Stone Gray
		'#586e75' // Dark Gray
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

	// Inactivity Logic
	private inactivityTimer: any = null;
	private readonly INACTIVITY_TIMEOUT = 30000; // 30 seconds

	// Selection/Block mode
	selectionStart = $state<{ x: number; y: number } | null>(null);
	selectionEnd = $state<{ x: number; y: number } | null>(null);

	isBlockMode = $derived(this.isShiftPressed && this.isAltPressed);

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
			const x = ((this.cursorPos.x + 0.5) / this.gridWidth) * 100;
			const y = ((this.cursorPos.y + 0.5) / this.gridHeight) * 100;
			return `translate(calc(50% - ${x}%), calc(50% - ${y}%)) scale(${this.zoomLevel})`;
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

			if (this.isBlockMode) {
				this.updateSelection();
			} else if (this.isShiftPressed && this.isCtrlPressed) {
				this.unstitch();
			} else if (this.isShiftPressed) {
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
}

export const editor = new EditorState();