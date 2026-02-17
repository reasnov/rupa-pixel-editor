<script lang="ts">
	import ChordIndicator from './ledger/ChordIndicator.svelte';
	import ModeIndicator from './ledger/ModeIndicator.svelte';
	import AtmosphereIndicator from './ledger/AtmosphereIndicator.svelte';
	import SessionTimer from './ledger/SessionTimer.svelte';
	import SelectionInfo from './ledger/SelectionInfo.svelte';
	import CanvasMetadata from './ledger/CanvasMetadata.svelte';
</script>

<div
	class="flex flex-1 items-center justify-between px-3 opacity-80 transition-opacity hover:opacity-100"
>
	<div class="flex items-center gap-4">
		<ChordIndicator />
		<div class="h-3 w-px bg-charcoal/20"></div>
		<ModeIndicator />
		<div class="h-3 w-px bg-charcoal/20"></div>

		<div class="flex items-center gap-3">
			<SessionTimer />
			<AtmosphereIndicator />
			<div class="h-3 w-px bg-charcoal/20"></div>
			<SelectionInfo />
		</div>
	</div>

	<CanvasMetadata />
</div>
