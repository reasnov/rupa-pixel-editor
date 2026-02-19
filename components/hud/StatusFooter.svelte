<script lang="ts">
	import StateIndicator from './StateIndicator.svelte';
	import TechLedger from './TechLedger.svelte';
	import TimelinePanel from './ledger/TimelinePanel.svelte';
</script>

<footer class="hud-panel flex w-full flex-col border-t border-charcoal/10 bg-foam-white p-1">
	<TimelinePanel />

	<div class="flex h-7 w-full items-center justify-between px-4">
		<div class="flex items-center gap-4">
			<StateIndicator />
		</div>

		<TechLedger />
	</div>
</footer>

<style>
	footer {
		/* Specific footer override for the neutral theme */
		background-color: var(--color-foam-white);
		border-top: 1px solid var(--color-stone-medium);
	}
</style>
