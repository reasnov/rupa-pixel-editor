<script lang="ts">
	import DyeInspector from './DyeInspector.svelte';
	import NeedleStats from './NeedleStats.svelte';
	import FolioLedger from './FolioLedger.svelte';
</script>

<div
	class="pointer-events-none fixed top-0 right-0 z-40 flex h-full flex-col items-end justify-center gap-6 p-8"
>
	<!-- 0. Folio & Veils -->
	<div class="pointer-events-auto">
		<FolioLedger />
	</div>

	<!-- 1. Coordinates & Size -->
	<div class="pointer-events-auto">
		<NeedleStats />
	</div>

	<!-- 2. Unified Dye Panel (Active & History) -->
	<div class="pointer-events-auto">
		<DyeInspector />
	</div>
</div>
