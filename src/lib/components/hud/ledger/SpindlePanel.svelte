<script lang="ts">
	import { atelier } from '../../../state/atelier.svelte.js';
	import { pulse } from '../../../engine/pulse.js';
	import { shuttle } from '../../../engine/shuttle.js';
	import { fade } from 'svelte/transition';

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

	function handleDragEnd() {
		draggedIndex = null;
		dropTargetIndex = null;
	}
</script>

<div class="artisan-panel flex h-28 w-full flex-col gap-2 overflow-hidden px-4 py-2 shadow-inner">
	<!-- Spindle Header -->
	<div class="flex items-center justify-between border-b border-black/5 pb-1">
		<div class="flex items-center gap-4">
			<span class="font-tiny5 text-[10px] tracking-widest text-brand uppercase">The Spindle</span>
			<div class="h-3 w-px bg-black/5"></div>
			<button
				class="artisan-tool-btn !px-3 !py-1 text-[10px] {atelier.project.isPlaying
					? 'border-brand bg-brand text-white'
					: ''}"
				onclick={() => pulse.toggle()}
			>
				{atelier.project.isPlaying ? '⏹ Stop' : '▶ Play'}
			</button>
			<div class="h-3 w-px bg-black/5"></div>
			<div class="flex items-center gap-2">
				<span class="font-serif text-[9px] uppercase opacity-40">Pace:</span>
				<input
					type="number"
					bind:value={atelier.studio.fps}
					class="w-12 rounded border border-black/5 bg-white px-1 py-0.5 font-mono text-[9px] focus:outline-none"
				/>
				<span class="font-serif text-[9px] uppercase opacity-40">FPS</span>
			</div>
		</div>
		<div class="flex items-center gap-4">
			<span class="font-serif text-[8px] font-bold tracking-wider uppercase opacity-20">
				{atelier.project.frames.length} Threads of Time
			</span>
		</div>
	</div>

	<!-- Frame Strip -->
	<div class="custom-scrollbar flex flex-1 items-center gap-3 overflow-x-auto pb-2">
		{#each atelier.project.frames as frame, i}
			<div
				class="relative flex flex-col items-center gap-1"
				draggable="true"
				ondragstart={() => handleDragStart(i)}
				ondragover={(e) => handleDragOver(e, i)}
				ondrop={(e) => handleDrop(e, i)}
				ondragend={handleDragEnd}
			>
				<div
					role="button"
					tabindex="0"
					onclick={() => (atelier.project.activeFrameIndex = i)}
					onkeydown={(e) => e.key === 'Enter' && (atelier.project.activeFrameIndex = i)}
					class="group relative flex aspect-square h-14 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 transition-all {i ===
					atelier.project.activeFrameIndex
						? 'z-10 scale-105 border-brand bg-brand/5 shadow-md ring-2 ring-white'
						: 'border-black/5 bg-black/5 opacity-60 hover:opacity-100'} {dropTargetIndex === i &&
					draggedIndex !== i
						? 'border-l-4 border-l-brand'
						: ''} {draggedIndex === i ? 'opacity-20' : ''}"
				>
					<span class="font-mono text-xs font-black opacity-40">{i + 1}</span>

					{#if i === atelier.project.activeFrameIndex && atelier.project.isPlaying}
						<div class="absolute -top-1 -left-1 h-2 w-2 animate-ping rounded-full bg-brand"></div>
					{/if}

					<!-- Context Actions (Visible on hover) -->
					<div
						class="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-white/80 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<button
							class="transition-transform hover:scale-125"
							onclick={(e) => {
								e.stopPropagation();
								shuttle.folio.duplicateFrame(i);
							}}
							title="Duplicate (Alt+D)"
						>
							📋
						</button>
						<button
							class="transition-transform hover:scale-125"
							onclick={(e) => {
								e.stopPropagation();
								shuttle.folio.removeFrame(i);
							}}
							title="Delete (Alt+Backspace)"
						>
							🗑️
						</button>
					</div>
				</div>

				<!-- Duration Input -->
				<div class="flex items-center gap-1">
					<input
						type="number"
						bind:value={frame.duration}
						step="10"
						min="10"
						class="w-10 rounded border border-black/5 bg-white/50 px-1 py-0.5 text-center font-mono text-[8px] focus:bg-white focus:outline-none"
					/>
					<span class="font-serif text-[7px] uppercase italic opacity-30">ms</span>
				</div>
			</div>
		{/each}

		<!-- Add Frame Shortcut -->
		<button
			class="flex aspect-square h-14 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-black/10 opacity-30 transition-all hover:border-brand hover:opacity-100"
			onclick={() => shuttle.folio.addFrame()}
			title="New Frame (Alt+N)"
		>
			<span class="text-xl">＋</span>
		</button>
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
