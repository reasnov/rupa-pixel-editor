<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import FramePanel from './FramePanel.svelte';
	import Minimap from './Minimap.svelte';
</script>

<aside
	class="side-panel-left flex h-full w-full flex-col overflow-hidden border-r border-charcoal/10 bg-stone-light/50"
>
	{#if editor.studio.showMinimap}
		<Minimap />
	{/if}

	<div class="flex-1 overflow-y-auto">
		<FramePanel />
	</div>
</aside>
