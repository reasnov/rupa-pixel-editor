<script lang="ts">
	import { atelier } from '../../../state/atelier.svelte.js';
	import { pulse } from '../../../engine/pulse.js';
	import { shuttle } from '../../../engine/shuttle.js';
	import { fade } from 'svelte/transition';

	function handleFrameClick(index: number) {
		atelier.project.activeFrameIndex = index;
	}
</script>

<div class="artisan-panel flex h-24 w-full flex-col gap-2 overflow-hidden px-4 py-2 shadow-inner">
	<!-- Spindle Header -->
	<div class="flex items-center justify-between border-b border-black/5 pb-1">
		<div class="flex items-center gap-4">
			<span class="font-tiny5 text-[10px] tracking-widest text-brand uppercase">The Spindle</span>
			<div class="h-3 w-px bg-black/5"></div>
			<button
				class="text-[10px] font-bold uppercase transition-all {atelier.project.isPlaying
					? 'text-brand'
					: 'opacity-40 hover:opacity-100'}"
				onclick={() => pulse.toggle()}
			>
				{atelier.project.isPlaying ? '⏹ Stop' : '▶ Play'}
			</button>
		</div>
		<span class="font-serif text-[8px] font-bold tracking-wider uppercase opacity-20">
			{atelier.project.frames.length} Threads of Time
		</span>
	</div>

	<!-- Frame Strip -->
	<div class="custom-scrollbar flex flex-1 items-center gap-3 overflow-x-auto pb-1">
		{#each atelier.project.frames as frame, i}
			<button
				onclick={() => handleFrameClick(i)}
				class="group relative flex aspect-square h-12 shrink-0 items-center justify-center rounded-lg border-2 transition-all {i ===
				atelier.project.activeFrameIndex
					? 'scale-105 border-brand bg-brand/5 shadow-md'
					: 'border-black/5 bg-black/5 opacity-60 hover:opacity-100'}"
			>
				<span class="font-mono text-[10px] font-bold">{i + 1}</span>

				<!-- Duration Badge -->
				<div
					class="absolute -right-1 -bottom-1 rounded bg-white px-1 py-0.5 text-[6px] font-black shadow-sm ring-1 ring-black/5"
				>
					{frame.duration}ms
				</div>

				{#if i === atelier.project.activeFrameIndex && atelier.project.isPlaying}
					<div class="absolute -top-1 -left-1 h-2 w-2 animate-ping rounded-full bg-brand"></div>
				{/if}
			</button>
		{/each}

		<!-- Add Frame Shortcut -->
		<button
			class="flex aspect-square h-12 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-black/10 opacity-30 transition-all hover:border-brand hover:opacity-100"
			onclick={() => shuttle.folio.addFrame()}
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
