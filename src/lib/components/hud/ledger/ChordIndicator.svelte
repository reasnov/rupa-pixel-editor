<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { keyboard } from '../../../engine/keyboard.svelte.js';
</script>

<div class="flex items-center gap-2">
	<span class="font-serif text-[8px] font-black tracking-widest text-evergreen/50 uppercase italic"
		>{__('common:timeline.rhythm')}:</span
	>
	<div class="flex min-w-[80px] gap-1.5">
		{#if keyboard.activeKeys.length > 0}
			{#each keyboard.activeKeys as key}
				<span
					class="rounded border border-evergreen/20 bg-evergreen/10 px-1.5 py-0.5 font-mono text-[9px] font-black text-evergreen uppercase"
				>
					{key === ' ' ? 'Space' : key}
				</span>
			{/each}
		{:else}
			<span class="font-mono text-[9px] text-evergreen/40 italic"
				>{__('common:timeline.waiting')}</span
			>
		{/if}
	</div>
</div>
