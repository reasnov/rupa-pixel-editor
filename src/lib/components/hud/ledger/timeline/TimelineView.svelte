<script lang="ts">
	import { editor } from '../../../../state/editor.svelte.js';
	import { services } from '../../../../engine/services.js';
	import { AnimationLogic } from '../../../../logic/animation.js';
	import TimelineFrame from './TimelineFrame.svelte';

	let draggedIndex = $state<number | null>(null);
	let dropTargetIndex = $state<number | null>(null);
	let timelineElement: HTMLElement | undefined = $state();
	let rulerElement: HTMLElement | undefined = $state();
	let scrollLeft = $state(0);

	let pxPerMs = $derived(0.25 * editor.studio.timelineZoom);
	const MIN_BLOCK_WIDTH = 50;

	function handleScroll(e: Event) {
		const target = e.target as HTMLElement;
		scrollLeft = target.scrollLeft;
	}

	function handleDragStart(index: number) {
		draggedIndex = index;
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		dropTargetIndex = index;
	}

	function handleDrop(e: DragEvent, toIndex: number) {
		e.preventDefault();
		if (draggedIndex !== null && draggedIndex !== toIndex) {
			services.project.reorderFrame(draggedIndex, toIndex);
		}
		draggedIndex = null;
		dropTargetIndex = null;
	}

	let playheadOffset = $derived(
		AnimationLogic.getFrameOffset(
			editor.project.frames,
			editor.project.activeFrameIndex,
			pxPerMs,
			MIN_BLOCK_WIDTH
		)
	);

	$effect(() => {
		if (timelineElement && editor.project.isPlaying) {
			const visibleCenter = timelineElement.clientWidth / 2;
			if (playheadOffset > visibleCenter) {
				timelineElement.scrollLeft = playheadOffset - visibleCenter;
			}
		}
	});

	let totalDuration = $derived(editor.project.frames.reduce((acc, f) => acc + f.duration, 0));
	let rulerMarks = $derived(AnimationLogic.getRulerMarks(totalDuration, editor.studio.timelineZoom));
	let trackWidth = $derived(
		AnimationLogic.getTrackWidth(editor.project.frames, pxPerMs, MIN_BLOCK_WIDTH)
	);
	let maxRulerWidth = $derived(rulerMarks[rulerMarks.length - 1] * pxPerMs + 100);

	function handleScrub(e: MouseEvent) {
		if (!rulerElement) return;
		const rect = rulerElement.getBoundingClientRect();
		const scrollX = timelineElement?.scrollLeft || 0;
		const clickX = e.clientX - rect.left + scrollX;

		let currentX = 0;
		for (let i = 0; i < editor.project.frames.length; i++) {
			const frameWidth = Math.max(MIN_BLOCK_WIDTH, editor.project.frames[i].duration * pxPerMs);
			if (clickX >= currentX && clickX < currentX + frameWidth) {
				editor.project.activeFrameIndex = i;
				break;
			}
			currentX += frameWidth;
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
	<!-- Minimalist Time Ruler -->
	<div
		bind:this={rulerElement}
		class="relative h-5 w-full cursor-pointer overflow-hidden border-b border-charcoal/5 bg-foam-white/80"
		onclick={handleScrub}
		role="presentation"
	>
		<div
			class="absolute top-0 bottom-0"
			style="width: {maxRulerWidth}px; transform: translateX(-{scrollLeft}px);"
		>
			{#each rulerMarks as ms}
				<div class="absolute flex flex-col items-start" style="left: {ms * pxPerMs}px;">
					<div class="h-1.5 w-px bg-charcoal/20"></div>
					<span
						class="-mt-0.5 ml-1 font-mono text-[8px] font-bold whitespace-nowrap text-charcoal/30"
						>{AnimationLogic.formatTimeLabel(ms)}</span
					>
				</div>
			{/each}
		</div>
	</div>

	<!-- Track Area -->
	<div
		bind:this={timelineElement}
		class="custom-scrollbar relative flex flex-1 items-start overflow-x-auto overflow-y-hidden"
		onscroll={handleScroll}
		role="list"
		aria-label="Timeline"
	>
		<div
			class="flex h-full items-center bg-transparent py-2 pl-1"
			style="width: {maxRulerWidth}px;"
		>
			{#each editor.project.frames as frame, i (frame.id)}
				<div
					role="listitem"
					draggable="true"
					ondragstart={() => handleDragStart(i)}
					ondragover={(e) => handleDragOver(e, i)}
					ondrop={(e) => handleDrop(e, i)}
					ondragend={() => {
						draggedIndex = null;
						dropTargetIndex = null;
					}}
					class="relative h-[50px]"
				>
					<TimelineFrame
						{frame}
						index={i}
						isActive={i === editor.project.activeFrameIndex}
						isDragged={draggedIndex === i}
						isDropTarget={dropTargetIndex === i && draggedIndex !== i}
					/>
					<!-- Drop Indicator -->
					{#if dropTargetIndex === i && draggedIndex !== i}
						<div
							class="absolute top-0 bottom-0 z-50 w-0.5 bg-brand {i < (draggedIndex || 0)
								? '-left-0.5'
								: '-right-0.5'}"
						></div>
					{/if}
				</div>
			{/each}

			<button
				class="group ml-2 flex h-[50px] w-8 shrink-0 items-center justify-center rounded border border-dashed border-charcoal/20 bg-foam-white/40 text-charcoal/20 transition-all hover:border-brand/40 hover:bg-white hover:text-brand"
				onclick={() => services.project.addFrame()}
				title="Add Frame"
			>
				<span class="text-lg">＋</span>
			</button>

			<div class="w-40 shrink-0"></div>
		</div>

		<!-- Playhead -->
		<div
			class="pointer-events-none absolute top-0 bottom-0 z-20 w-px bg-brand transition-all duration-100 ease-out"
			style="left: {playheadOffset}px;"
		>
			<div class="absolute -top-0.5 -left-1 h-2 w-2 rotate-45 rounded-sm bg-brand shadow-sm"></div>
		</div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
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
</style>
