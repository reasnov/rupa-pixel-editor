<script lang="ts">
	import { editor } from '$lib/state/editor.svelte';
	import { ExportEngine } from '$lib/engine/export';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import Canvas from '$lib/components/Canvas.svelte';
	import { onMount } from 'svelte';

	async function exportImage(format: 'svg' | 'png') {
		if (format === 'svg') {
			const svg = ExportEngine.toSVG(editor.gridWidth, editor.gridHeight, editor.pixelData);
			const blob = new Blob([svg], { type: 'image/svg+xml' });
			const url = URL.createObjectURL(blob);
			download(url, 'stitch-art.svg');
		} else {
			const dataUrl = await ExportEngine.toPNG(editor.gridWidth, editor.gridHeight, editor.pixelData, 20);
			download(dataUrl, 'stitch-art.png');
		}
	}

	function download(url: string, filename: string) {
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
	}

	function handleKeyDown(e: KeyboardEvent) {
		editor.isShiftPressed = e.shiftKey;
		editor.isCtrlPressed = e.ctrlKey || e.metaKey;

		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Backspace', 'Delete', '+', '-', '=', '0', 'e'].includes(e.key.toLowerCase())) {
			e.preventDefault();
		}

		// Handle Export
		if (editor.isCtrlPressed && e.key.toLowerCase() === 'e') {
			exportImage('png');
			return;
		}

		// Handle Color Picker
		if (editor.isCtrlPressed && e.key.toLowerCase() === 'p') {
			editor.showColorPicker = !editor.showColorPicker;
			return;
		}

		// Handle Command Palette
		if (editor.isCtrlPressed && e.key.toLowerCase() === 'k') {
			editor.showCommandPalette = !editor.showCommandPalette;
			return;
		}

		// Handle Deletion
		if (e.key === 'Backspace' || e.key === 'Delete') {
			editor.unstitch();
			return;
		}

		// Handle Zoom
		if (e.key === '+' || e.key === '=') {
			editor.setZoom(0.1);
			return;
		}
		if (e.key === '-') {
			editor.setZoom(-0.1);
			return;
		}
		if (e.key === '0' && editor.isCtrlPressed) {
			editor.resetZoom();
			return;
		}

		// Handle Palette Selection (1-9, 0)
		if (/^[0-9]$/.test(e.key) && !editor.isCtrlPressed) {
			const index = e.key === '0' ? 9 : parseInt(e.key) - 1;
			editor.selectPalette(index);
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
				editor.moveCursor(0, -1);
				break;
			case 'ArrowDown':
				editor.moveCursor(0, 1);
				break;
			case 'ArrowLeft':
				editor.moveCursor(-1, 0);
				break;
			case 'ArrowRight':
				editor.moveCursor(1, 0);
				break;
			case 'Space':
				if (e.ctrlKey || e.metaKey) {
					editor.unstitch();
				} else {
					editor.stitch();
				}
				break;
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key === 'Shift') editor.isShiftPressed = false;
		if (e.key === 'Control' || e.key === 'Meta') editor.isCtrlPressed = false;
	}

	onMount(() => {
		const handleCommand = (e: any) => {
			if (e.detail === 'export-png') exportImage('png');
			if (e.detail === 'export-svg') exportImage('svg');
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('app:execute-command', handleCommand);
		
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('app:execute-command', handleCommand);
		};
	});
</script>

{#if editor.showCommandPalette}
	<CommandPalette />
{/if}

<!-- Top Whimsical HUD -->
<div class="fixed top-0 left-0 w-full p-6 flex justify-between items-center hud-panel z-50 rounded-b-3xl">
	<div class="flex items-baseline gap-6">
		<div class="flex flex-col">
			<span class="text-3xl font-serif italic text-studio-warm">Rupa</span>
			<span class="text-[9px] uppercase tracking-[0.2em] opacity-40 font-bold font-serif">The Weaver's Studio</span>
		</div>

		<!-- Studio Tools -->
		<div class="flex gap-2 ml-4">
			<button class="artisan-tool-btn" onclick={() => editor.showCommandPalette = true} title="Pattern Book (Ctrl+K)">
				<span>📖</span> Catalog
			</button>
			<button class="artisan-tool-btn" onclick={() => exportImage('png')} title="Export Project (Ctrl+E)">
				<span>🧺</span> Export
			</button>
			<button class="artisan-tool-btn" onclick={() => editor.resetZoom()} title="Reset View (Ctrl+0)">
				<span>🌿</span> Reset
			</button>
		</div>
	</div>
	
	<!-- Palette Bar -->
	<div class="flex gap-2 bg-white/50 p-1.5 rounded-full border border-studio-warm/10 shadow-inner">
		{#each editor.palette as color, i}
			<button 
				class="h-6 w-6 rounded-full border-2 transition-all {editor.activeColor === color ? 'border-studio-warm scale-110 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}"
				style="background-color: {color};"
				onclick={() => editor.selectPalette(i)}
				aria-label="Select dye {i + 1}"
			></button>
		{/each}
		
		<div class="w-px h-6 bg-studio-text/10 mx-1"></div>

		<!-- Custom Color Picker Tile -->
		<button 
			class="h-6 w-6 rounded-full border-2 border-dashed border-studio-warm/40 bg-gradient-to-tr from-rose-300 via-sage-300 to-sky-300 transition-all hover:scale-110 hover:border-studio-warm"
			onclick={() => editor.showColorPicker = true}
			title="Natural Dye Basin (Ctrl + P)"
		></button>
	</div>

	<div class="flex items-center gap-6">
		<div class="flex flex-col items-end">
			<span class="text-[9px] uppercase opacity-40 font-bold">Needle Position</span>
			<span class="font-mono text-xs text-studio-text/60">X:{editor.cursorPos.x} Y:{editor.cursorPos.y}</span>
		</div>
		<div class="h-10 w-10 rounded-full border-2 border-white shadow-md p-1 bg-white ring-1 ring-studio-warm/20">
			<div class="h-full w-full rounded-full" style="background-color: {editor.activeColor};"></div>
		</div>
	</div>
</div>

{#if editor.showColorPicker}
	<ColorPicker />
{/if}

<!-- The Window Layer (Studio Environment) -->
<div class="flex flex-1 items-center justify-center p-8 mt-24 overflow-hidden relative">
	
	<!-- The Frame Layer (The Artisan Loom) -->
	<div class="artisan-frame w-[75vw] h-[75vh] flex items-center justify-center overflow-hidden">
		
		<!-- The Canvas Layer (The Stitching Area) -->
		<Canvas />
		
	</div>
</div>

<!-- Bottom Status HUD -->
<div class="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-50">
	{#if editor.isShiftPressed}
		<div class="status-tag shadow-sm bg-studio-teal/10 text-studio-teal border border-studio-teal/20 animate-bounce">
			{editor.isCtrlPressed ? '✨ Unravelling Thread' : '🧵 Pulling the Thread'}
		</div>
	{/if}
	<div class="status-tag font-serif italic">
		Studio Ready
	</div>
</div>