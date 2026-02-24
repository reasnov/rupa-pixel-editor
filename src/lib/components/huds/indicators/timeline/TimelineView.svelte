<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../../state/editor.svelte.js';
	import { services } from '../../../../engine/services.js';
	import { AnimationLogic } from '../../../../logic/animation.js';
	import TimelineTag from './TimelineTag.svelte';
	import TimelineRuler from './TimelineRuler.svelte';
	import TimelineLayerList from './TimelineLayerList.svelte';
	import TimelineGrid from './TimelineGrid.svelte';

	let timelineElement: HTMLElement | undefined = $state();
	let scrollLeft = $state(0);

	const BASE_FRAME_WIDTH = 32;
	let currentFrameWidth = $derived(BASE_FRAME_WIDTH * editor.studio.timelineZoom);

	function handleScroll(e: Event) {
		const target = e.target as HTMLElement;
		scrollLeft = target.scrollLeft;
	}

	function selectCell(frameIndex: number, layerIndex: number) {
		editor.project.activeFrameIndex = frameIndex;
		editor.project.activeFrame.activeLayerIndex = layerIndex;
	}

	let playheadOffset = $derived(
		editor.project.activeFrameIndex * currentFrameWidth + currentFrameWidth / 2
	);

	$effect(() => {
		if (timelineElement && editor.project.isPlaying) {
			const visibleCenter = timelineElement.clientWidth / 2;
			if (playheadOffset > visibleCenter) {
				timelineElement.scrollLeft = playheadOffset - visibleCenter;
			}
		}
	});

	let maxRulerWidth = $derived(editor.project.frames.length * currentFrameWidth + 400);

	let rulerMarks = $derived.by(() => {
		const marks: { index: number; isMajor: boolean; label?: string; isFuture: boolean }[] = [];
		const fps = editor.project.fps;
		const zoom = editor.studio.timelineZoom;
		const frameCount = editor.project.frames.length;

		// Adaptive stepping: 1s, 0.5s, 0.2s, or 0.1s based on zoom
		let timeStep = 1.0;
		if (zoom > 3) timeStep = 0.1;
		else if (zoom > 2) timeStep = 0.2;
		else if (zoom > 1.2) timeStep = 0.5;

		const framesPerStep = Math.max(1, Math.round(fps * timeStep));

		// Fill the ruler up to maxRulerWidth (content + buffer)
		const totalPossibleFrames = Math.ceil(maxRulerWidth / currentFrameWidth);

		for (let i = 0; i < totalPossibleFrames; i++) {
			const isStep = i % framesPerStep === 0;
			const isSecond = i % fps === 0;
			const isFiveFrame = i % 5 === 0;
			const isFuture = i >= frameCount;

			if (isStep) {
				const timeSec = i / fps;
				const label = timeSec % 1 === 0 ? `${timeSec}s` : `${timeSec.toFixed(1)}s`;
				marks.push({ index: i, isMajor: isSecond, label, isFuture });
			} else if (isFiveFrame) {
				marks.push({ index: i, isMajor: false, isFuture });
			}
		}
		return marks;
	});

	function handleScrub(e: MouseEvent) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const clickX = e.clientX - rect.left + scrollLeft;
		const frameIndex = Math.floor(clickX / currentFrameWidth);
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
	class="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-text-main/10 bg-sidebar-bg/30 shadow-inner"
>
	<!-- Top Row: Tags -->
	{#if editor.project.tags.length > 0}
		<div class="h-4 shrink-0 overflow-hidden bg-text-main/5">
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

	<TimelineRuler
		{rulerMarks}
		{maxRulerWidth}
		{currentFrameWidth}
		{scrollLeft}
		onScrub={handleScrub}
	/>

	<!-- Main Body: Sidebar + Grid (Unified Scrolling) -->
	<div
		bind:this={timelineElement}
		class="custom-scrollbar min-h-0 flex-1 overflow-auto"
		onscroll={handleScroll}
		onwheel={handleWheel}
		role="grid"
		aria-label="The Drop Matrix"
	>
		<div
			class="relative flex"
			style="width: {maxRulerWidth +
				128}px; min-height: 100%; --frame-width: {currentFrameWidth}px;"
		>
			<TimelineLayerList
				activeLayerIndex={editor.project.activeFrame.activeLayerIndex}
				onSelect={(i) => (editor.project.activeFrame.activeLayerIndex = i)}
			/>

			<TimelineGrid {playheadOffset} onSelectCell={selectCell} />
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
		background: rgba(52, 78, 65, 0.1);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(181, 137, 0, 0.2);
	}
</style>
