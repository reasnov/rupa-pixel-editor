<script lang="ts">
	import StateIndicator from './StateIndicator.svelte';
	import DebugBar from './DebugBar.svelte';
</script>

<div class="pointer-events-none fixed bottom-0 left-0 z-50 flex w-full flex-col items-center">
	<!-- State Indicator (Floating above the technischen ledger) -->
	<div class="pointer-events-auto mb-6">
		<StateIndicator />
	</div>

	<!-- Technical Ledger -->
	<div class="pointer-events-auto w-full">
		<DebugBar />
	</div>
</div>
