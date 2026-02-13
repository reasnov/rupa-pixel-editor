<script lang="ts">
	import ChordIndicator from './ledger/ChordIndicator.svelte';
	import StanceIndicator from './ledger/StanceIndicator.svelte';
	import AtmosphereIndicator from './ledger/AtmosphereIndicator.svelte';
	import SessionTimer from './ledger/SessionTimer.svelte';
	import SelectionInfo from './ledger/SelectionInfo.svelte';
	import CanvasMetadata from './ledger/CanvasMetadata.svelte';
</script>

<div
	class="flex flex-1 items-center justify-between px-6 opacity-60 transition-opacity hover:opacity-100"
>
	<div class="flex items-center gap-6">
		<ChordIndicator />
		<div class="h-3 w-px bg-brand/10"></div>
		<StanceIndicator />
		<div class="h-3 w-px bg-brand/10"></div>

		<div class="flex items-center gap-4">
			<SessionTimer />
			<AtmosphereIndicator />
			<div class="h-3 w-px bg-brand/10"></div>
			<SelectionInfo />
		</div>
	</div>

	<CanvasMetadata />
</div>
