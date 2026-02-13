<script lang="ts">
	import { atelier } from '$lib/state/atelier.svelte.js';
	import { shuttle } from '$lib/engine/shuttle.js';
	import { loom } from '$lib/engine/loom.svelte.js';

	// Layout Containers
	import AtelierHeader from '$lib/components/hud/AtelierHeader.svelte';
	import FolioSidebar from '$lib/components/hud/FolioSidebar.svelte';
	import InspectorSidebar from '$lib/components/hud/InspectorSidebar.svelte';
	import StatusFooter from '$lib/components/hud/StatusFooter.svelte';

	// Canvas
	import Linen from '$lib/components/canvas/Linen.svelte';
	import SplashScreen from '$lib/components/brand/SplashScreen.svelte';

	// Overlay Modules
	import DyeBasin from '$lib/components/overlay/DyeBasin.svelte';
	import PatternCatalog from '$lib/components/overlay/PatternCatalog.svelte';
	import ArtifactCrate from '$lib/components/overlay/ArtifactCrate.svelte';
	import ArtisanGuide from '$lib/components/overlay/ArtisanGuide.svelte';
	import ArchivePattern from '$lib/components/overlay/ArchivePattern.svelte';
	import LinenSettings from '$lib/components/overlay/LinenSettings.svelte';
	import GoToModal from '$lib/components/overlay/GoToModal.svelte';
	import AudioBasin from '$lib/components/overlay/AudioBasin.svelte';
	import ArtisanCodex from '$lib/components/overlay/ArtisanCodex.svelte';

	import { onMount } from 'svelte';

	onMount(() => {
		// Delegate all input and heartbeats to the Loom Engine
		return loom.mount();
	});
</script>

<SplashScreen />

{#if atelier.studio.showArtisanGuide}
	<ArtisanGuide onClose={() => (atelier.studio.showArtisanGuide = false)} />
{/if}

{#if atelier.studio.showPatternCatalog}
	<PatternCatalog onClose={() => (atelier.studio.showPatternCatalog = false)} />
{/if}

{#if atelier.studio.showDyeBasin}
	<DyeBasin
		bind:value={atelier.paletteState.activeDye}
		onClose={() => (atelier.studio.showDyeBasin = false)}
	/>
{/if}

{#if atelier.studio.showArtifactCrate}
	<ArtifactCrate
		onExport={(format, scale, bgColor) => shuttle.createArtifact(format, scale, bgColor)}
		onClose={() => (atelier.studio.showArtifactCrate = false)}
	/>
{/if}

{#if atelier.studio.showArchivePattern}
	<ArchivePattern onClose={() => (atelier.studio.showArchivePattern = false)} />
{/if}

{#if atelier.studio.showLinenSettings}
	<LinenSettings onClose={() => (atelier.studio.showLinenSettings = false)} />
{/if}

{#if atelier.studio.showGoTo}
	<GoToModal onClose={() => (atelier.studio.showGoTo = false)} />
{/if}

{#if atelier.studio.showAudioBasin}
	<AudioBasin onClose={() => (atelier.studio.showAudioBasin = false)} />
{/if}

{#if atelier.studio.showArtisanCodex}
	<ArtisanCodex onClose={() => (atelier.studio.showArtisanCodex = false)} />
{/if}

<!-- HUD Layout -->
<div class="flex h-screen w-screen flex-col overflow-hidden bg-canvas-bg">
	<AtelierHeader />

	<div class="flex flex-1 overflow-hidden">
		<FolioSidebar />

		<main
			class="relative flex flex-1 items-center justify-center overflow-hidden bg-grid-border/20"
		>
			<div class="artisan-frame flex h-[96%] w-[96%] items-center justify-center overflow-hidden">
				<Linen />
			</div>
		</main>

		<InspectorSidebar />
	</div>

	<StatusFooter />
</div>
