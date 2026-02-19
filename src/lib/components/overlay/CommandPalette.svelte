<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { editor as engine } from '../../engine/editor.svelte.js';
	import { keyboard } from '../../engine/keyboard.svelte.js';
	import { scale } from 'svelte/transition';
	import { onMount, untrack } from 'svelte';
	import CatalogAction from './CatalogAction.svelte';

	let { onClose = () => (editor.showCommandPalette = false) } = $props<{
		onClose: () => void;
	}>();

	let searchQuery = $state('');
	let selectedIndex = $state(0);

	const actions = keyboard.getActions();

	const catalogActions = actions.map((a) => ({
		...a,
		id: a.intent.toLowerCase().replace(/_/g, '-'),
		action: () => {
			engine.handleIntent(a.intent);
		}
	}));

	let filteredActions = $derived(
		catalogActions.filter((a) => a.label.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	$effect(() => {
		searchQuery;
		selectedIndex = 0;
	});

	$effect(() => {
		selectedIndex;
		filteredActions;
		const activeEl = document.querySelector('.editor-action-btn.active');
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

	onMount(() => document.getElementById('palette-search')?.focus());
</script>

<div
	class="fixed inset-0 z-[1200] flex items-start justify-center bg-black/10 pt-[15vh] backdrop-blur-sm"
	onmousedown={(e) => e.target === e.currentTarget && onClose()}
	onkeydown={handleKey}
	role="presentation"
>
	<div
		transition:scale={{ duration: 150, start: 0.98 }}
		class="flex w-[600px] flex-col overflow-hidden rounded-xl border border-black/5 bg-canvas-bg/95 shadow-2xl"
		role="dialog"
		aria-labelledby="palette-title"
		aria-modal="true"
	>
		<div class="relative flex items-center border-b border-black/5 bg-white/40 p-6">
			<span class="mr-4 text-2xl opacity-40" aria-hidden="true">📖</span>
			<h2 id="palette-title" class="sr-only">{__({ key: 'hud.menu.catalog_title' })}</h2>
			<input
				id="palette-search"
				type="text"
				bind:value={searchQuery}
				placeholder={__({ key: 'hud.menu.catalog_search' })}
				class="w-full bg-transparent font-serif text-xl text-studio-text focus:outline-none"
			/>
		</div>
		<div class="custom-scrollbar max-h-[50vh] overflow-y-auto p-4" role="list">
			{#if filteredActions.length === 0}
				<div class="p-8 text-center font-serif text-sm text-studio-text/40 italic">
					{__({ key: 'hud.menu.catalog_no_results', replace: { query: searchQuery } })}
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
			<span class="font-serif text-[9px] font-bold tracking-[0.2em] text-studio-text/30 uppercase">
				{__({ key: 'hud.menu.catalog_footer' })}
			</span>
			<span class="font-serif text-[9px] font-bold tracking-[0.2em] text-studio-text/30 uppercase">
				{__({ key: 'hud.menu.catalog_count', replace: { count: filteredActions.length } })}
			</span>
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
