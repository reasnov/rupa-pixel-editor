<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
	import { pulse } from '../../engine/pulse.js';
	import { loompad } from '../../engine/loompad.svelte.js';
	import { fade, scale } from 'svelte/transition';
	import { onMount, untrack } from 'svelte';
	import CatalogAction from './CatalogAction.svelte';

	let { onClose = () => (atelier.studio.showPatternCatalog = false) } = $props<{
		onClose: () => void;
	}>();

	let searchQuery = $state('');
	let selectedIndex = $state(0);

	const actions = [
		{
			id: 'save-project',
			label: 'File: Open Archive Pattern Window',
			shortcut: loompad.getLabel('OPEN_ARCHIVE'),
			action: () => (atelier.showArchivePattern = true)
		},
		{
			id: 'open-project',
			label: 'File: Open Artisan Project (.rupa)',
			shortcut: loompad.getLabel('OPEN'),
			action: () => (atelier.studio.showArchivePattern = true)
		},
		{
			id: 'open-dye-basin',
			label: 'Color: Open Color Wheel (Dye Basin)',
			shortcut: loompad.getLabel('OPEN_DYES'),
			action: () => (atelier.showDyeBasin = true)
		},
		{
			id: 'open-audio-basin',
			label: 'Audio: Open Harmony & Atmosphere Tuning',
			shortcut: loompad.getLabel('OPEN_AUDIO'),
			action: () => (atelier.showAudioBasin = true)
		},
		{
			id: 'toggle-mute',
			label: 'Audio: Master Mute Toggle',
			shortcut: loompad.getLabel('TOGGLE_MUTE'),
			action: () => atelier.toggleMute()
		},
		{
			id: 'pick-dye',
			label: 'Color: Eyedropper (Pick Dye from Canvas)',
			shortcut: loompad.getLabel('PICK_DYE'),
			action: () => atelier.pickDye()
		},
		{
			id: 'soak-dye',
			label: 'Color: Dye Soak (Flood Fill connected area)',
			shortcut: loompad.getLabel('SOAK'),
			action: () => shuttle.dye.soak()
		},
		{
			id: 'bleach-fiber',
			label: 'Color: Fiber Bleach (Recolor all instances)',
			shortcut: loompad.getLabel('BLEACH'),
			action: () => shuttle.manipulation.bleach()
		},
		{
			id: 'spirit-pick',
			label: 'Selection: Spirit Pick (Magic Wand selection)',
			shortcut: loompad.getLabel('SPIRIT_PICK'),
			action: () => shuttle.selection.spiritPick()
		},
		{
			id: 'reset-zoom',
			label: 'View: Reset Loom Zoom',
			shortcut: loompad.getLabel('RESET_ZOOM'),
			action: () => atelier.resetZoom()
		},
		{
			id: 'goto',
			label: 'Navigation: Go to Coordinate (Direct Jump)',
			shortcut: loompad.getLabel('GOTO'),
			action: () => (atelier.showGoTo = true)
		},
		{
			id: 'undo',
			label: 'Edit: Undo Last Stitch',
			shortcut: loompad.getLabel('UNDO'),
			action: () => atelier.undo()
		},
		{
			id: 'redo',
			label: 'Edit: Redo Last Stitch',
			shortcut: loompad.getLabel('REDO'),
			action: () => atelier.redo()
		},
		{
			id: 'clear-linen',
			label: 'Project: Clear the Linen (Full Reset)',
			shortcut: loompad.getLabel('CLEAR_LINEN'),
			action: () => atelier.clearLinen()
		},
		{
			id: 'new-frame',
			label: 'Folio: Add New Frame (Canvas)',
			shortcut: loompad.getLabel('NEW_FRAME'),
			action: () => shuttle.folio.addFrame()
		},
		{
			id: 'duplicate-frame',
			label: 'Folio: Duplicate Current Frame',
			shortcut: loompad.getLabel('DUPLICATE_FRAME'),
			action: () => shuttle.folio.duplicateFrame(atelier.project.activeFrameIndex)
		},
		{
			id: 'next-frame',
			label: 'Folio: Turn to Next Page (Frame)',
			shortcut: loompad.getLabel('NEXT_FRAME'),
			action: () => shuttle.folio.nextFrame()
		},
		{
			id: 'toggle-playback',
			label: 'Kinetic: Toggle Animation Playback',
			shortcut: loompad.getLabel('PLAY_PULSE'),
			action: () => pulse.toggle()
		},
		{
			id: 'new-veil',
			label: 'Veils: Add New Veil (Layer)',
			shortcut: loompad.getLabel('NEW_VEIL'),
			action: () => shuttle.folio.addVeil()
		},
		{
			id: 'copy-pattern',
			label: 'Selection: Copy Pattern to Clipboard',
			shortcut: loompad.getLabel('COPY'),
			action: () => atelier.copySelection()
		},
		{
			id: 'cut-pattern',
			label: 'Selection: Cut Pattern (Move source to clipboard)',
			shortcut: loompad.getLabel('CUT'),
			action: () => atelier.cutSelection()
		},
		{
			id: 'paste-pattern',
			label: 'Selection: Paste Pattern from Clipboard',
			shortcut: loompad.getLabel('PASTE'),
			action: () => atelier.pasteSelection()
		},
		{
			id: 'flip-h',
			label: 'Transform: Flip Linen Horizontally',
			shortcut: loompad.getLabel('FLIP_H'),
			action: () => atelier.flipLinen('horizontal')
		},
		{
			id: 'flip-v',
			label: 'Transform: Flip Linen Vertically',
			shortcut: loompad.getLabel('FLIP_V'),
			action: () => atelier.flipLinen('vertical')
		},
		{
			id: 'rotate-linen',
			label: 'Transform: Rotate Linen 90° Clockwise',
			shortcut: loompad.getLabel('ROTATE'),
			action: () => atelier.rotateLinen()
		},
		{
			id: 'open-codex',
			label: "Help: Open The Artisan's Codex (User Guide)",
			shortcut: loompad.getLabel('OPEN_CODEX'),
			action: () => (atelier.showArtisanCodex = true)
		},
		{
			id: 'open-shortcuts',
			label: 'Help: Show Quick Shortcut Guide',
			shortcut: loompad.getLabel('OPEN_HELP'),
			action: () => (atelier.showArtisanGuide = true)
		}
	];

	let filteredActions = $derived(
		actions.filter((a) => a.label.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	$effect(() => {
		searchQuery;
		selectedIndex = 0;
	});

	$effect(() => {
		selectedIndex;
		filteredActions;
		const activeEl = document.querySelector('.artisan-action-btn.active');
		if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
	});

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % filteredActions.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = (selectedIndex - 1 + filteredActions.length) % filteredActions.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (filteredActions[selectedIndex]) {
				filteredActions[selectedIndex].action();
				onClose();
			}
		} else if (e.key === 'Escape') onClose();
	}

	onMount(() => document.getElementById('catalog-search')?.focus());

	// Register with Escape Stack
	$effect(() => {
		untrack(() => atelier.pushEscapeAction(onClose));
		return () => atelier.popEscapeAction(onClose);
	});
