<script lang="ts">
	import Brand from '../brands/Brand.svelte';
	import ToolGroup from './ToolGroup.svelte';
	import ProjectInfo from './ProjectInfo.svelte';
	import ThemeSwitcher from '../elements/ThemeSwitcher.svelte';
</script>

<header class="hud-panel flex h-14 w-full items-center justify-between px-8 py-2 select-none">
	<!-- Left Side: Brand & Quick Tools -->
	<div class="flex items-center gap-12">
		<Brand size="sm" />

		<div class="h-6 w-px bg-text-main/10" aria-hidden="true"></div>

		<ToolGroup />
	</div>

	<!-- Right Side: Project Status & Theme -->
	<div class="flex items-center gap-6">
		<ThemeSwitcher />
		<ProjectInfo />
	</div>
</header>

<style>
	/* Specific header adjustments for the minimalist neutral theme */
	header {
		/* Force higher z-index to stay above sidebars if needed */
		z-index: 500;
	}
</style>
