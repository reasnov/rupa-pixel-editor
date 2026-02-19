<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte';
</script>

<div class="flex items-center gap-3">
	<div class="flex items-center gap-1.5">
		<span class="text-[9px] opacity-40" aria-hidden="true">✨</span>
		<span class="font-serif text-[8px] font-black tracking-widest text-charcoal/60 uppercase italic">
			{__({
				key:
					editor.selection.indices.length > 1
						? 'timeline.pixel_count_plural'
						: 'timeline.pixel_count',
				replace: { count: editor.selection.indices.length }
			})}
		</span>
	</div>

	{#if editor.selection.isActive && editor.project.frames.length > 1}
		<button
			onclick={() => (editor.studio.showPourBasin = true)}
			class="flex items-center gap-1 rounded bg-brand/10 px-2 py-0.5 font-serif text-[8px] font-bold tracking-widest text-brand uppercase transition-all hover:bg-brand hover:text-white"
			title="Selection Propagation (Syrup Flow)"
		>
			<span aria-hidden="true">🍯</span>
			{__({ key: 'export.pour_basin.title' })}
		</button>
	{/if}
</div>
