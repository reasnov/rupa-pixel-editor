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
	exportScale = $state(10); // Default to 10x for a decent 320px size
	isShiftPressed = $state(false);
	isCtrlPressed = $state(false);

	// Universal Escape Stack
	private escapeStack: (() => void)[] = [];

	pushEscapeAction(fn: () => void) {
		this.escapeStack.push(fn);
	}

	popEscapeAction(fn: () => void) {
		this.escapeStack = this.escapeStack.filter(item => item !== fn);
	}

	handleEscape() {
		const lastAction = this.escapeStack.pop();
		if (lastAction) {
			lastAction();
			return true; // Action was handled
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
				// For 32: indices 0..15 -> -16..-1, indices 16..31 -> 1..16
				return pos < mid ? pos - mid : pos - mid + 1;
			} else {
				// For 33: indices 0..32 -> -16..0..16
				return pos - mid;
			}
		};

		return {
			x: calc(this.cursorPos.x, this.gridWidth),
			y: calc(this.cursorPos.y, this.gridHeight) * -1 // Invert Y for Cartesian feel (Up is positive)
		};
	});

	// Derived transform for adaptive viewport
	cameraTransform = $derived.by(() => {
		if (this.zoomLevel <= 1) {
			// Mode: Centered Canvas with Margin
			// No translation needed as flex centering handles the rest
			return `scale(${this.zoomLevel})`;
		} else {
			// Mode: Tracking Needle (Smooth Focus)
			const x = ((this.cursorPos.x + 0.5) / this.gridWidth) * 100;
			const y = ((this.cursorPos.y + 0.5) / this.gridHeight) * 100;

			// The transform moves the grid so the cursor stays at the viewport's center
			return `translate(calc(50% - ${x}%), calc(50% - ${y}%)) scale(${this.zoomLevel})`;
		}
	});

	constructor(width = 32, height = 32) {
		this.gridWidth = width;
		this.gridHeight = height;
		this.pixelData = Array(width * height).fill('#eee8d5'); // Soft Cream/Linen
	}

	setZoom(delta: number) {
		const newZoom = this.zoomLevel + delta;
		this.zoomLevel = Math.max(0.5, Math.min(5, Number(newZoom.toFixed(1))));
	}

	resetZoom() {
		this.zoomLevel = 1;
	}

	selectPalette(index: number) {
		if (index >= 0 && index < this.palette.length) {
			this.activeColor = this.palette[index];
		}
	}

	clearCanvas() {
		if (confirm('Are you sure you want to unravel the entire project?')) {
			this.pixelData = this.pixelData.map(() => '#eee8d5');
			sfx.playUnstitch();
		}
	}

	pickColor() {
		const index = this.cursorPos.y * this.gridWidth + this.cursorPos.x;
		const color = this.pixelData[index];
		if (color !== '#eee8d5') {
			this.activeColor = color;
			sfx.playStitch(); // Feedback for picking
		}
	}

	moveCursor(dx: number, dy: number) {
		const newX = Math.max(0, Math.min(this.gridWidth - 1, this.cursorPos.x + dx));
		const newY = Math.max(0, Math.min(this.gridHeight - 1, this.cursorPos.y + dy));

		if (newX !== this.cursorPos.x || newY !== this.cursorPos.y) {
			this.cursorPos = { x: newX, y: newY };
			sfx.playMove();

			if (this.isShiftPressed && this.isCtrlPressed) {
				this.unstitch();
			} else if (this.isShiftPressed) {
				this.stitch();
			}
		}
	}

	stitch() {
		const index = this.cursorPos.y * this.gridWidth + this.cursorPos.x;
		const oldColor = this.pixelData[index];
		if (oldColor !== this.activeColor) {
			history.push({ index, oldColor, newColor: this.activeColor });
			this.pixelData[index] = this.activeColor;
			sfx.playStitch();
		}
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
	}

	undo() {
		const action = history.undo();
		if (action) {
			this.pixelData[action.index] = action.oldColor;
			sfx.playUnstitch(); // Play a sound to indicate action
		}
	}

	redo() {
		const action = history.redo();
		if (action) {
			this.pixelData[action.index] = action.newColor;
			sfx.playStitch();
		}
	}

	setColor(color: ColorHex) {
		this.activeColor = color;
	}
}

export const editor = new EditorState();
