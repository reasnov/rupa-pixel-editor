<script lang="ts">
	import { atelier } from '../../../../state/atelier.svelte.js';
	import { pulse } from '../../../../engine/pulse.js';
</script>

<div class="flex items-center gap-3 border-r border-black/5 pr-3">
	<!-- Playback Toggle -->
	<button
		class="artisan-primary-btn flex items-center gap-1.5 !px-3 !py-1 text-[10px] {atelier.project
			.isPlaying
			? 'bg-brand'
			: 'bg-slate-700'}"
		onclick={() => pulse.toggle()}
		title="Toggle Pulse (P)"
	>
		<span class="text-[10px]">{atelier.project.isPlaying ? '⏹' : '▶'}</span>
		<span class="font-tiny5 tracking-widest uppercase"
			>{atelier.project.isPlaying ? 'Stop' : 'Play'}</span
		>
	</button>

	<!-- FPS Control -->
	<div class="flex items-center gap-1.5 rounded-lg bg-black/5 px-2 py-0.5">
		<span class="font-serif text-[8px] font-black tracking-tighter uppercase opacity-30">Pace</span>
		<input
			type="number"
			bind:value={atelier.studio.fps}
			min="1"
			max="60"
			class="w-6 bg-transparent text-center font-mono text-[10px] font-bold focus:outline-none"
		/>
		<span class="font-serif text-[8px] opacity-20">FPS</span>
	</div>

	<!-- Ghost Threads Toggle -->
	<button
		class="flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 transition-all {atelier.studio
			.showGhostThreads
			? 'bg-brand/10 text-brand ring-1 ring-brand/20'
			: 'bg-black/5 opacity-40 hover:opacity-100'}"
		onclick={() => (atelier.studio.showGhostThreads = !atelier.studio.showGhostThreads)}
		title="Toggle Ghost Threads (Alt+G)"
	>
		<span class="text-[10px]">👻</span>
		<span class="font-serif text-[8px] font-black tracking-wider uppercase">Ghosts</span>
	</button>
</div>
