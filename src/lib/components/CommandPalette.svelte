<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { loompad } from '../engine/loompad';
	import { onMount } from 'svelte';

	interface Command {
		id: string;
		label: string;
		shortcut: string;
		action: () => void;
	}

	const commands: Command[] = [
		{
			id: 'open-help',
			label: "Help: Open Artisan's Guide",
			shortcut: 'F1',
			action: () => (editor.showHelp = true)
		},
		{
			id: 'open-export',
			label: 'Export: Open Export Window',
			shortcut: loompad.getLabel('OPEN_EXPORT'),
			action: () => {}
		},
		{
			id: 'save-project',
			label: 'File: Save Artisan Project (.rupa)',
			shortcut: loompad.getLabel('SAVE'),
			action: () => editor.saveProject()
		},
		{
			id: 'open-project',
			label: 'File: Open Artisan Project (.rupa)',
			shortcut: loompad.getLabel('OPEN'),
			action: () => editor.loadProject()
		},
		{
			id: 'open-dye-basin',
			label: 'Color: Open Color Wheel (Dye Basin)',
			shortcut: loompad.getLabel('OPEN_DYES'),
			action: () => (editor.showColorPicker = true)
		},
		{
			id: 'toggle-mute',
			label: 'Studio: Toggle Audio Feedback (Mute/Unmute)',
			shortcut: loompad.getLabel('TOGGLE_MUTE'),
			action: () => editor.toggleMute()
		},
		{
			id: 'pick-dye',
			label: 'Color: Eyedropper (Pick Dye from Canvas)',
			shortcut: loompad.getLabel('PICK_DYE'),
			action: () => editor.pickColor()
		},
		{
			id: 'reset-zoom',
			label: 'View: Reset Loom Zoom',
			shortcut: loompad.getLabel('RESET_ZOOM'),
			action: () => editor.resetZoom()
		},
		{
			id: 'undo',
			label: 'Edit: Undo Last Stitch',
			shortcut: loompad.getLabel('UNDO'),
			action: () => editor.undo()
		},
		{
			id: 'redo',
			label: 'Edit: Redo Last Stitch',
			shortcut: loompad.getLabel('REDO'),
			action: () => editor.redo()
		},
		{
			id: 'clear-linen',
			label: 'Project: Clear the Linen (Full Reset)',
			shortcut: loompad.getLabel('CLEAR_LINEN'),
			action: () => editor.clearCanvas()
		},
		{
			id: 'copy-pattern',
			label: 'Selection: Copy Pattern to Clipboard',
			shortcut: loompad.getLabel('COPY'),
			action: () => editor.copySelection()
		},
		{
			id: 'cut-pattern',
			label: 'Selection: Cut Pattern (Move source to clipboard)',
			shortcut: loompad.getLabel('CUT'),
			action: () => editor.cutSelection()
		},
		{
			id: 'paste-pattern',
			label: 'Selection: Paste Pattern from Clipboard',
			shortcut: loompad.getLabel('PASTE'),
			action: () => editor.pasteSelection()
		},
		{
			id: 'flip-h',
			label: 'Transform: Flip Linen Horizontally',
			shortcut: loompad.getLabel('FLIP_H'),
			action: () => editor.flipLinen('horizontal')
		},
		{
			id: 'flip-v',
			label: 'Transform: Flip Linen Vertically',
			shortcut: loompad.getLabel('FLIP_V'),
			action: () => editor.flipLinen('vertical')
		},
		{
			id: 'rotate-linen',
			label: 'Transform: Rotate Linen 90° Clockwise',
			shortcut: loompad.getLabel('ROTATE'),
			action: () => editor.rotateLinen()
		}
	];

	let searchQuery = $state('');
	let selectedIndex = $state(0);
	let inputElement: HTMLInputElement;
	let listContainer: HTMLDivElement;

	let filteredCommands = $derived(
		commands.filter((cmd) => cmd.label.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	// Reset index when search changes
	$effect(() => {
		searchQuery;
		selectedIndex = 0;
	});

	// Auto-scroll selected item into view
	$effect(() => {
		if (listContainer && selectedIndex >= 0) {
			const selectedEl = listContainer.children[selectedIndex] as HTMLElement;
			if (selectedEl) {
				selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		}
	});

	function executeCommand(cmd: Command) {
		cmd.action();
		if (cmd.id === 'open-export') {
			window.dispatchEvent(new CustomEvent('app:execute-command', { detail: 'open-export' }));
		}
		close();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % filteredCommands.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (filteredCommands[selectedIndex]) {
				executeCommand(filteredCommands[selectedIndex]);
			}
		}
	}

	function close() {
		editor.showCommandPalette = false;
	}

	// Register Escape listener
	$effect(() => {
		editor.pushEscapeAction(close);
		return () => editor.popEscapeAction(close);
	});

	onMount(() => {
		inputElement.focus();
	});
</script>

<div
	class="fixed inset-0 z-[1000] flex items-start justify-center bg-black/10 pt-32 backdrop-blur-sm"
	onmousedown={(e) => (e.target as HTMLElement).id === 'palette-overlay' && close()}
	id="palette-overlay"
>
	<div
		class="flex w-[500px] flex-col overflow-hidden rounded-3xl border-8 border-white bg-[#fdf6e3] shadow-2xl ring-1 ring-black/5"
	>
		<!-- Search Input -->
		<div class="border-b border-studio-text/5 bg-white/30 p-6">
			<div class="flex items-center gap-4">
				<span class="font-serif text-xl italic opacity-20">📖</span>
				<input
					bind:this={inputElement}
					bind:value={searchQuery}
					onkeydown={handleKeyDown}
					placeholder="Search the Pattern Book..."
					class="w-full bg-transparent font-serif text-lg text-studio-text italic outline-none placeholder:opacity-30"
				/>
			</div>
		</div>

		<!-- Command List -->
		<div class="max-h-[400px] overflow-y-auto p-2" bind:this={listContainer}>
			{#if filteredCommands.length === 0}
				<div class="p-8 text-center font-serif text-xs italic opacity-30">
					No such pattern found in the studio...
				</div>
			{:else}
				{#each filteredCommands as cmd, i}
					<button
						class="flex w-full items-center justify-between rounded-2xl px-6 py-4 text-left transition-all {i ===
						selectedIndex
							? 'scale-[1.02] bg-brand text-white shadow-md'
							: 'hover:bg-studio-text/5'}"
						onclick={() => executeCommand(cmd)}
					>
						<span class="font-serif italic">{cmd.label}</span>
						{#if cmd.shortcut}
							<span class="rounded bg-black/10 px-2 py-1 font-mono text-[10px] opacity-50"
								>{cmd.shortcut}</span
							>
						{/if}
					</button>
				{/each}
			{/if}
		</div>

		<!-- Footer -->
		<div class="border-t border-studio-text/5 bg-studio-text/[0.02] p-4 text-center">
			<span class="text-[9px] font-black tracking-widest uppercase opacity-20"
				>Artisan's Pattern Book</span
			>
		</div>
	</div>
</div>
