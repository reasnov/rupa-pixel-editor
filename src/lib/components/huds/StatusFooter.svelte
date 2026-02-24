<script lang="ts">
	import StateIndicator from './StateIndicator.svelte';
	import StatusBar from './StatusBar.svelte';
	import TimelinePanel from './indicators/TimelinePanel.svelte';
</script>

<footer class="hud-panel flex w-full flex-col border-t border-text-main/10 bg-canvas-bg p-1">
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
		background-color: var(--color-canvas-bg);
		border-top: 1px solid var(--color-grid-border);
	}
</style>
