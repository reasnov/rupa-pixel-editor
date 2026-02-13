<script lang="ts">
	import Brand from '../brand/Brand.svelte';
	import ToolGroup from './ToolGroup.svelte';
	import ProjectInfo from './ProjectInfo.svelte';
</script>

<div class="hud-panel relative flex h-16 w-full items-center justify-between px-6 py-2">
	<!-- Left: Tools -->
	<div class="flex items-center gap-6">
		<ToolGroup />
	</div>

	<!-- Center: Brand (Middle-Center) -->
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
		<Brand size="md" />
	</div>

	<!-- Right: Metadata -->
	<ProjectInfo />
</div>
