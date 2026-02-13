<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { fade } from 'svelte/transition';
</script>

<div class="flex flex-col items-end px-4">
	<h2 class="font-serif text-sm font-bold tracking-[0.1em] uppercase opacity-60">
		{atelier.project.name}
	</h2>
	{#if atelier.project.lastSaved}
		<span
			transition:fade
			class="font-mono text-[8px] font-bold tracking-widest uppercase opacity-30"
		>
			Archived {atelier.project.lastSaved.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit'
			})}
		</span>
	{/if}
</div>
