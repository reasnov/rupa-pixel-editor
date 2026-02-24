<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import GuideItem from './GuideItem.svelte';

	let { group } = $props<{
		group: {
			group: string;
			items: Array<{ intent: string; label: string; customKey?: string }>;
		};
	}>();
</script>

<div class="flex flex-col gap-4">
	<h3
		class="border-b border-text-main/10 pb-2 font-serif text-sm font-bold tracking-[0.2em] text-text-main/60 uppercase"
	>
		{__(group.group)}
	</h3>
	<div class="grid grid-cols-2 gap-x-12 gap-y-4">
		{#each group.items as item}
			<GuideItem intent={item.intent} label={item.label} customKey={item.customKey} />
		{/each}
	</div>
</div>
