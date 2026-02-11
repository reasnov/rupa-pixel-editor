<script lang="ts">
		import { editor } from '$lib/state/editor.svelte';
		import { ExportEngine } from '$lib/engine/export';
		import ColorPicker from '$lib/components/ColorPicker.svelte';
		import ExportModal from '$lib/components/ExportModal.svelte';
		import CommandPalette from '$lib/components/CommandPalette.svelte';
		import Canvas from '$lib/components/Canvas.svelte';
		import { onMount } from 'svelte';
	
		let showExportModal = $state(false);
	
		async function exportImage(format: 'svg' | 'png', scale: number = 10) {
			if (format === 'svg') {
				const svg = ExportEngine.toSVG(editor.gridWidth, editor.gridHeight, editor.pixelData);
				const blob = new Blob([svg], { type: 'image/svg+xml' });
				const url = URL.createObjectURL(blob);
				download(url, 'stitch-art.svg');
			} else {
				const dataUrl = await ExportEngine.toPNG(editor.gridWidth, editor.gridHeight, editor.pixelData, scale);
				download(dataUrl, 'stitch-art.png');
			}
			showExportModal = false;
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

		if (
			[
				'ArrowUp',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				' ',
				'Backspace',
				'Delete',
				'+',
				'-',
				'=',
				'0',
				'e',
				'Escape'
			].includes(e.key)
		) {
			e.preventDefault();
		}

		// Handle Escape
		if (e.key === 'Escape') {
			editor.handleEscape();
			return;
		}

		// Handle Export
		if (editor.isCtrlPressed && e.key.toLowerCase() === 'e') {
			showExportModal = true;
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

		// Handle Eyedropper
		if (e.key.toLowerCase() === 'i' || (e.key === ' ' && e.altKey)) {
			editor.pickColor();
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
						if (e.detail === 'open-export') showExportModal = true;
						if (e.detail === 'export-svg') exportImage('svg');
					};	
			const handleCloseExport = () => {
				showExportModal = false;
			};
	
			window.addEventListener('keydown', handleKeyDown);
			window.addEventListener('keyup', handleKeyUp);
			window.addEventListener('app:execute-command', handleCommand);
			window.addEventListener('app:close-export', handleCloseExport);
			
			return () => {
				window.removeEventListener('keydown', handleKeyDown);
				window.removeEventListener('keyup', handleKeyUp);
				window.removeEventListener('app:execute-command', handleCommand);
				window.removeEventListener('app:close-export', handleCloseExport);
			};
		});</script>

