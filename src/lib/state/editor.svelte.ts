import { type ColorHex } from '../types/index';
import { sfx } from '../engine/audio';
import { history } from '../engine/history';

export class EditorState {
	gridWidth = $state(32);
	gridHeight = $state(32);
	pixelData = $state<ColorHex[]>([]);
	cursorPos = $state({ x: 0, y: 0 });
	activeColor = $state<ColorHex>('#000000');
	isShiftPressed = $state(false);
	isCtrlPressed = $state(false);

	constructor(width = 32, height = 32) {
		this.gridWidth = width;
		this.gridHeight = height;
		this.pixelData = Array(width * height).fill('#ffffff');
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
		const emptyColor = '#ffffff';
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
