<script lang="ts">
	import { loompad } from '../../../engine/loompad.svelte';
</script>

<div class="flex items-center gap-2">
	<span class="font-serif text-[8px] font-black tracking-widest text-brand/40 uppercase italic"
		>{__({ key: 'ledger.chord' })}:</span
	>
	<div class="flex min-w-[100px] gap-1.5">
		{#if loompad.activeKeys.length > 0}
			{#each loompad.activeKeys as key}
				<span
					class="rounded bg-brand/10 px-1.5 py-0.5 font-mono text-[9px] font-black text-brand uppercase"
				>
					{key === ' ' ? 'Space' : key}
				</span>
			{/each}
		{:else}
			<span class="font-mono text-[9px] text-studio-text/20 italic"
				>{__({ key: 'ledger.none' })}</span
			>
		{/if}
	</div>
</div>
