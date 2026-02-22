<script lang="ts">
	import { editor } from '../../../../state/editor.svelte.js';
	import { ColorLogic } from '../../../../logic/color.js';

	let { layer, frameIndex, isActive, onclick } = $props<{
		layer: any;
		frameIndex: number;
		isActive: boolean;
		onclick: () => void;
	}>();

	let hasContent = $derived(layer?.hasContent || false);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="flex h-6 items-center justify-center border-r border-evergreen/5 transition-colors {isActive
		? 'bg-lantern-gold/10'
		: 'hover:bg-evergreen/5'}"
	style="width: var(--frame-width);"
	{onclick}
>
	<div
		class="h-2 w-2 rounded-full transition-all {hasContent
			? 'scale-110 bg-lantern-gold shadow-sm'
			: 'border border-evergreen/20 bg-transparent opacity-30'} {isActive
			? 'ring-4 ring-lantern-gold/20'
			: ''}"
	></div>
</div>
