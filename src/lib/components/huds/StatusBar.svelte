<script lang="ts">
	import ChordIndicator from './indicators/ChordIndicator.svelte';
	import ModeIndicator from './indicators/ModeIndicator.svelte';
	import AtmosphereIndicator from './indicators/AtmosphereIndicator.svelte';
	import SessionTimer from './indicators/SessionTimer.svelte';
	import SelectionInfo from './indicators/SelectionInfo.svelte';
	import CanvasMetadata from './indicators/CanvasMetadata.svelte';
	import EtchingIndicator from './indicators/EtchingIndicator.svelte';
</script>

<div
	class="flex flex-1 items-center justify-between px-3 opacity-80 transition-opacity hover:opacity-100"
>
	<div class="flex items-center gap-4">
		<ChordIndicator />
		<div class="h-3 w-px bg-text-main/20"></div>
		<ModeIndicator />
		<div class="h-3 w-px bg-text-main/20"></div>

		<div class="flex items-center gap-3">
			<EtchingIndicator />
			<div class="h-3 w-px bg-text-main/20"></div>
			<SessionTimer />
			<AtmosphereIndicator />
			<div class="h-3 w-px bg-text-main/20"></div>
			<SelectionInfo />
		</div>
	</div>

	<CanvasMetadata />
</div>
