<script lang="ts">
	import { editor } from '$lib/state/editor.svelte';
	import { onMount } from 'svelte';

	function handleKeyDown(e: KeyboardEvent) {
		// Update modifier states
		editor.isShiftPressed = e.shiftKey;
		editor.isCtrlPressed = e.ctrlKey || e.metaKey;

		// Prevent default behavior for navigation and action keys
		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Backspace', 'Delete'].includes(e.key)) {
			e.preventDefault();
		}

		// Handle Deletion first (reliable alternatives)
		if (e.key === 'Backspace' || e.key === 'Delete') {
			editor.unstitch();
			return;
		}

		// Handle Undo/Redo
		if (editor.isCtrlPressed) {
			if (e.key.toLowerCase() === 'z') {
				if (e.shiftKey) {
					editor.redo();
				} else {
					editor.undo();
				}
				e.preventDefault();
				return;
			}
			if (e.key.toLowerCase() === 'y') {
				editor.redo();
				e.preventDefault();
				return;
			}
		}

		switch (e.code) {
			case 'ArrowUp':
			case 'KeyW': // Added back for flexibility, but primary is Arrows
				if (e.key === 'ArrowUp') editor.moveCursor(0, -1);
				break;
			case 'ArrowDown':
				if (e.key === 'ArrowDown') editor.moveCursor(0, 1);
				break;
			case 'ArrowLeft':
				if (e.key === 'ArrowLeft') editor.moveCursor(-1, 0);
				break;
			case 'ArrowRight':
				if (e.key === 'ArrowRight') editor.moveCursor(1, 0);
				break;
			case 'Space':
				if (e.ctrlKey || e.metaKey) {
					editor.unstitch();
				} else {
					editor.stitch();
				}
				break;
		}

		// Handle specific modifier keys if code doesn't catch them
		if (e.key === 'Shift') editor.isShiftPressed = true;
		if (e.key === 'Control' || e.key === 'Meta') editor.isCtrlPressed = true;
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key === 'Shift') {
			editor.isShiftPressed = false;
		}
		if (e.key === 'Control' || e.key === 'Meta') {
			editor.isCtrlPressed = false;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	});
</script>

<div class="flex flex-1 items-center justify-center p-8">
	<div
		class="grid gap-px border border-grid-border bg-grid-border"
		style="grid-template-columns: repeat({editor.gridWidth}, minmax(0, 1fr)); width: min(80vh, 80vw); aspect-ratio: {editor.gridWidth}/{editor.gridHeight};"
	>
		{#each editor.pixelData as color, i (i)}
			{@const x = i % editor.gridWidth}
			{@const y = Math.floor(i / editor.gridWidth)}
			{@const isActive = editor.cursorPos.x === x && editor.cursorPos.y === y}
			<div
				class="relative h-full w-full transition-colors duration-75"
				style="background-color: {color};"
			>
				{#if isActive}
					<div class="absolute -inset-[2px] cursor-retro z-10">
						<div class="absolute inset-[2px]" style="background-color: {color};"></div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<div class="fixed bottom-4 left-4 p-4 bg-black/50 backdrop-blur rounded text-xs font-mono">
	<div>Cursor: {editor.cursorPos.x}, {editor.cursorPos.y}</div>
	<div>Color: {editor.activeColor}</div>
	<div>Modifier: {editor.isCtrlPressed ? 'CTRL ' : ''}{editor.isShiftPressed ? 'SHIFT' : ''}</div>
	<div>Stitch-Flow: {editor.isShiftPressed && !editor.isCtrlPressed ? 'ON' : 'OFF'}</div>
	<div>Unstitch-Flow: {editor.isShiftPressed && editor.isCtrlPressed ? 'ON' : 'OFF'}</div>
</div>