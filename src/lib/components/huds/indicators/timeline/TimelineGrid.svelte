<script lang="ts">
	import { editor } from '../../../../state/editor.svelte.js';
	import TimelineDrop from './TimelineDrop.svelte';

	interface Props {
		playheadOffset: number;
		onSelectCell: (frameIdx: number, layerIdx: number) => void;
	}

	let { playheadOffset, onSelectCell }: Props = $props();
</script>

<div class="relative flex flex-1 flex-col">
	{#each editor.project.activeFrame.layers as _, layerIdx}
		<div class="flex h-6 border-b border-text-main/5">
			{#each editor.project.frames as frame, frameIdx}
				<TimelineDrop
					layer={frame.layers[layerIdx]}
					frameIndex={frameIdx}
					isActive={frameIdx === editor.project.activeFrameIndex &&
						layerIdx === editor.project.activeFrame.activeLayerIndex}
					onclick={() => onSelectCell(frameIdx, layerIdx)}
				/>
			{/each}
		</div>
	{/each}

	<!-- Playhead -->
	<div
		class="pointer-events-none absolute top-0 bottom-0 z-20 w-px bg-ui-accent transition-all duration-75 ease-linear"
		style="left: {playheadOffset}px;"
	>
		<div
			class="absolute -top-0.5 -left-1 h-2 w-2 rotate-45 rounded-sm bg-ui-accent shadow-sm"
		></div>
	</div>
</div>
