<script lang="ts">
	import StateIndicator from './StateIndicator.svelte';
	import TechLedger from './TechLedger.svelte';
</script>

<footer
	class="hud-panel flex h-10 w-full items-center justify-between border-t-2 border-grid-border bg-canvas-bg px-4 py-1"
>
	<div class="flex items-center gap-4">
		<StateIndicator />
	</div>

	<TechLedger />
</footer>
