<script lang="ts">
	import { atelier } from '../../../state/atelier.svelte';
</script>

<div class="flex items-center gap-1.5" title="Atmosphere Status">
	<span class="text-[9px] {atelier.usageMinutes >= 30 ? 'animate-pulse' : 'opacity-20 grayscale'}"
		>🎹</span
	>
	<span class="font-serif text-[8px] font-bold tracking-wider text-brand/40 uppercase italic">
		{#if atelier.usageMinutes < 30}
			Silent
		{:else if atelier.usageMinutes < 60}
			Weaving
		{:else}
			Resonance
		{/if}
	</span>
</div>
