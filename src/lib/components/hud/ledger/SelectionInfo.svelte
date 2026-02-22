<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte';
</script>

<div class="flex items-center gap-3">
	<div class="flex items-center gap-1.5">
		<span class="text-[9px] opacity-40" aria-hidden="true">✨</span>
		<span
			class="font-serif text-[8px] font-black tracking-widest text-evergreen/60 uppercase italic"
		>
			{__(
				editor.selection.indices.length > 1
					? 'common:timeline.pixel_count_plural'
					: 'common:timeline.pixel_count',
				{ replace: { count: editor.selection.indices.length } }
			)}
		</span>
	</div>

	{#if editor.selection.isActive && editor.project.frames.length > 1}
		<button
			onclick={() => (editor.studio.showPourBasin = true)}
			class="flex items-center gap-1 rounded bg-lantern-gold/10 px-2 py-0.5 font-serif text-[8px] font-bold tracking-widest text-lantern-gold uppercase transition-all hover:bg-lantern-gold hover:text-white"
			title="Selection Propagation"
		>
			<span aria-hidden="true">🌀</span>
			{__('common:export.propagation.title')}
		</button>
	{/if}
</div>
