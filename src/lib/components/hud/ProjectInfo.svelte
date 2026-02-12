<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { fade } from 'svelte/transition';
</script>

<div class="pointer-events-auto flex flex-col items-end gap-2">
	<div class="artisan-panel rounded-xl border-b-2 border-white px-6 py-3 shadow-sm">
		<h2 class="font-serif text-xs font-bold tracking-[0.2em] uppercase opacity-40">
			{atelier.project.name}
		</h2>
	</div>

	{#if atelier.project.lastSaved}
		<span
			transition:fade
			class="mr-4 font-serif text-[9px] font-bold tracking-widest uppercase opacity-20"
		>
			Last Archived: {atelier.project.lastSaved.toLocaleTimeString()}
		</span>
	{/if}
</div>