</script>

<div
	class="fixed inset-0 z-[1200] flex items-start justify-center bg-black/10 pt-[15vh] backdrop-blur-sm"
	onmousedown={(e) => e.target === e.currentTarget && onClose()}
	onkeydown={handleKey}
	role="button"
	tabindex="-1"
>
	<div
		transition:scale={{ duration: 150, start: 0.98 }}
		class="flex w-[600px] flex-col overflow-hidden rounded-xl border border-black/5 bg-[#fdf6e3]/95 shadow-2xl"
	>
		<div class="relative flex items-center border-b border-black/5 bg-white/40 p-6">
			<span class="mr-4 text-2xl opacity-40">📖</span>
			<input
				id="catalog-search"
				type="text"
				bind:value={searchQuery}
				placeholder="Search for a pattern or studio action..."
				class="w-full bg-transparent font-serif text-xl focus:outline-none"
			/>
		</div>
		<div class="custom-scrollbar max-h-[50vh] overflow-y-auto p-4">
			{#if filteredActions.length === 0}
				<div class="p-8 text-center font-serif text-sm italic opacity-40">
					No patterns found for "{searchQuery}"
				</div>
			{:else}
				<div class="flex flex-col gap-1">
					{#each filteredActions as action, i}
						<CatalogAction
							{action}
							isSelected={selectedIndex === i}
							onSelect={() => (selectedIndex = i)}
						/>
					{/each}
				</div>
			{/if}
		</div>
		<div class="flex items-center justify-between border-t border-black/5 bg-black/5 px-8 py-4">
			<span class="font-serif text-[9px] font-bold tracking-[0.2em] uppercase opacity-30"
				>Use Arrows to Navigate • Enter to Weave</span
			>
			<span class="font-serif text-[9px] font-bold tracking-[0.2em] uppercase opacity-30"
				>{filteredActions.length} Actions Available</span
			>
		</div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.05);
		border-radius: 10px;
	}
</style>
