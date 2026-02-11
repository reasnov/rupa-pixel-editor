<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { onMount } from 'svelte';

	interface Command {
		id: string;
		label: string;
		shortcut: string;
		action: () => void;
	}

	const commands: Command[] = [
		{ id: 'export-png', label: 'Export: PNG Image', shortcut: 'Ctrl+E', action: () => { /* Logic in +page.svelte */ } },
		{ id: 'export-svg', label: 'Export: SVG Vector', shortcut: '', action: () => { /* Logic in +page.svelte */ } },
		{ id: 'reset-zoom', label: 'View: Reset Loom Zoom', shortcut: 'Ctrl+0', action: () => editor.resetZoom() },
		{ id: 'open-dye-basin', label: 'Color: Open Natural Dye Basin', shortcut: 'Ctrl+P', action: () => editor.showColorPicker = true },
		{ id: 'undo', label: 'Edit: Undo Last Stitch', shortcut: 'Ctrl+Z', action: () => editor.undo() },
		{ id: 'redo', label: 'Edit: Redo Last Stitch', shortcut: 'Ctrl+Y', action: () => editor.redo() },
		{ id: 'clear-linen', label: 'Project: Clear the Linen', shortcut: '', action: () => {
			if (confirm('Are you sure you want to unravel the entire project?')) {
				editor.pixelData = editor.pixelData.map(() => '#eee8d5');
			}
		}}
	];

	let searchQuery = $state('');
	let selectedIndex = $state(0);
	let inputElement: HTMLInputElement;

	let filteredCommands = $derived(
		commands.filter(cmd => 
			cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function executeCommand(cmd: Command) {
		cmd.action();
		if (cmd.id.includes('export')) {
			window.dispatchEvent(new CustomEvent('app:execute-command', { detail: cmd.id }));
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
		} else if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	}

	function close() {
		editor.showCommandPalette = false;
	}

	onMount(() => {
		inputElement.focus();
	});
</script>

<div 
	class="fixed inset-0 z-[1000] flex items-start justify-center pt-32 bg-black/10 backdrop-blur-sm"
	onmousedown={(e) => (e.target as HTMLElement).id === 'palette-overlay' && close()}
	id="palette-overlay"
>
	<div 
		class="bg-[#fdf6e3] w-[500px] rounded-3xl border-8 border-white shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/5"
	>
		<!-- Search Input -->
		<div class="p-6 border-b border-studio-text/5 bg-white/30">
			<div class="flex items-center gap-4">
				<span class="text-xl opacity-20 italic font-serif">📖</span>
				<input 
					bind:this={inputElement}
					bind:value={searchQuery}
					onkeydown={handleKeyDown}
					placeholder="Search the Pattern Book..."
					class="bg-transparent w-full outline-none font-serif italic text-lg text-studio-text placeholder:opacity-30"
				/>
			</div>
		</div>

		<!-- Command List -->
		<div class="max-h-[400px] overflow-y-auto p-2">
			{#if filteredCommands.length === 0}
				<div class="p-8 text-center text-xs opacity-30 italic font-serif">No such pattern found in the studio...</div>
			{:else}
				{#each filteredCommands as cmd, i}
					<button 
						class="w-full text-left px-6 py-4 rounded-2xl flex justify-between items-center transition-all {i === selectedIndex ? 'bg-studio-warm text-white shadow-md scale-[1.02]' : 'hover:bg-studio-text/5'}"
						onclick={() => executeCommand(cmd)}
					>
						<span class="font-serif italic">{cmd.label}</span>
						{#if cmd.shortcut}
							<span class="font-mono text-[10px] opacity-50 px-2 py-1 rounded bg-black/10">{cmd.shortcut}</span>
						{/if}
					</button>
				{/each}
			{/if}
		</div>

		<!-- Footer -->
		<div class="p-4 bg-studio-text/[0.02] text-center border-t border-studio-text/5">
			<span class="text-[9px] uppercase tracking-widest font-black opacity-20">Artisan's Pattern Book</span>
		</div>
	</div>
</div>
