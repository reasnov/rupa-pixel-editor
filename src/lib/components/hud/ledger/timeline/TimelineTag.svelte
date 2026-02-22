<script lang="ts">
	import { editor } from '../../../../state/editor.svelte.js';
	import { services } from '../../../../engine/services.js';
	import type { FrameTag } from '../../../../state/project.svelte.js';

	let { tag } = $props<{ tag: FrameTag }>();

	const FRAME_WIDTH = 32;
	let left = $derived(tag.from * FRAME_WIDTH);
	let width = $derived((tag.to - tag.from + 1) * FRAME_WIDTH);

	function remove() {
		services.project.removeTag(tag.id);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="group absolute top-0 flex h-4 items-center justify-center rounded-t border-x border-t border-evergreen/10 px-2 transition-all hover:h-5"
	style="left: {left}px; width: {width}px; background-color: {tag.color}44; border-top-color: {tag.color};"
	title={tag.name}
>
	<span class="truncate font-serif text-[8px] font-black text-evergreen/60 uppercase"
		>{tag.name}</span
	>
	<button
		onclick={remove}
		class="ml-1 hidden h-3 w-3 items-center justify-center rounded-full bg-evergreen/10 text-[6px] group-hover:flex hover:bg-lantern-gold hover:text-white"
	>
		✕
	</button>
</div>
