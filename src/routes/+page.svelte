<script lang="ts">
	import { editor } from '$lib/state/editor.svelte';
	import { ExportEngine } from '$lib/engine/export';
	import { shortcuts } from '$lib/engine/shortcuts';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import ExportModal from '$lib/components/ExportModal.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import HelpModal from '$lib/components/HelpModal.svelte';
	import SplashScreen from '$lib/components/SplashScreen.svelte';
	import Canvas from '$lib/components/Canvas.svelte';
	import { onMount } from 'svelte';

	let showExportModal = $state(false);

	async function exportImage(
		format: 'svg' | 'png',
		scale: number = 10,
		bgColor: string | 'transparent' = 'transparent'
	) {
		if (format === 'svg') {
			const svg = ExportEngine.toSVG(editor.gridWidth, editor.gridHeight, editor.pixelData, bgColor);
			const blob = new Blob([svg], { type: 'image/svg+xml' });
			const url = URL.createObjectURL(blob);
			download(url, 'stitch-art.svg');
		} else {
			const dataUrl = await ExportEngine.toPNG(
				editor.gridWidth,
				editor.gridHeight,
				editor.pixelData,
				scale,
				bgColor
			);
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
		if (!editor.isAppReady) return;

		// 1. Context Check: Ignore global shortcuts if an input is focused
		if (
			e.target instanceof HTMLInputElement ||
			e.target instanceof HTMLTextAreaElement ||
			(e.target as HTMLElement).isContentEditable
		) {
			if (e.key === 'Escape') {
				editor.handleEscape();
			}
			return;
		}

		// 2. State Sync: Always update modifier states for mode detection
		editor.isShiftPressed = e.shiftKey;
		editor.isCtrlPressed = e.ctrlKey || e.metaKey;
		editor.isAltPressed = e.altKey;

		// 3. Selection Start: Trigger block mode initialization
		if (editor.isBlockMode && !editor.selectionStart) {
			editor.startSelection();
		}

		// Handle F1 specifically for Help
		if (e.key === 'F1') {
			e.preventDefault();
			editor.showHelp = !editor.showHelp;
			return;
		}

		// 4. Priority Engine: Find the most specific shortcut match
		const action = shortcuts.getBestMatch(e);

		if (action) {
			// Prevent default for matched studio actions
			if (!['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(action)) {
				e.preventDefault();
			}

			switch (action) {
				case 'UP':
					return editor.moveCursor(0, -1);
				case 'DOWN':
					return editor.moveCursor(0, 1);
				case 'LEFT':
					return editor.moveCursor(-1, 0);
				case 'RIGHT':
					return editor.moveCursor(1, 0);
				case 'ESCAPE':
					return editor.handleEscape();
				case 'COMMAND_PALETTE':
					return (editor.showCommandPalette = !editor.showCommandPalette);
				case 'COLOR_PICKER':
					return (editor.showColorPicker = !editor.showColorPicker);
				case 'EXPORT':
					return (showExportModal = true);
				case 'STITCH':
					return editor.stitch();
				case 'UNSTITCH':
				case 'UNSTITCH_MOD':
					return editor.unstitch();
				case 'EYEDROPPER':
					return editor.pickColor();
				case 'CLEAR_LINEN':
					return editor.clearCanvas();
				case 'UNDO':
					return editor.undo();
				case 'REDO':
					return editor.redo();
				case 'ZOOM_IN':
					return editor.setZoom(0.1);
				case 'ZOOM_OUT':
					return editor.setZoom(-0.1);
				case 'RESET_ZOOM':
					return editor.resetZoom();
				case 'TOGGLE_MUTE':
					return editor.toggleMute();
				default:
					if (action.startsWith('SELECT_')) {
						const num = parseInt(action.split('_')[1]);
						return editor.selectPalette(num === 0 ? 9 : num - 1);
					}
			}
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		const wasBlockMode = editor.isBlockMode;

		if (e.key === 'Shift') editor.isShiftPressed = false;
		if (e.key === 'Control' || e.key === 'Meta') editor.isCtrlPressed = false;
		if (e.key === 'Alt') editor.isAltPressed = false;

		if (wasBlockMode && !editor.isBlockMode) {
			editor.commitSelection();
		}
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
	});
</script>

<SplashScreen />

{#if editor.showHelp}
	<HelpModal />
{/if}

{#if editor.showCommandPalette}
	<CommandPalette />
{/if}

{#if editor.showColorPicker}
	<ColorPicker bind:value={editor.activeColor} onClose={() => (editor.showColorPicker = false)} />
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
			title="Natural Dye Basin (Ctrl + P)"
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
					{#if editor.isBlockMode}
						✨ Block Looming
					{:else}
						{editor.isCtrlPressed ? '✨ Unravelling' : '🧵 Threading'}
					{/if}
				</div>
			{:else}
				<div class="status-tag font-serif italic opacity-60">Studio Ready</div>
			{/if}
		</div>
	</div>
</div>