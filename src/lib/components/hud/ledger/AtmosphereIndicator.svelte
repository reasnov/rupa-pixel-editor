<script lang="ts">
	import { atelier } from '../../../state/atelier.svelte';
</script>

<div class="flex items-center gap-1.5" title={__({ key: 'ledger.atmosphere.title' })}>
	<span
		class="text-[9px] {atelier.usageMinutes >= 30 ? 'animate-pulse' : 'opacity-20 grayscale'}"
		aria-hidden="true">🎹</span
	>
	<span class="font-serif text-[8px] font-bold tracking-wider text-brand/40 uppercase italic">
		{#if atelier.usageMinutes < 30}
			{__({ key: 'ledger.atmosphere.silent' })}
		{:else if atelier.usageMinutes < 60}
			{__({ key: 'ledger.atmosphere.weaving' })}
		{:else}
			{__({ key: 'ledger.atmosphere.resonance' })}
		{/if}
	</span>
</div>
