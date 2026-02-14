<script lang="ts">
	import { atelier } from '../../../../state/atelier.svelte.js';
	import { chronos } from '../../../../engine/chronos.svelte.js';
</script>

<div
	class="flex items-center gap-4 border-r border-black/5 pr-4"
	role="toolbar"
	aria-label="Spindle Controls"
>
	<!-- Playback Toggle -->
	<button
		class="artisan-primary-btn flex items-center gap-2 !px-4 !py-1.5 text-xs {atelier.project
			.isPlaying
			? 'bg-brand'
			: 'bg-slate-700'}"
		onclick={() => chronos.togglePlayback()}
		title={__({ key: 'shortcuts.labels.PLAY_PULSE' }) + ' (P)'}
		aria-label={__({ key: 'shortcuts.labels.PLAY_PULSE' })}
	>
		<span class="text-xs" aria-hidden="true">{atelier.project.isPlaying ? '⏹' : '▶'}</span>
		<span class="font-tiny5 tracking-widest uppercase">
			{atelier.project.isPlaying ? 'Stop' : 'Play'}
		</span>
	</button>

	<!-- FPS Control -->
	<div class="flex items-center gap-2 rounded-xl bg-black/5 px-3 py-1 ring-1 ring-black/5">
		<label
			for="pace-input"
			class="font-serif text-[11px] font-black tracking-tight text-studio-text/50 uppercase"
		>
			{__({ key: 'artifact.fps_label' })}
		</label>
		<input
			id="pace-input"
			type="number"
			bind:value={atelier.studio.fps}
			min="1"
			max="60"
			class="w-10 bg-transparent text-center font-mono text-sm font-bold text-studio-text focus:outline-none"
		/>
		<span class="font-serif text-[10px] font-black text-studio-text/30" aria-hidden="true">FPS</span>
	</div>

	<!-- Ghost Threads Toggle -->
	<button
		class="flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all {atelier.studio
			.showGhostThreads
			? 'bg-brand/10 text-brand ring-1 ring-brand/20'
			: 'bg-black/5 opacity-40 hover:opacity-100 hover:bg-white/60 shadow-sm'}"
		onclick={() => (atelier.studio.showGhostThreads = !atelier.studio.showGhostThreads)}
		title={__({ key: 'shortcuts.labels.TOGGLE_GHOST_THREADS' }) + ' (Alt+G)'}
		aria-label={__({ key: 'shortcuts.labels.TOGGLE_GHOST_THREADS' })}
	>
		<span class="text-xs" aria-hidden="true">👻</span>
		<span class="font-serif text-[11px] font-black tracking-wider text-studio-text/70 uppercase"
			>Ghosts</span
		>
	</button>

	<!-- Timeline Zoom -->
	<div class="flex items-center gap-2 border-l border-black/5 pl-4">
		<span class="text-xs opacity-40" aria-hidden="true">🔍</span>
		<input
			type="range"
			min="0.5"
			max="4"
			step="0.1"
			bind:value={atelier.studio.timelineZoom}
			class="artisan-range w-20"
			title="Timeline Zoom"
		/>
		<span class="font-mono text-[10px] font-bold text-studio-text/40 w-8"
			>{Math.round(atelier.studio.timelineZoom * 100)}%</span
		>
	</div>
</div>

<style>
	.artisan-range {
		appearance: none;
		height: 3px;
		background: #eee8d5;
		border-radius: 10px;
		outline: none;
	}

	.artisan-range::-webkit-slider-thumb {
		appearance: none;
		width: 12px;
		height: 12px;
		background: #d33682;
		border: 2px solid white;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
</style>
