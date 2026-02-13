<script lang="ts">
	import Header from './Header.svelte';
	import ToolGroup from './ToolGroup.svelte';
	import ProjectInfo from './ProjectInfo.svelte';
</script>

<div class="hud-panel flex h-16 w-full items-center justify-between px-6 py-2">
	<div class="flex items-center gap-6">
		<Header />
		<div class="h-8 w-[2px] bg-grid-border"></div>
		<ToolGroup />
	</div>

	<ProjectInfo />
</div>
