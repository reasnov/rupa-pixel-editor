<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte.js';
	import Badge from '../../elements/Badge.svelte';
	import Button from '../../elements/Button.svelte';
</script>

<div class="flex items-center gap-3">
	<div class="flex items-center gap-1.5">
		<span class="text-[9px] opacity-40" aria-hidden="true">✨</span>
		<span
			class="font-serif text-[8px] font-black tracking-widest text-text-main/60 uppercase italic"
		>
			{__(editor.selection.maskCount > 1 ? 'timeline:pixel_count_plural' : 'timeline:pixel_count', {
				replace: { count: editor.selection.maskCount }
			})}
		</span>
	</div>

	{#if editor.selection.isActive && editor.project.frames.length > 1}
		<Button
			variant="primary"
			size="sm"
			onclick={() => (editor.studio.showPourBasin = true)}
			ariaLabel="export:propagation.title"
			class="!px-2 !py-0.5"
		>
			<span aria-hidden="true">🌀</span>
			<span class="text-[8px]">{__('export:propagation.title')}</span>
		</Button>
	{/if}
</div>
