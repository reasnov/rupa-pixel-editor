<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { fade } from 'svelte/transition';
</script>

<div class="flex flex-col items-end px-4">
	{#if atelier.project.lastSaved}
		<span
			transition:fade
			class="font-mono text-[8px] font-bold tracking-widest text-studio-text/30 uppercase"
		>
			{__({
				key: 'project.archived',
				replace: {
					time: atelier.project.lastSaved.toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					})
				}
			})}
		</span>
	{/if}
</div>
