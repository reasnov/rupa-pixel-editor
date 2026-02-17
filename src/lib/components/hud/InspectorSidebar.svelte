<script lang="ts">
	import ColorInspector from './ColorInspector.svelte';
	import CursorStats from './CursorStats.svelte';
	import ColorPalette from './ColorPalette.svelte';
</script>

<aside
	class="side-panel-right flex h-full w-full flex-col gap-4 border-l border-charcoal/10 bg-foam-white/50 p-3"
>
	<!-- Active Color & Palette -->
	<div class="flex flex-col gap-3">
		<ColorInspector />
		<ColorPalette />
	</div>

	<!-- Spacer -->
	<div class="flex-1"></div>

	<!-- Cursor Info -->
	<CursorStats />
</aside>
