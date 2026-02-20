<script lang="ts">
	import ColorInspector from './ColorInspector.svelte';
	import CursorStats from './CursorStats.svelte';
	import ColorPalette from './ColorPalette.svelte';
	import VesselToolbar from './VesselToolbar.svelte';
	import BrushSettings from './BrushSettings.svelte';
</script>

<aside class="side-panel-right flex h-full w-full border-l border-charcoal/10 bg-foam-white/50">
	<!-- Vessel Tools (Quick Access) -->
	<div class="flex h-full flex-col border-r border-charcoal/5 bg-charcoal/[0.02] px-2">
		<VesselToolbar />
	</div>

	<!-- Main Inspector Content -->
	<div class="flex flex-1 flex-col gap-4 p-3 overflow-y-auto custom-scrollbar">
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
