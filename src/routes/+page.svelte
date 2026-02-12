<script lang="ts">
	import { atelier } from '$lib/state/atelier.svelte.js';
	import { shuttle } from '$lib/engine/shuttle.js';
	import { loom } from '$lib/engine/loom.svelte.js';

	// Layout Containers
	import TopBar from '$lib/components/hud/TopBar.svelte';
	import LeftBar from '$lib/components/hud/LeftBar.svelte';
	import RightBar from '$lib/components/hud/RightBar.svelte';
	import BottomBar from '$lib/components/hud/BottomBar.svelte';

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

<!-- HUD Bars -->
<TopBar />
<LeftBar />
<RightBar />
<BottomBar />

<div class="relative flex h-screen flex-1 items-center justify-center overflow-hidden">
	<div class="artisan-frame flex h-[80vh] w-[82vw] items-center justify-center overflow-hidden">
		<Linen />
	</div>
</div>
