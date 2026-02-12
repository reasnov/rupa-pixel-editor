<script lang="ts">
	import { atelier } from '$lib/state/atelier.svelte.js';
	import { shuttle } from '$lib/engine/shuttle.js';
	import { loom } from '$lib/engine/loom.svelte.js';
	import { loompad } from '$lib/engine/loompad.svelte.js';
	import { ExportEngine } from '$lib/engine/export.js';
	
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

	async function exportImage(
		format: 'svg' | 'png',
		scale: number = 10,
		bgColor: string | 'transparent' = 'transparent'
	) {
		if (format === 'svg') {
			const svg = ExportEngine.toSVG(atelier.linen.width, atelier.linen.height, atelier.linen.stitches, bgColor);
			const blob = new Blob([svg], { type: 'image/svg+xml' });
			download(URL.createObjectURL(blob), 'stitch-art.svg');
		} else {
			const dataUrl = await ExportEngine.toPNG(atelier.linen.width, atelier.linen.height, atelier.linen.stitches, scale, bgColor);
			download(dataUrl, 'stitch-art.png');
		}
		atelier.studio.showArtifactCrate = false;
	}

	function download(url: string, filename: string) {
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
	}

	onMount(() => {
		const backupInterval = setInterval(() => shuttle.persistence.backup(), 10 * 60 * 1000);
		
		const onKeyDown = (e: KeyboardEvent) => loom.handleInput(e, 'down');
		const onKeyUp = (e: KeyboardEvent) => loom.handleInput(e, 'up');

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			clearInterval(backupInterval);
		};
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
	<DyeBasin value={atelier.paletteState.activeDye} onClose={() => (atelier.studio.showDyeBasin = false)} />
{/if}

{#if atelier.studio.showArtifactCrate}
	<ArtifactCrate onExport={exportImage} onClose={() => (atelier.studio.showArtifactCrate = false)} />
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
