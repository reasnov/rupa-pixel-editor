<script lang="ts">
	import { editor } from '$lib/state/editor.svelte';
	import { ExportEngine } from '$lib/engine/export';
	import { loompad } from '$lib/engine/loompad';
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
			const svg = ExportEngine.toSVG(
				editor.gridWidth,
				editor.gridHeight,
				editor.pixelData,
				bgColor
			);
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

		// Reset inactivity timer on any key press
		editor.resetInactivityTimer();

		// 1. Context Check: Ignore global shortcuts if an input is focused
		if (
			e.target instanceof HTMLInputElement ||
			e.target instanceof HTMLTextAreaElement ||
			(e.target as HTMLElement).isContentEditable
		) {
			if (e.key === 'Escape') {
				editor.handleEscape();
				e.preventDefault();
			}
			return;
		}

		// 2. Weaver's Intent: Use LoomPad to unravel the user's intent
		const intent = loompad.getIntent(e, 'down');

		if (intent) {
			// Prevent system defaults for matched studio intents
			if (!intent.startsWith('MOVE_')) {
				e.preventDefault();
			}

			switch (intent) {
				case 'MOVE_UP':
					return editor.moveCursor(0, -1);
				case 'MOVE_DOWN':
					return editor.moveCursor(0, 1);
				case 'MOVE_LEFT':
					return editor.moveCursor(-1, 0);
				case 'MOVE_RIGHT':
					return editor.moveCursor(1, 0);
				case 'FLOW_STITCH':
					return (editor.isCtrlPressed = true);
				case 'FLOW_UNSTITCH':
					editor.isAltPressed = true;
					return (editor.isSelecting = false);
				case 'FLOW_SELECT':
					editor.isShiftPressed = true;
					if (!editor.isSelecting) {
						editor.isSelecting = true;
						editor.startSelection();
					}
					return;
				case 'ESCAPE':
					return editor.handleEscape();
				case 'OPEN_PALETTE':
					return (editor.showCommandPalette = !editor.showCommandPalette);
				case 'OPEN_DYES':
					return (editor.showColorPicker = !editor.showColorPicker);
				case 'OPEN_EXPORT':
					return (showExportModal = true);
				case 'STITCH':
					if (editor.isSelecting) {
						return editor.commitSelection();
					}
					return editor.stitch();
				case 'UNSTITCH':
					return editor.unstitch();
				case 'PICK_DYE':
					return editor.pickColor();
				case 'COPY':
					return editor.copySelection();
				case 'CUT':
					return editor.cutSelection();
				case 'PASTE':
					return editor.pasteSelection();
				case 'FLIP_H':
					return editor.flipLinen('horizontal');
				case 'FLIP_V':
					return editor.flipLinen('vertical');
				case 'ROTATE':
					return editor.rotateLinen();
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
					if (intent.startsWith('SELECT_DYE_')) {
						const num = parseInt(intent.split('_')[2]);
						return editor.selectPalette(num === 0 ? 9 : num - 1);
					}
			}
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		const intent = loompad.getIntent(e, 'up');

		if (intent === 'FLOW_STITCH') {
			editor.isCtrlPressed = false;
		} else if (intent === 'FLOW_UNSTITCH') {
			editor.isAltPressed = false;
		} else if (intent === 'FLOW_SELECT') {
			editor.isShiftPressed = false;
			editor.isSelecting = false;
			editor.selectionStart = null;
			editor.selectionEnd = null;
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

		// 10-minute Artisan Auto-Backup
		const backupInterval = setInterval(() => {
			editor.backupProject();
		}, 10 * 60 * 1000);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('app:execute-command', handleCommand);
			window.removeEventListener('app:close-export', handleCloseExport);
			clearInterval(backupInterval);
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
		<span class="font-tiny5 text-4xl text-brand opacity-90 drop-shadow-sm">Rupa</span>
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
					? 'scale-110 border-brand shadow-md ring-2 ring-white'
					: 'border-white opacity-70 hover:scale-105 hover:opacity-100'}"
				style="background-color: {color};"
				onclick={() => editor.selectPalette(i)}
				aria-label="Select dye {i + 1}"
			></button>
		{/each}

		<div class="mx-auto my-1 h-px w-4 bg-studio-text/10"></div>

		<button
			class="via-sage-300 via-sage-300 h-7 w-7 rounded-full border-2 border-dashed border-brand/40 bg-gradient-to-tr from-rose-300 to-sky-300 shadow-sm transition-all hover:scale-110 hover:border-brand"
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
								? 'border-brand ring-1 ring-brand/30'
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
				class="h-10 w-10 overflow-hidden rounded-xl border-4 border-white bg-white p-0.5 shadow-lg ring-1 ring-brand/10"
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
				<span>{editor.isMuted ? '🔇' : '🔊'}</span>
				{editor.isMuted ? 'Unmute' : 'Mute'}
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
				<div class="status-tag font-serif italic opacity-60">
					Studio Ready <span class="ml-2 border-l border-studio-text/20 pl-2 not-italic">v{editor.version}</span>
				</div>
			{/if}
		</div>
	</div>
</div>
