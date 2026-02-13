<script lang="ts">
	import { atelier } from '../../../../state/atelier.svelte.js';
	import { shuttle } from '../../../../engine/shuttle.js';
	import SpindleFrame from './SpindleFrame.svelte';

	let draggedIndex = $state<number | null>(null);
	let dropTargetIndex = $state<number | null>(null);

	function handleDragStart(index: number) {
		draggedIndex = index;
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		dropTargetIndex = index;
	}

	function handleDrop(e: DragEvent, toIndex: number) {
		e.preventDefault();
		if (draggedIndex !== null) {
			shuttle.folio.reorderFrame(draggedIndex, toIndex);
		}
		draggedIndex = null;
		dropTargetIndex = null;
	}

	// Calculate playhead position
	let playheadOffset = $derived.by(() => {
		const activeIdx = atelier.project.activeFrameIndex;
		let offset = 0;
		for (let i = 0; i < activeIdx; i++) {
			offset += Math.max(40, atelier.project.frames[i].duration * 0.6);
		}
		return offset;
	});

	// Time ruler marks
	let totalDuration = $derived(atelier.project.frames.reduce((acc, f) => acc + f.duration, 0));
	let rulerMarks = $derived.by(() => {
		const marks = [];
		const step = 200; // Mark every 200ms
		for (let i = 0; i <= totalDuration; i += step) {
			marks.push(i);
		}
		return marks;
	});
</script>

<div
	class="relative flex flex-1 flex-col overflow-hidden rounded-lg border border-black/10 bg-black/5 shadow-inner"
>
	<!-- Time Ruler -->
	<div class="relative h-4 w-full overflow-hidden border-b border-black/5 bg-[#eee8d5]">
		<div class="flex items-center px-2">
			{#each rulerMarks as ms}
				<div class="absolute flex flex-col items-center gap-0.5" style="left: {ms * 0.6}px;">
					<div class="h-1.5 w-px bg-brand/20"></div>
					<span class="font-mono text-[6px] text-brand/40">{ms}ms</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Track Area -->
	<div
		class="custom-scrollbar relative flex flex-1 items-start overflow-x-auto overflow-y-hidden"
		role="list"
		aria-label="Spindle Timeline"
	>
		<!-- The Track -->
		<div class="flex h-full min-w-full items-center bg-[#eee8d5]/40">
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
				>
					<SpindleFrame
						{frame}
						index={i}
						isActive={i === atelier.project.activeFrameIndex}
						isDragged={draggedIndex === i}
						isDropTarget={dropTargetIndex === i && draggedIndex !== i}
					/>
				</div>
			{/each}

			<!-- Add Frame Block -->
			<button
				class="flex h-12 w-10 shrink-0 items-center justify-center border-r border-black/5 bg-black/5 text-lg text-black/20 transition-all hover:bg-brand/10 hover:text-brand"
				onclick={() => shuttle.folio.addFrame()}
				title="New Frame (Alt+N)"
			>
				＋
			</button>
		</div>

		<!-- Playhead (The Needle of Time) -->
		<div
			class="pointer-events-none absolute top-0 bottom-0 z-20 w-px bg-brand transition-all duration-100 ease-out"
			style="left: {playheadOffset}px;"
		>
			<div
				class="absolute -top-1 -left-1.5 h-3 w-3 rounded-full border-2 border-brand bg-[#fdf6e3] shadow-md"
			></div>
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
		background: rgba(211, 54, 130, 0.1);
		border-radius: 10px;
	}
</style>
