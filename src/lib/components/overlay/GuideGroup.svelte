<script lang="ts">
	import GuideItem from './GuideItem.svelte';

	let { group } = $props<{
		group: {
			group: string;
			items: Array<{ intent: string; label: string }>;
		};
	}>();
</script>

<div class="flex flex-col gap-4">
    <h3 class="border-b border-black/5 pb-2 font-serif text-sm font-bold uppercase tracking-[0.2em] text-brand/60">
        {group.group}
    </h3>
    <div class="grid grid-cols-2 gap-x-12 gap-y-4">
        {#each group.items as item}
            <GuideItem intent={item.intent} label={item.label} />
        {/each}
    </div>
</div>
