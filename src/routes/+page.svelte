<script lang="ts">
	import { atelier } from '$lib/state/atelier.svelte';
	import { shuttle } from '$lib/engine/shuttle';
	import { loom } from '$lib/engine/loom.svelte';
	import { loompad } from '$lib/engine/loompad.svelte';
	import { ExportEngine } from '$lib/engine/export';
	
	// Component Modules
	import SplashScreen from '$lib/components/brand/SplashScreen.svelte';
	import Linen from '$lib/components/canvas/Linen.svelte';
	import Header from '$lib/components/hud/Header.svelte';
	import DyePalette from '$lib/components/hud/DyePalette.svelte';
	import NeedleStats from '$lib/components/hud/NeedleStats.svelte';
	import WorkshopTools from '$lib/components/hud/WorkshopTools.svelte';
	import KeyIndicator from '$lib/components/hud/KeyIndicator.svelte';
	
	// Overlay Modules
	import DyeBasin from '$lib/components/overlay/DyeBasin.svelte';
	import PatternCatalog from '$lib/components/overlay/PatternCatalog.svelte';
	import ArtifactCrate from '$lib/components/overlay/ArtifactCrate.svelte';
	import ArtisanGuide from '$lib/components/overlay/ArtisanGuide.svelte';
	
	import { onMount } from 'svelte';

	async function exportImage(
		format: 'svg' | 'png',
		scale: number = 10,
		bgColor: string | 'transparent' = 'transparent'
	) {
		if (format === 'svg') {
			const svg = ExportEngine.toSVG(atelier.linenWidth, atelier.linenHeight, atelier.stitches, bgColor);
			const blob = new Blob([svg], { type: 'image/svg+xml' });
			download(URL.createObjectURL(blob), 'stitch-art.svg');
		} else {
			const dataUrl = await ExportEngine.toPNG(atelier.linenWidth, atelier.linenHeight, atelier.stitches, scale, bgColor);
			download(dataUrl, 'stitch-art.png');
		}
		atelier.showArtifactCrate = false;
	}

	function download(url: string, filename: string) {
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
	}

	onMount(() => {
		const backupInterval = setInterval(() => shuttle.backup(), 10 * 60 * 1000);
		
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

{#if atelier.showArtisanGuide}
	<ArtisanGuide />
{/if}

{#if atelier.showPatternCatalog}
	<PatternCatalog />
{/if}

{#if atelier.showDyeBasin}
	<DyeBasin bind:value={atelier.activeDye} onClose={() => (atelier.showDyeBasin = false)} />
{/if}

{#if atelier.showArtifactCrate}
	<ArtifactCrate onExport={exportImage} />
{/if}

<Header />
<DyePalette />
<NeedleStats />
<KeyIndicator />

<div class="relative flex h-screen flex-1 items-center justify-center overflow-hidden">
	<div class="artisan-frame flex h-[80vh] w-[82vw] items-center justify-center overflow-hidden">
		<Linen />
	</div>
</div>

<WorkshopTools />
