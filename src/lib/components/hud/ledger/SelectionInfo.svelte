<script lang="ts">
	import { editor } from '../../../state/editor.svelte';
</script>

<div class="flex items-center gap-1.5">
	<span class="text-[9px] opacity-40" aria-hidden="true">✨</span>
	<span class="font-serif text-[8px] font-black tracking-widest text-charcoal/60 uppercase italic">
		{__({
			key: editor.selection.indices.length > 1 ? 'timeline.pixel_count_plural' : 'timeline.pixel_count',
			replace: { count: editor.selection.indices.length }
		})}
	</span>
</div>
