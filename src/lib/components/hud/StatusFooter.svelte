<script lang="ts">
	import StateIndicator from './StateIndicator.svelte';
	import TechLedger from './TechLedger.svelte';
	import SpindlePanel from './ledger/SpindlePanel.svelte';
</script>

<footer class="hud-panel flex w-full flex-col border-t-2 border-grid-border bg-canvas-bg px-4 py-1">
	<SpindlePanel />

	<div class="flex h-10 w-full items-center justify-between">
		<div class="flex items-center gap-4">
			<StateIndicator />
		</div>

		<TechLedger />
	</div>
</footer>
