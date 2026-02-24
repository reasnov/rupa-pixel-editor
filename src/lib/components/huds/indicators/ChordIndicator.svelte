<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { keyboard } from '../../../engine/keyboard.svelte.js';
	import Badge from '../../elements/Badge.svelte';
</script>

<div class="flex items-center gap-2">
	<span class="font-serif text-[8px] font-black tracking-widest text-text-main/50 uppercase italic"
		>{__('timeline:rhythm')}:</span
	>
	<div class="flex min-w-[80px] gap-1.5">
		{#if keyboard.activeKeys.length > 0}
			{#each keyboard.activeKeys as key}
				<Badge variant="secondary" size="sm">
					{key === ' ' ? 'Space' : key}
				</Badge>
			{/each}
		{:else}
			<span class="font-mono text-[9px] text-text-main/40 italic">{__('timeline:waiting')}</span>
		{/if}
	</div>
</div>
