<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { shortcuts } from '../engine/shortcuts';
	import { onMount } from 'svelte';

	function close() {
		editor.showHelp = false;
	}

	// Register Escape listener
	$effect(() => {
		editor.pushEscapeAction(close);
		return () => editor.popEscapeAction(close);
	});

	const helpData = [
		{
			category: 'Artisan Navigation',
			items: [
				{ label: 'Move the Needle', keys: 'Arrow Keys' },
				{ label: 'Loom Zoom In/Out', keys: '+ / -' },
				{ label: 'Reset View', keys: 'Ctrl + 0' }
			]
		},
		{
			category: 'Digital Stitching',
			items: [
				{ label: 'Place Stitch', keys: 'Space' },
				{ label: 'Unstitch (Erase)', keys: 'Backspace / Del' },
				{ label: 'Threading (Flow Mode)', keys: 'Hold Ctrl + Arrows' },
				{ label: 'Unravelling (Erase Flow)', keys: 'Hold Alt + Arrows' },
				{ label: 'Block Looming (2D Selection)', keys: 'Hold Shift + Arrows' }
			]
		},
		{
			category: 'Studio Tools',
			items: [
				{ label: 'Pattern Book (Catalog)', keys: 'Ctrl + K' },
				{ label: 'Natural Dye Basin (Color)', keys: 'Ctrl + P' },
				{ label: 'Pick Dye (Eyedropper)', keys: 'I or Alt + Space' },
				{ label: 'Finish & Export', keys: 'Ctrl + E' },
				{ label: 'Undo / Redo', keys: 'Ctrl + Z / Ctrl + Y' },
				{ label: 'Toggle Studio Sounds', keys: 'Ctrl + M' }
			]
		}
	];
</script>

<div
	class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/20 backdrop-blur-sm"
	onmousedown={(e) => (e.target as HTMLElement).id === 'help-overlay' && close()}
	id="help-overlay"
>
	<div
		class="flex max-h-[85vh] w-[600px] flex-col gap-8 overflow-y-auto rounded-[3rem] border-8 border-white bg-[#fdf6e3] p-10 shadow-2xl ring-1 ring-black/5"
	>
		<div class="flex items-center justify-between">
			<div class="flex flex-col">
				<span class="font-serif text-3xl text-brand italic">Artisan's Guide</span>
				<span class="font-serif text-[10px] font-bold tracking-[0.2em] uppercase opacity-30"
					>Mastering the Digital Loom</span
				>
			</div>
			<button
				onclick={close}
				class="rounded-full border border-black/5 bg-white/50 px-4 py-2 text-[10px] font-bold tracking-widest uppercase opacity-40 transition-all hover:opacity-100"
				>Got it</button
			>
		</div>

		<div class="grid grid-cols-1 gap-8">
			{#each helpData as cat}
				<div class="flex flex-col gap-4">
					<h3
						class="border-b border-studio-text/10 pb-2 font-serif text-xl text-studio-text italic"
					>
						{cat.category}
					</h3>
					<div class="grid grid-cols-1 gap-3">
						{#each cat.items as item}
							<div class="group flex items-center justify-between">
								<span
									class="font-serif text-sm italic opacity-70 transition-opacity group-hover:opacity-100"
									>{item.label}</span
								>
								<div class="flex gap-1">
									<kbd
										class="rounded-lg border-2 border-black/[0.03] bg-white px-3 py-1 font-mono text-[10px] text-brand shadow-sm"
										>{item.keys}</kbd
									>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-4 border-t border-studio-text/5 pt-6 text-center">
			<p class="font-serif text-xs italic opacity-30">
				"Every stitch is a story, every pixel a memory."
			</p>
		</div>
	</div>
</div>
