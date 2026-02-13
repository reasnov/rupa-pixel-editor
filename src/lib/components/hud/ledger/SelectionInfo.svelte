<script lang="ts">
	import { atelier } from '../../../state/atelier.svelte';
	import { fade } from 'svelte/transition';

	let pointsCount = $derived(atelier.selection.getPoints(atelier.linen.width).length);
</script>

{#if pointsCount > 0}
	<div transition:fade class="flex items-center gap-1.5" title="Active Selection">
		<span class="text-[9px] text-brand/60">🕸️</span>
		<span class="font-serif text-[8px] font-bold tracking-wider text-brand/60 uppercase italic">
			Motif: {pointsCount} Stitches
		</span>
	</div>
{/if}