{#if editor.showCommandPalette}
	<CommandPalette />
{/if}

{#if editor.showColorPicker}
	<ColorPicker />
{/if}

{#if showExportModal}
	<ExportModal onExport={exportImage} />
{/if}

<!-- TOP BAR: Brand Identity -->
<div class="pointer-events-none fixed top-0 left-0 z-40 flex w-full justify-center p-6">
	<div class="flex flex-col items-center">
		<span class="font-serif text-4xl text-studio-warm italic opacity-90 drop-shadow-sm">Rupa</span>
		<span class="-mt-1 font-serif text-[9px] font-bold tracking-[0.3em] uppercase opacity-30"
			>The Weaver's Studio</span
		>
	</div>
</div>

<!-- LEFT SIDEBAR: Natural Dye Basin (Palette) -->
<div class="fixed top-1/2 left-0 z-50 -translate-y-1/2 p-2">
	<div class="artisan-panel side-panel-left flex flex-col gap-2 p-2">
		<span class="mb-1 text-center font-serif text-[7px] font-bold uppercase opacity-30">Dyes</span>
		{#each editor.palette as color, i}
			<button
				class="h-7 w-7 rounded-full border-2 transition-all {editor.activeColor === color
					? 'scale-110 border-studio-warm shadow-md ring-2 ring-white'
					: 'border-white opacity-70 hover:scale-105 hover:opacity-100'}"
				style="background-color: {color};"
				onclick={() => editor.selectPalette(i)}
				aria-label="Select dye {i + 1}"
			></button>
		{/each}

		<div class="mx-auto my-1 h-px w-4 bg-studio-text/10"></div>

		<button
			class="via-sage-300 h-7 w-7 rounded-full border-2 border-dashed border-studio-warm/40 bg-gradient-to-tr from-rose-300 to-sky-300 shadow-sm transition-all hover:scale-110 hover:border-studio-warm"
			onclick={() => (editor.showColorPicker = true)}
			title="Custom Color (Ctrl + P)"
		></button>
	</div>
</div>

<!-- RIGHT SIDEBAR: Loom Stats & Dynamic Dyes -->
<div class="fixed top-1/2 right-0 z-50 -translate-y-1/2 p-2">
	<div class="artisan-panel side-panel-right flex w-32 flex-col items-end gap-5 p-4">
		<!-- Needle Tracking -->
		<div class="flex w-full flex-col items-end">
			<span class="mb-1 font-serif text-[8px] font-bold uppercase opacity-40">Needle</span>
			<div
				class="flex w-full flex-col items-end rounded-lg border border-white/50 bg-black/5 p-1.5"
			>
				<span class="font-mono text-[10px] text-studio-text"
					>X:{editor.displayCoords.x} Y:{editor.displayCoords.y}</span
				>
				<span class="mt-0.5 font-mono text-[9px] opacity-40"
					>Z: {Math.round(editor.zoomLevel * 100)}%</span
				>
			</div>
		</div>

		<!-- Used Dyes History -->
		{#if editor.usedColors.length > 0}
			<div class="flex w-full flex-col items-end">
				<span class="mb-1.5 font-serif text-[8px] font-bold uppercase opacity-40">Canvas Dyes</span>
				<div class="grid grid-cols-3 gap-1.5 rounded-lg border border-white bg-white/30 p-1.5">
					{#each editor.usedColors as color}
						<button
							class="h-4 w-4 rounded border transition-all hover:scale-110 {editor.activeColor ===
							color
								? 'border-studio-warm ring-1 ring-studio-warm/30'
								: 'border-black/5 opacity-60'}"
							style="background-color: {color};"
							onclick={() => (editor.activeColor = color)}
							aria-label="Select used dye"
						></button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Active Payload Visual -->
		<div class="flex w-full flex-col items-end">
			<span class="mb-1 font-serif text-[8px] font-bold uppercase opacity-40">Dye</span>
			<div
				class="h-10 w-10 overflow-hidden rounded-xl border-4 border-white bg-white p-0.5 shadow-lg ring-1 ring-studio-warm/10"
			>
				<div class="h-full w-full rounded-lg" style="background-color: {editor.activeColor};"></div>
			</div>
		</div>
	</div>
</div>

<!-- CENTER STAGE: The Loom -->
<div class="relative flex h-screen flex-1 items-center justify-center overflow-hidden">
	<div class="artisan-frame flex h-[80vh] w-[82vw] items-center justify-center overflow-hidden">
		<Canvas />
	</div>
</div>

<!-- BOTTOM BAR: Studio Tools & Status -->
<div class="fixed bottom-0 left-0 z-50 flex w-full justify-center p-6">
	<div
		class="artisan-panel bottom-panel flex items-center gap-8 border-t-4 border-white px-8 py-4 shadow-xl"
	>
		<!-- Studio Tools -->
		<div class="flex gap-3">
			<button class="artisan-tool-btn" onclick={() => (editor.showCommandPalette = true)}>
				<span>📖</span> Catalog
			</button>
			<button class="artisan-tool-btn" onclick={() => (showExportModal = true)}>
				<span>🧺</span> Export
			</button>
			<button class="artisan-tool-btn" onclick={() => editor.clearCanvas()}>
				<span>🌿</span> Clear
			</button>
			<button class="artisan-tool-btn" onclick={() => editor.toggleMute()}>
				<span>{editor.isMuted ? '🔇' : '🔊'}</span> {editor.isMuted ? 'Unmute' : 'Mute'}
			</button>
		</div>

		<div class="h-8 w-px bg-studio-text/10"></div>

		<!-- Status Indicators -->
		<div class="flex gap-4">
			{#if editor.isShiftPressed}
				<div
					class="status-tag animate-pulse border-studio-teal/20 bg-studio-teal/10 text-studio-teal shadow-sm"
				>
					{editor.isCtrlPressed ? '✨ Unravelling' : '🧵 Threading'}
				</div>
			{:else}
				<div class="status-tag font-serif italic opacity-60">Studio Ready</div>
			{/if}
		</div>
	</div>
</div>
