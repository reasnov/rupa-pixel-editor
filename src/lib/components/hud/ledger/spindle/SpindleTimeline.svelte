<script lang="ts">
	import { atelier } from '../../../../state/atelier.svelte.js';
	import { shuttle } from '../../../../engine/shuttle.js';
	import { ChronosLogic } from '../../../../logic/chronos.js';
	import SpindleFrame from './SpindleFrame.svelte';

	let draggedIndex = $state<number | null>(null);
	let dropTargetIndex = $state<number | null>(null);
	let timelineElement: HTMLElement | undefined = $state();
	let rulerElement: HTMLElement | undefined = $state();
	let scrollLeft = $state(0);

	// Scale constants (Now reactive to studio zoom)
	// Base scale: 0.25px per ms
	let pxPerMs = $derived(0.25 * atelier.studio.timelineZoom); 
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
			shuttle.folio.reorderFrame(draggedIndex, toIndex);
		}
		draggedIndex = null;
		dropTargetIndex = null;
	}

	// Calculate playhead position
	let playheadOffset = $derived(ChronosLogic.getFrameOffset(
		atelier.project.frames, 
		atelier.project.activeFrameIndex, 
		pxPerMs, 
		MIN_BLOCK_WIDTH
	));

	// Auto-scroll effect
	$effect(() => {
		if (timelineElement && atelier.project.isPlaying) {
			const visibleCenter = timelineElement.clientWidth / 2;
			if (playheadOffset > visibleCenter) {
				timelineElement.scrollLeft = playheadOffset - visibleCenter;
			}
		}
	});

	// Time ruler
	let totalDuration = $derived(atelier.project.frames.reduce((acc, f) => acc + f.duration, 0));
	let rulerMarks = $derived(ChronosLogic.getRulerMarks(totalDuration, atelier.studio.timelineZoom));
	let trackWidth = $derived(ChronosLogic.getTrackWidth(atelier.project.frames, pxPerMs, MIN_BLOCK_WIDTH));
	let maxRulerWidth = $derived(rulerMarks[rulerMarks.length - 1] * pxPerMs + 100);

	// Ruler Scrubbing
	function handleScrub(e: MouseEvent) {
		if (!rulerElement) return;
		const rect = rulerElement.getBoundingClientRect();
		const scrollX = timelineElement?.scrollLeft || 0;
		const clickX = e.clientX - rect.left + scrollX;

		let currentX = 0;
		for (let i = 0; i < atelier.project.frames.length; i++) {
			const frameWidth = Math.max(MIN_BLOCK_WIDTH, atelier.project.frames[i].duration * pxPerMs);
			if (clickX >= currentX && clickX < currentX + frameWidth) {
				atelier.project.activeFrameIndex = i;
				break;
			}
			currentX += frameWidth;
		}
	}

	// Ctrl+Scroll Zoom Handling
	function handleWheel(e: WheelEvent) {
		if (e.ctrlKey) {
			e.preventDefault();
			const delta = e.deltaY > 0 ? -0.1 : 0.1;
			atelier.studio.timelineZoom = Math.max(0.5, Math.min(4, atelier.studio.timelineZoom + delta));
		}
	}
</script>

<div
	class="relative flex flex-1 flex-col overflow-hidden rounded-lg border border-black/10 bg-[#e8e2d2] shadow-inner"
	onwheel={handleWheel}
>
	<!-- Adaptive Time Ruler -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={rulerElement}
		class="relative h-5 w-full cursor-pointer overflow-hidden border-b border-black/5 bg-[#f5f2e9]"
		onclick={handleScrub}
	>
		<div
			class="absolute top-0 bottom-0"
			style="width: {maxRulerWidth}px; transform: translateX(-{scrollLeft}px);"
		>
			{#each rulerMarks as ms}
				<div class="absolute flex flex-col items-start" style="left: {ms * pxPerMs}px;">
					<div class="h-2 w-px bg-black/30"></div>
					<span class="ml-1 -mt-0.5 font-mono text-[9px] font-bold text-black/50 whitespace-nowrap"
						>{ChronosLogic.formatTimeLabel(ms)}</span
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
		aria-label="Spindle Timeline"
	>
		<!-- The Track -->
		<div 
			class="flex h-full items-center bg-black/5 py-2 pl-1"
			style="width: {maxRulerWidth}px;"
		>
			{#each atelier.project.frames as frame, i (frame.id)}
				<div
					draggable="true"
					role="listitem"
					ondragstart={() => handleDragStart(i)}
					ondragover={(e) => handleDragOver(e, i)}
					ondrop={(e) => handleDrop(e, i)}
					ondragend={() => {
						draggedIndex = null;
						dropTargetIndex = null;
					}}
					class="relative h-[55px]"
				>
					<SpindleFrame
						{frame}
						index={i}
						isActive={i === atelier.project.activeFrameIndex}
						isDragged={draggedIndex === i}
						isDropTarget={dropTargetIndex === i && draggedIndex !== i}
					/>
					<!-- Drop Indicator -->
					{#if dropTargetIndex === i && draggedIndex !== i}
						<div
							class="absolute top-0 bottom-0 z-50 w-1 rounded-full bg-brand shadow-[0_0_10px_rgba(211,54,130,0.8)] {i <
							(draggedIndex || 0)
								? '-left-1'
								: '-right-1'}"
						></div>
					{/if}
				</div>
			{/each}

			<!-- Add Frame Block -->
			<button
				class="group ml-2 flex h-[55px] w-10 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-black/10 bg-white/20 text-black/30 transition-all hover:border-brand/40 hover:bg-white hover:text-brand"
				onclick={() => shuttle.folio.addFrame()}
				title="New Frame (Alt+N)"
			>
				<span class="text-xl leading-none">＋</span>
			</button>
			
			<!-- Spacer -->
			<div class="w-40 shrink-0"></div>
		</div>

		<!-- Playhead -->
		<div
			class="pointer-events-none absolute top-0 bottom-0 z-20 w-px bg-brand shadow-[0_0_4px_rgba(211,54,130,0.5)] transition-all duration-100 ease-out"
			style="left: {playheadOffset}px;"
		>
			<div
				class="absolute -top-1 -left-1 h-2 w-2 rotate-45 rounded-sm border-2 border-brand bg-[#fdf6e3] shadow-sm"
			></div>
		</div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		height: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.02);
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(211, 54, 130, 0.3);
	}
</style>
