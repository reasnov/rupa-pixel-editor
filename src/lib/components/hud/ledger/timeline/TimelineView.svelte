<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../../state/editor.svelte.js';
	import { services } from '../../../../engine/services.js';
	import { AnimationLogic } from '../../../../logic/animation.js';
	import TimelineDrop from './TimelineDrop.svelte';
	import TimelineTag from './TimelineTag.svelte';

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
	class="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-evergreen/10 bg-bamboo-shoot/30 shadow-inner"
>
	<!-- Top Row: Tags -->
	{#if editor.project.tags.length > 0}
		<div class="h-4 shrink-0 overflow-hidden bg-evergreen/5">
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
	<div class="flex h-6 shrink-0 border-b border-evergreen/5 bg-washi-white/95">
		<div
			class="z-40 flex w-32 shrink-0 items-center border-r border-evergreen/10 bg-washi-white px-2 font-serif text-[8px] font-black tracking-widest text-evergreen/30 uppercase"
		>
			Ingredients
		</div>
		<div class="relative flex-1 overflow-hidden" onclick={handleScrub} role="presentation">
			<div
				class="absolute inset-0 flex items-center"
				style="width: {maxRulerWidth}px; min-width: 100%; transform: translateX(-{scrollLeft}px);"
			>
				{#each rulerMarks as mark}
					<div
						class="absolute flex flex-col items-center transition-opacity duration-300 {mark.isFuture
							? 'opacity-20'
							: 'opacity-100'}"
						style="left: {mark.index * currentFrameWidth}px; width: {currentFrameWidth}px;"
					>
						<div class="w-px bg-evergreen/20 {mark.isMajor ? 'h-2' : 'h-1'}"></div>
						{#if mark.label}
							<span
								class="font-mono text-[7px] font-black {mark.isMajor && !mark.isFuture
									? 'text-lantern-gold'
									: 'text-evergreen/40'} mt-0.5 leading-none">{mark.label}</span
							>
						{:else if mark.index % 5 === 0}
							<span class="mt-0.5 font-mono text-[7px] leading-none font-bold text-evergreen/20"
								>{mark.index + 1}</span
							>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>

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
			<!-- Sticky Sidebar -->
			<div
				class="sticky left-0 z-30 flex w-32 shrink-0 flex-col border-r border-evergreen/10 bg-washi-white/95 shadow-sm"
			>
				{#each editor.project.activeFrame.layers as layer, i}
					<button
						onclick={() => (editor.project.activeFrame.activeLayerIndex = i)}
						class="flex h-6 w-full items-center px-2 text-left transition-colors {i ===
						editor.project.activeFrame.activeLayerIndex
							? 'bg-lantern-gold/5 text-lantern-gold'
							: 'text-evergreen/60 hover:bg-evergreen/5'}"
					>
						<span class="truncate font-serif text-[9px] font-bold uppercase">{layer.name}</span>
					</button>
				{/each}
			</div>

			<!-- Grid Content -->
			<div class="relative flex flex-1 flex-col">
				{#each editor.project.activeFrame.layers as _, layerIdx}
					<div class="flex h-6 border-b border-evergreen/5">
						{#each editor.project.frames as frame, frameIdx}
							<TimelineDrop
								layer={frame.layers[layerIdx]}
								frameIndex={frameIdx}
								isActive={frameIdx === editor.project.activeFrameIndex &&
									layerIdx === editor.project.activeFrame.activeLayerIndex}
								onclick={() => selectCell(frameIdx, layerIdx)}
							/>
						{/each}
					</div>
				{/each}

				<!-- Playhead -->
				<div
					class="pointer-events-none absolute top-0 bottom-0 z-20 w-px bg-lantern-gold transition-all duration-75 ease-linear"
					style="left: {playheadOffset}px;"
				>
					<div
						class="absolute -top-0.5 -left-1 h-2 w-2 rotate-45 rounded-sm bg-lantern-gold shadow-sm"
					></div>
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
		background: rgba(52, 78, 65, 0.1);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(181, 137, 0, 0.2);
	}
</style>
