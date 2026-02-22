<script lang="ts">
	import ColorInspector from './ColorInspector.svelte';
	import CursorStats from './CursorStats.svelte';
	import ColorPalette from './ColorPalette.svelte';
	import VesselToolbar from './VesselToolbar.svelte';
	import BrushSettings from './BrushSettings.svelte';
</script>

<aside class="side-panel-right flex h-full w-full bg-washi-white/50">
	<!-- Vessel Tools (Quick Access) -->
	<div class="flex h-full flex-col border-r border-evergreen/5 bg-deep-forest/[0.02] px-2">
		<VesselToolbar />
	</div>

	<!-- Main Inspector Content -->
	<div class="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto p-3">
		<!-- Active Color & Palette -->
		<div class="flex flex-col gap-3">
			<BrushSettings />
			<ColorInspector />
			<ColorPalette />
		</div>

		<!-- Spacer -->
		<div class="flex-1"></div>

		<!-- Cursor Info -->
		<CursorStats />
	</div>
</aside>
