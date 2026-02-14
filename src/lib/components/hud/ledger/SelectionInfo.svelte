<script lang="ts">
	import { atelier } from '../../../state/atelier.svelte';
	import { fade } from 'svelte/transition';

	let pointsCount = $derived(atelier.selection.getPoints(atelier.linen.width).length);
</script>

{#if pointsCount > 0}
	<div
		transition:fade
		class="flex items-center gap-1.5"
		title={__({ key: 'stats.active_motif', replace: { count: pointsCount } })}
		role="status"
	>
		<span class="text-[9px] text-brand/60" aria-hidden="true">🕸️</span>
		<span class="font-serif text-[8px] font-bold tracking-wider text-brand/60 uppercase italic">
			{__({ key: 'stats.active_motif', replace: { count: pointsCount } })}
		</span>
	</div>
{/if}
