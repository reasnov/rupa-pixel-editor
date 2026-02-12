<script lang="ts">
	import { loompad } from '../../engine/loompad.svelte';
	import { fade, slide } from 'svelte/transition';
</script>

<div class="pointer-events-none fixed top-6 right-6 z-50 flex flex-col items-end gap-2">
	{#if loompad.activeKeys.size > 0}
		<div 
			transition:fade
			class="flex gap-1"
		>
			{#each Array.from(loompad.activeKeys) as key}
				<kbd class="rounded-md border border-studio-text/10 bg-white/80 px-2 py-1 font-mono text-[9px] font-bold uppercase shadow-sm backdrop-blur-sm">
					{key === ' ' ? 'Space' : key}
				</kbd>
			{/each}
		</div>
	{/if}
</div>
