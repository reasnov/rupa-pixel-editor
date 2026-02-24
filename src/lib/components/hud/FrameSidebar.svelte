<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import FramePanel from './FramePanel.svelte';
	import Minimap from './Minimap.svelte';
	import Toolbar from './Toolbar.svelte';
</script>

<aside class="side-panel-left flex h-full w-full bg-washi-white/50">
	<div class="flex flex-1 flex-col overflow-hidden">
		{#if editor.studio.showMinimap}
			<Minimap />
		{/if}

		<div class="flex-1 overflow-y-auto border-r border-evergreen/5">
			<FramePanel />
		</div>
	</div>

	<!-- Primary Tools (Right of this sidebar) -->
	<div class="flex h-full flex-col bg-deep-forest/[0.02] px-2 shadow-sm">
		<Toolbar side="left" />
	</div>
</aside>
