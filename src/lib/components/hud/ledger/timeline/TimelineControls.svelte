<script lang="ts">
	import { editor } from '../../../../state/editor.svelte.js';
	import { chronos } from '../../../../engine/chronos.svelte.js';
</script>

<div
	class="flex items-center gap-4 border-r border-black/5 pr-4"
	role="toolbar"
	aria-label="Timeline Controls"
>
	<!-- Playback Toggle -->
	<button
		class="editor-primary-btn flex items-center gap-2 !px-4 !py-1.5 text-xs {editor.project
			.isPlaying
			? 'bg-brand'
			: 'bg-slate-700'}"
		onclick={() => chronos.togglePlayback()}
		title={__({ key: 'shortcut_labels.PLAY_PAUSE' }) + ' (P)'}
		aria-label={__({ key: 'shortcut_labels.PLAY_PAUSE' })}
	>
		<span class="text-xs" aria-hidden="true">{editor.project.isPlaying ? '⏹' : '▶'}</span>
		<span class="font-tiny5 tracking-widest uppercase">
			{editor.project.isPlaying ? 'Stop' : 'Play'}
		</span>
	</button>

	<!-- FPS Control -->
	<div class="flex items-center gap-2 rounded-xl bg-black/5 px-3 py-1 ring-1 ring-black/5">
		<label
			for="pace-input"
			class="font-serif text-[11px] font-black tracking-tight text-studio-text/50 uppercase"
		>
			{__({ key: 'export.fps_label' })}
		</label>
		<input
			id="pace-input"
			type="number"
			bind:value={editor.studio.fps}
			min="1"
			max="60"
			class="w-10 bg-transparent text-center font-mono text-sm font-bold text-studio-text focus:outline-none"
		/>
		<span class="font-serif text-[10px] font-black text-studio-text/30" aria-hidden="true">FPS</span
		>
	</div>

	<!-- Ghost Layers Toggle -->
	<button
		class="flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all {editor.studio
			.showGhostLayers
			? 'bg-brand/10 text-brand ring-1 ring-brand/20'
			: 'bg-black/5 opacity-40 shadow-sm hover:bg-white/60 hover:opacity-100'}"
		onclick={() => (editor.studio.showGhostLayers = !editor.studio.showGhostLayers)}
		title={__({ key: 'shortcut_labels.TOGGLE_GHOST_LAYERS' }) + ' (Alt+G)'}
		aria-label={__({ key: 'shortcut_labels.TOGGLE_GHOST_LAYERS' })}
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
			bind:value={editor.studio.timelineZoom}
			class="editor-range w-20"
			title="Timeline Zoom"
		/>
		<span class="w-8 font-mono text-[10px] font-bold text-studio-text/40"
			>{Math.round(editor.studio.timelineZoom * 100)}%</span
		>
	</div>
</div>

<style>
	.editor-range {
		appearance: none;
		height: 3px;
		background: #eee8d5;
		border-radius: 10px;
		outline: none;
	}

	.editor-range::-webkit-slider-thumb {
		appearance: none;
		width: 12px;
		height: 12px;
		background: var(--color-brand);
		border: 2px solid white;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
</style>
