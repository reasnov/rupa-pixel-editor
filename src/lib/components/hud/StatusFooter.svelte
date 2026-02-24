<script lang="ts">
	import StateIndicator from './StateIndicator.svelte';
	import StatusBar from './StatusBar.svelte';
	import TimelinePanel from './ledger/TimelinePanel.svelte';
</script>

<footer class="hud-panel flex w-full flex-col border-t border-evergreen/10 bg-washi-white p-1">
	<TimelinePanel />

	<div class="flex h-7 w-full items-center justify-between px-4">
		<div class="flex items-center gap-4">
			<StateIndicator />
		</div>

		<StatusBar />
	</div>
</footer>

<style>
	footer {
		/* Specific footer override for the Rural Sanctuary theme */
		background-color: var(--color-washi-white);
		border-top: 1px solid var(--color-stone-path);
	}
</style>
