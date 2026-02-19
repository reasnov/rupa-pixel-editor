<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../../state/editor.svelte.js';
	import { services } from '../../../../engine/services.js';
	import { AnimationLogic } from '../../../../logic/animation.js';
	import TimelineDrop from './TimelineDrop.svelte';
	import TimelineTag from './TimelineTag.svelte';

	let timelineElement: HTMLElement | undefined = $state();
	let scrollLeft = $state(0);

	const FRAME_WIDTH = 32;

	function handleScroll(e: Event) {
		const target = e.target as HTMLElement;
		scrollLeft = target.scrollLeft;
	}

	function selectCell(frameIndex: number, layerIndex: number) {
		editor.project.activeFrameIndex = frameIndex;
		editor.project.activeFrame.activeLayerIndex = layerIndex;
	}

	let playheadOffset = $derived(editor.project.activeFrameIndex * FRAME_WIDTH + FRAME_WIDTH / 2);

	$effect(() => {
		if (timelineElement && editor.project.isPlaying) {
			const visibleCenter = timelineElement.clientWidth / 2;
			if (playheadOffset > visibleCenter) {
				timelineElement.scrollLeft = playheadOffset - visibleCenter;
			}
		}
	});

	let rulerMarks = $derived.by(() => {
		const marks = [];
		for (let i = 0; i < editor.project.frames.length; i += 5) {
			marks.push(i);
		}
		if ((editor.project.frames.length - 1) % 5 !== 0) {
			marks.push(editor.project.frames.length - 1);
		}
		return marks;
	});

	let maxRulerWidth = $derived(editor.project.frames.length * FRAME_WIDTH + 200);

	function handleScrub(e: MouseEvent) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const clickX = e.clientX - rect.left + scrollLeft;
		const frameIndex = Math.floor(clickX / FRAME_WIDTH);
		if (frameIndex >= 0 && frameIndex < editor.project.frames.length) {
			editor.project.activeFrameIndex = frameIndex;
		}
	}

	function handleWheel(e: WheelEvent) {
		if (e.ctrlKey) {
			e.preventDefault();
			const delta = e.deltaY > 0 ? -0.1 : 0.1;
			editor.studio.timelineZoom = Math.max(0.5, Math.min(4, editor.studio.timelineZoom + delta));
		}
	}
</script>

<div
	class="relative flex flex-1 flex-col overflow-hidden rounded border border-charcoal/10 bg-stone-light/30 shadow-inner"
	onwheel={handleWheel}
>
	<!-- Top Row: Tags -->
	{#if editor.project.tags.length > 0}
		<div class="h-4 shrink-0 overflow-hidden bg-black/5">
			<div
				class="relative h-full"
				style="width: {maxRulerWidth}px; margin-left: 128px; transform: translateX(-{scrollLeft}px);"
			>
				{#each editor.project.tags as tag (tag.id)}
					<TimelineTag {tag} />
				{/each}
			</div>
		</div>
	{/if}

	<!-- Top Row: Corner + Ruler -->
	<div class="flex h-6 shrink-0 border-b border-charcoal/5 bg-foam-white/95">
		<div
			class="z-40 flex w-32 shrink-0 items-center border-r border-charcoal/10 px-2 font-serif text-[8px] font-black tracking-widest text-charcoal/30 uppercase"
		>
			Infusions
		</div>
		<div class="relative flex-1 overflow-hidden" onclick={handleScrub} role="presentation">
			<div
				class="absolute inset-0 flex items-center"
				style="width: {maxRulerWidth}px; transform: translateX(-{scrollLeft}px);"
			>
				{#each rulerMarks as idx}
					<div
						class="absolute flex flex-col items-center"
						style="left: {idx * FRAME_WIDTH}px; width: {FRAME_WIDTH}px;"
					>
						<div class="h-1 w-px bg-charcoal/20"></div>
						<span class="font-mono text-[8px] font-black text-charcoal/30">{idx + 1}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Main Body: Sidebar + Grid (Unified Vertical Scroll) -->
	<div class="custom-scrollbar flex-1 overflow-y-auto">
		<div class="relative flex min-h-full">
			<!-- Sticky Sidebar -->
			<div
				class="sticky left-0 z-30 flex w-32 shrink-0 flex-col border-r border-charcoal/10 bg-foam-white/95 shadow-sm"
			>
				{#each editor.project.activeFrame.layers as layer, i}
					<button
						onclick={() => (editor.project.activeFrame.activeLayerIndex = i)}
						class="flex h-6 w-full items-center px-2 text-left transition-colors {i ===
						editor.project.activeFrame.activeLayerIndex
							? 'bg-brand/5 text-brand'
							: 'hover:bg-black/5 text-charcoal/60'}"
					>
						<span class="truncate font-serif text-[9px] font-bold uppercase">{layer.name}</span>
					</button>
				{/each}
			</div>

			<!-- Scrollable Grid -->
			<div
				bind:this={timelineElement}
				class="custom-scrollbar relative flex-1 overflow-x-auto"
				onscroll={handleScroll}
				role="grid"
				aria-label="The Drop Matrix"
			>
				<div class="relative flex flex-col" style="width: {maxRulerWidth}px;">
					{#each editor.project.activeFrame.layers as _, layerIdx}
						<div class="flex h-6 border-b border-black/5">
							{#each editor.project.frames as frame, frameIdx}
								<TimelineDrop
									layer={frame.layers[layerIdx]}
									{frameIdx}
									isActive={frameIdx === editor.project.activeFrameIndex &&
										layerIdx === editor.project.activeFrame.activeLayerIndex}
									onclick={() => selectCell(frameIdx, layerIdx)}
								/>
							{/each}
						</div>
					{/each}

					<!-- Playhead -->
					<div
						class="pointer-events-none absolute top-0 bottom-0 z-20 w-px bg-brand transition-all duration-100 ease-out"
						style="left: {playheadOffset}px;"
					>
						<div
							class="absolute -top-0.5 -left-1 h-2 w-2 rotate-45 rounded-sm bg-brand shadow-sm"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
		height: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.05);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(211, 54, 130, 0.2);
	}

	:global(:root) {
		--frame-width: 32px;
	}
</style>
