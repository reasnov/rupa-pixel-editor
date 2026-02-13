<script lang="ts">
	import DyeInspector from './DyeInspector.svelte';
	import NeedleStats from './NeedleStats.svelte';
	import DyePalette from './DyePalette.svelte';
</script>

<aside class="side-panel-right flex h-full w-full flex-col gap-6 p-4">
	<!-- Active Dye & Palette -->
	<div class="flex flex-col gap-4">
		<DyeInspector />
		<DyePalette />
	</div>

	<!-- Spacer -->
	<div class="flex-1"></div>

	<!-- Needle Precision Info -->
	<NeedleStats />
</aside>
