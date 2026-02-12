<script lang="ts">
	import { atelier } from '../../state/atelier.svelte';
	import { fade, scale } from 'svelte/transition';
</script>

<div class="flex items-center gap-4">
	{#if atelier.isSelecting}
		<div
			in:scale={{ duration: 200, start: 0.95 }}
			out:fade={{ duration: 150 }}
			class="status-tag animate-pulse border-brand/20 bg-brand/10 text-brand shadow-sm"
		>
			✨ Block Looming
		</div>
	{:else if atelier.isAltPressed}
		<div
			in:scale={{ duration: 200, start: 0.95 }}
			out:fade={{ duration: 150 }}
			class="status-tag animate-pulse border-brand/20 bg-brand/10 text-brand shadow-sm"
		>
			🧶 Unravelling
		</div>
	{:else if atelier.isCtrlPressed}
		<div
			in:scale={{ duration: 200, start: 0.95 }}
			out:fade={{ duration: 150 }}
			class="status-tag animate-pulse border-studio-teal/20 bg-studio-teal/10 text-studio-teal shadow-sm"
		>
			🧵 Threading
		</div>
	{:else}
		<div in:fade={{ duration: 300 }} class="status-tag font-serif italic opacity-60">
			Studio Ready 
			<span class="ml-2 border-l border-studio-text/20 pl-2 not-italic font-mono text-[9px] tracking-tighter">
				v{atelier.version}
			</span>
		</div>
	{/if}

	{#if atelier.lastSaved}
		{@const time = atelier.lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
		<div transition:fade class="text-[8px] font-bold tracking-[0.2em] uppercase opacity-20">
			Linen Backed Up: {time}
		</div>
	{/if}
</div>
