<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../../state/editor.svelte.js';
	import { animation } from '../../../../engine/animation.svelte.js';
	import Button from '../../../elements/Button.svelte';
	import Input from '../../../elements/Input.svelte';
	import Slider from '../../../elements/Slider.svelte';
</script>

<div
	class="flex min-w-0 items-center gap-4 border-r border-text-main/5 pr-4"
	role="toolbar"
	aria-label="Timeline Controls"
>
	<!-- Playback Toggle -->
	<Button
		variant={editor.project.isPlaying ? 'primary' : 'secondary'}
		onclick={() => animation.togglePlayback()}
		ariaLabel="actions:play_pause"
		class="!px-4 !py-1.5 text-xs"
	>
		<span class="text-xs" aria-hidden="true">{editor.project.isPlaying ? '⏹' : '▶'}</span>
		<span class="font-tiny5 tracking-widest uppercase">
			{editor.project.isPlaying ? __('ui:labels.off') : __('ui:labels.on')}
		</span>
	</Button>

	<!-- FPS Control -->
	<div class="flex items-center gap-2 rounded-lg bg-text-main/5 px-2 py-1 ring-1 ring-text-main/10">
		<span class="font-serif text-[8px] font-bold text-text-main/40 uppercase"
			>{__('workspace:settings.fps_label')}</span
		>
		<Input
			type="number"
			bind:value={editor.project.fps}
			min={1}
			max={60}
			ariaLabel="workspace:settings.fps_label"
			class="!h-6 w-12 !border-none !bg-transparent !p-0 !text-center !text-[10px] !shadow-none"
		/>
		<span class="font-tiny5 text-[8px] text-text-main/30">{__('ui:units.fps')}</span>
	</div>

	<!-- Ghost Layers Toggle -->
	<Button
		variant="tool"
		isActive={editor.studio.showGhostLayers}
		onclick={() => (editor.studio.showGhostLayers = !editor.studio.showGhostLayers)}
		ariaLabel="actions:toggle_ghost_layers"
		class="!h-8 !px-3"
	>
		<span class="text-xs" aria-hidden="true">👻</span>
	</Button>

	<!-- Timeline Zoom -->
	<div class="flex items-center gap-3 border-l border-text-main/10 pl-4">
		<span class="font-serif text-[8px] font-bold text-text-main/40 uppercase"
			>{__('ui:labels.timeline_zoom')}</span
		>
		<Slider
			min={0.5}
			max={4}
			step={0.1}
			bind:value={editor.studio.timelineZoom}
			ariaLabel="ui:labels.timeline_zoom"
			class="w-64"
		/>
	</div>
</div>
