<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { keyboard } from '../../engine/keyboard.svelte.js';
	import Drawer from '../elements/Drawer.svelte';
	import GuideGroup from './GuideGroup.svelte';

	let { onClose = () => (editor.showShortcuts = false) } = $props<{
		onClose: () => void;
	}>();

	let searchQuery = $state('');
	let inputRef = $state<HTMLInputElement | null>(null);

	$effect(() => {
		if (inputRef) {
			inputRef.focus();
		}
	});

	// Dynamically fetch and filter all grouped actions
	const filteredGroups = $derived.by(() => {
		const groups = keyboard.getGroupedActions();
		if (!searchQuery) return groups;

		const query = searchQuery.toLowerCase();
		return groups
			.map((g) => {
				const items = g.items.filter((item) => {
					const label = __(item.label).toLowerCase();
					const keys = (item as any).shortcut?.toLowerCase() || '';
					return label.includes(query) || keys.includes(query);
				});
				return { ...g, items };
			})
			.filter((g) => g.items.length > 0);
	});
</script>

<Drawer title="shortcuts:title" isOpen={true} {onClose} width="1000px">
	<div class="flex flex-col gap-10">
		<!-- Minimalist Header -->
		<header
			class="flex flex-col gap-2 rounded-xl bg-ui-structural/5 p-6 ring-1 ring-ui-structural/10"
			aria-labelledby="guide-header-title"
		>
			<div class="flex flex-col gap-1">
				<h3 id="guide-header-title" class="font-tiny5 text-xl text-text-main uppercase">
					{__('shortcuts:header_title')}
				</h3>
				<p class="font-serif text-[10px] leading-relaxed text-text-main/60">
					{__('shortcuts:header_desc')}
				</p>
			</div>

			<!-- Technical Glossary -->
			<div class="mt-4 grid grid-cols-3 gap-4 border-t border-text-main/5 pt-4">
				{#each [['Frame', 'Frame'], ['Layer', 'Layer'], ['Color', 'Color'], ['Tool', 'Tool'], ['Paint', 'Paint'], ['Delete', 'Delete']] as [term, tech]}
					<div class="flex flex-col">
						<span class="font-tiny5 text-[10px] text-ui-accent uppercase">{term}</span>
						<span class="font-serif text-[10px] text-text-main/40 italic">
							{__('shortcuts:glossary_meaning', { replace: { tech } })}
						</span>
					</div>
				{/each}
			</div>
		</header>

		<!-- Search Section (Standard Full Width) -->
		<section class="flex flex-col gap-4">
			<div class="relative">
				<input
					bind:this={inputRef}
					type="text"
					bind:value={searchQuery}
					placeholder={__('shortcuts:search_placeholder')}
					class="w-full rounded-xl border border-text-main/10 bg-canvas-bg px-6 py-4 font-serif text-sm text-text-main outline-none transition-all focus:border-ui-accent focus:ring-4 focus:ring-ui-accent/10"
				/>
				{#if searchQuery}
					<button
						class="absolute right-5 top-1/2 -translate-y-1/2 text-text-main/30 hover:text-text-main/60"
						onclick={() => (searchQuery = '')}
					>
						✕
					</button>
				{:else}
					<div class="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-text-main/20">
						🔍
					</div>
				{/if}
			</div>
		</section>

		<!-- Shortcut Groups Grid -->
		{#if filteredGroups.length > 0}
			<div class="grid grid-cols-2 gap-x-16 gap-y-12 px-2">
				{#each filteredGroups as group}
					<GuideGroup {group} />
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center gap-4 py-20">
				<span class="text-4xl">🍵</span>
				<p class="font-serif text-sm text-text-main/40 italic">
					{__('shortcuts:no_results', { replace: { query: searchQuery } })}
				</p>
			</div>
		{/if}

		<!-- Neutral Footer -->
		<footer class="mt-4 border-t border-text-main/5 pt-8 text-center">
			<p class="font-serif text-[11px] text-text-main/40 italic">
				"{__('shortcuts:footer_quote')}"
			</p>
		</footer>
	</div>
</Drawer>
