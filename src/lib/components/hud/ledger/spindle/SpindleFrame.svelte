<script lang="ts">
	import { atelier } from '../../../../state/atelier.svelte.js';
	import { shuttle } from '../../../../engine/shuttle.js';
	import type { FrameState } from '../../../../state/frame.svelte.js';

	let { frame, index, isActive, isDragged, isDropTarget } = $props<{
		frame: FrameState;
		index: number;
		isActive: boolean;
		isDragged: boolean;
		isDropTarget: boolean;
	}>();

	let previewStitches = $derived(frame.compositeStitches);
	// Scale width: 1ms = 0.5px (Default 100ms = 50px)
	let blockWidth = $derived(Math.max(40, frame.duration * 0.6));
</script>

<div
	class="relative h-12 flex-shrink-0 transition-all {isDragged ? 'opacity-20' : ''}"
	style="width: {blockWidth}px;"
>
	<div
		class="group relative h-full w-full cursor-pointer overflow-hidden border-r border-black/20 transition-all {isActive
			? 'bg-brand/20 shadow-[inset_0_0_0_1px_rgba(211,54,130,0.5)]'
			: 'bg-black/10 hover:bg-black/20'} {isDropTarget ? 'border-l-2 border-l-brand' : ''}"
		onclick={() => (atelier.project.activeFrameIndex = index)}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && (atelier.project.activeFrameIndex = index)}
	>
		<!-- Preview Area (Fill the block background subtly) -->
		<div
			class="absolute inset-0 grid opacity-20 group-hover:opacity-40"
			style="grid-template-columns: repeat({frame.width}, 1fr); grid-template-rows: repeat({frame.height}, 1fr);"
		>
			{#each previewStitches as color, i}
				{#if color}
					<div style="background-color: {color};"></div>
				{:else}
					<div></div>
				{/if}
			{/each}
		</div>

		<!-- Top Label: Index -->
		<div class="absolute top-1 left-1.5 flex items-center gap-1.5">
			<span class="font-mono text-[9px] font-black italic opacity-30">{index + 1}</span>
			{#if isActive}
				<div class="h-1 w-1 animate-pulse rounded-full bg-brand"></div>
			{/if}
		</div>

		<!-- Bottom Label: Duration -->
		<div
			class="absolute right-1.5 bottom-1 flex items-center gap-0.5 opacity-40 transition-opacity group-hover:opacity-100"
		>
			<input
				type="number"
				bind:value={frame.duration}
				step="10"
				min="10"
				class="w-7 bg-transparent text-right font-mono text-[8px] font-bold focus:outline-none"
			/>
			<span class="font-serif text-[7px] font-black uppercase">ms</span>
		</div>

		<!-- Action Overlay (Quick Tools) -->
		<div
			class="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/80 opacity-0 transition-opacity group-hover:opacity-100"
		>
			<button
				class="p-1 transition-transform hover:scale-110"
				onclick={(e) => {
					e.stopPropagation();
					shuttle.folio.duplicateFrame(index);
				}}>📋</button
			>
			<button
				class="p-1 transition-transform hover:scale-110"
				onclick={(e) => {
					e.stopPropagation();
					shuttle.folio.removeFrame(index);
				}}>🗑️</button
			>
		</div>
	</div>
</div>
