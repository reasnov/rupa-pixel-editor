<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { shortcuts } from '../engine/shortcuts';
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
			label: 'Help: Open Artisan\'s Guide',
			shortcut: 'F1',
			action: () => (editor.showHelp = true)
		},
		{
			id: 'open-export',
			label: 'Export: Open Export Window',
			shortcut: shortcuts.getLabel('EXPORT'),
			action: () => {}
		},
		{
			id: 'open-dye-basin',
			label: 'Color: Open Color Wheel (Dye Basin)',
			shortcut: shortcuts.getLabel('COLOR_PICKER'),
			action: () => (editor.showColorPicker = true)
		},
		{
			id: 'toggle-mute',
			label: 'Studio: Toggle Audio Feedback (Mute/Unmute)',
			shortcut: shortcuts.getLabel('TOGGLE_MUTE'),
			action: () => editor.toggleMute()
		},
		{
			id: 'pick-dye',
			label: 'Color: Eyedropper (Pick Dye from Canvas)',
			shortcut: shortcuts.getLabel('EYEDROPPER'),
			action: () => editor.pickColor()
		},
		{
			id: 'reset-zoom',
			label: 'View: Reset Loom Zoom',
			shortcut: shortcuts.getLabel('RESET_ZOOM'),
			action: () => editor.resetZoom()
		},
		{
			id: 'undo',
			label: 'Edit: Undo Last Stitch',
			shortcut: shortcuts.getLabel('UNDO'),
			action: () => editor.undo()
		},
		{
			id: 'redo',
			label: 'Edit: Redo Last Stitch',
			shortcut: shortcuts.getLabel('REDO'),
			action: () => editor.redo()
		},
		{
			id: 'clear-linen',
			label: 'Project: Clear the Linen (Full Reset)',
			shortcut: shortcuts.getLabel('CLEAR_LINEN'),
			action: () => editor.clearCanvas()
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
							? 'scale-[1.02] bg-studio-warm text-white shadow-md'
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