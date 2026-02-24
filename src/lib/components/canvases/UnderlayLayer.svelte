<script lang="ts">
	import { fade } from 'svelte/transition';
	import { editor } from '../../state/editor.svelte.js';
	import { __ } from '../../state/i18n.svelte.js';

	const studio = editor.studio;
</script>

{#if studio.underlayImage && studio.isUnderlayVisible}
	<div
		transition:fade
		class="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
		style="opacity: {studio.underlayOpacity}"
	>
		<img
			src={studio.underlayImage}
			alt={__('workspace:underlay')}
			class="absolute origin-top-left"
			style="
                transform: translate({studio.underlayOffset.x}px, {studio.underlayOffset
				.y}px) scale({studio.underlayScale});
                image-rendering: auto;
            "
		/>
	</div>
{/if}
