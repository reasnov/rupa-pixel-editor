<script lang="ts">
	import { editor } from '../../../../state/editor.svelte.js';
	import { ChronosLogic } from '../../../../logic/chronos.js';
	import type { FrameState } from '../../../../state/frame.svelte.js';

	let { frame, index, isActive, isDragged, isDropTarget } = $props<{
		frame: FrameState;
		index: number;
		isActive: boolean;
		isDragged: boolean;
		isDropTarget: boolean;
	}>();

	// Dynamic scale reactive to studio zoom
	let pxPerMs = $derived(0.25 * editor.studio.timelineZoom);
	const MIN_BLOCK_WIDTH = 50;
	let blockWidth = $derived(Math.max(MIN_BLOCK_WIDTH, frame.duration * pxPerMs));

	// Duration Stretching Logic
	let isResizing = $state(false);
	let startX = 0;
	let startDuration = 0;

	function startResize(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		isResizing = true;
		startX = e.clientX;
		startDuration = frame.duration;

		window.addEventListener('mousemove', handleResize);
		window.addEventListener('mouseup', stopResize);
		document.body.style.cursor = 'col-resize';
	}

	function handleResize(e: MouseEvent) {
		if (!isResizing) return;
		const deltaX = e.clientX - startX;
		const deltaDuration = Math.round(deltaX / pxPerMs);
		const newDuration = Math.max(10, startDuration + deltaDuration);
		frame.duration = Math.round(newDuration / 10) * 10; // Snap to 10ms increments
	}

	function stopResize() {
		isResizing = false;
		window.removeEventListener('mousemove', handleResize);
		window.removeEventListener('mouseup', stopResize);
		document.body.style.cursor = '';
	}
</script>

<div
	class="relative h-full flex-shrink-0 transition-transform duration-200 select-none {isDragged
		? 'scale-95 opacity-40'
		: ''} {isDropTarget ? 'translate-x-4' : ''}"
	style="width: {blockWidth}px;"
>
	<div
		class="group relative h-full w-full cursor-pointer overflow-hidden rounded-md border border-black/10 transition-all {isActive
			? 'border-brand bg-white shadow-lg ring-2 ring-brand/20'
			: 'bg-white/60 hover:bg-white/90 hover:shadow-md'}"
		onclick={() => (editor.project.activeFrameIndex = index)}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && (editor.project.activeFrameIndex = index)}
	>
		<div
			class="absolute inset-1 rounded-sm shadow-inner transition-colors {isActive
				? 'bg-brand/10'
				: 'bg-black/5'}"
		></div>

		<!-- Top Label: Index -->
		<div
			class="absolute top-1 left-1 flex h-4 min-w-4 items-center justify-center rounded-sm bg-black/40 px-1 backdrop-blur-sm"
		>
			<span class="font-mono text-[9px] font-black text-white">{index + 1}</span>
		</div>

		<!-- Duration Badge -->
		<div
			class="absolute right-1 bottom-1 rounded bg-white/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-black/50 shadow-sm"
		>
			{frame.duration}ms
		</div>
	</div>

	<!-- Resize Handle -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="absolute top-0 right-0 bottom-0 z-30 w-2 cursor-col-resize rounded-r-md transition-colors hover:bg-brand/40 active:bg-brand"
		onmousedown={startResize}
	>
		<div
			class="absolute top-1/2 left-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/10 group-hover:bg-white/60"
		></div>
	</div>
</div>
