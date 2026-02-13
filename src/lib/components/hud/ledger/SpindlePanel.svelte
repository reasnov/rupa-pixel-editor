<script lang="ts">
	import { atelier } from '../../../state/atelier.svelte.js';
	import SpindleControls from './spindle/SpindleControls.svelte';
	import SpindleTimeline from './spindle/SpindleTimeline.svelte';
</script>

<div
	class="artisan-panel flex h-28 w-full flex-col gap-1.5 overflow-hidden px-4 py-2 shadow-2xl transition-all hover:bg-white/40"
>
	<!-- Panel Header -->
	<div class="flex items-center justify-between border-b border-black/5 pb-1">
		<div class="flex items-center gap-4">
			<div class="flex items-center gap-1.5">
				<span class="text-[10px] opacity-40">⏳</span>
				<span class="font-tiny5 text-[9px] tracking-[0.2em] text-brand uppercase">The Spindle</span>
			</div>

			<SpindleControls />
		</div>

		<div class="flex items-center gap-4">
			<div class="flex flex-col items-end gap-0">
				<span class="font-serif text-[7px] font-black tracking-widest uppercase opacity-20">
					Kinetic Track
				</span>
				<span class="font-mono text-[8px] font-bold text-brand opacity-60">
					{atelier.project.frames.length} Threads
				</span>
			</div>
		</div>
	</div>

	<!-- Main Timeline Area -->
	<SpindleTimeline />
</div>
