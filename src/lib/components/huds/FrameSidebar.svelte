<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import FramePanel from './FramePanel.svelte';
	import Minimap from './Minimap.svelte';
	import Toolbar from './Toolbar.svelte';
	import Slider from '../elements/Slider.svelte';
	import Input from '../elements/Input.svelte';
</script>

<aside class="side-panel-left flex h-full w-full bg-canvas-bg/50">
	<div class="flex flex-1 flex-col overflow-hidden">
		{#if editor.studio.showMinimap}
			<Minimap />

			<!-- Canvas Zoom Control -->
			<div
				class="flex items-center gap-3 border-b border-text-main/10 bg-text-main/5 px-4 py-3"
				role="group"
				aria-label="Canvas Zoom"
			>
				<span class="font-serif text-[8px] font-bold text-text-main/40 uppercase"
					>{__('workspace:stats.zoom_label')}</span
				>
				<div class="flex flex-1 items-center gap-2">
					<Slider
						min={0.1}
						max={10}
						step={0.1}
						bind:value={editor.studio.zoomLevel}
						ariaLabel="workspace:stats.zoom_level"
						class="flex-1"
					/>
					<Input
						type="number"
						bind:value={editor.studio.zoomLevel}
						min={0.1}
						max={10}
						step={0.1}
						ariaLabel="workspace:stats.zoom_level"
						class="!h-6 w-12 !border-none !bg-transparent !p-0 !text-center !text-[10px] !shadow-none"
					/>
				</div>
			</div>
		{/if}

		<div class="custom-scrollbar flex-1 overflow-y-auto border-r border-text-main/5">
			<FramePanel />
		</div>
	</div>

	<!-- Primary Tools (Right of this sidebar) -->
	<div class="flex h-full flex-col bg-ui-structural/[0.05] px-2 shadow-sm">
		<Toolbar side="left" />
	</div>
</aside>
