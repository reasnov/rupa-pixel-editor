<script lang="ts">
	import Brand from '../brand/Brand.svelte';
	import ToolGroup from './ToolGroup.svelte';
	import ProjectInfo from './ProjectInfo.svelte';
</script>

<div class="hud-panel flex h-16 w-full items-center justify-between px-6 py-2">
	<!-- Left: Brand & Tools -->
	<div class="flex items-center gap-10">
		<Brand size="md" />
		<div class="h-8 w-[2px] bg-grid-border opacity-50"></div>
		<ToolGroup />
	</div>

	<!-- Right: Metadata -->
	<ProjectInfo />
</div>
