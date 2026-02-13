<script lang="ts">
	import DyeInspector from './DyeInspector.svelte';
	import NeedleStats from './NeedleStats.svelte';
	import DyePalette from './DyePalette.svelte';
</script>

<aside class="side-panel-right flex h-full w-80 flex-col gap-6 border-l-2 border-grid-border p-4">
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
