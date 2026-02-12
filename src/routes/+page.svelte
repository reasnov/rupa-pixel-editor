<script lang="ts">
	import { atelier } from '$lib/state/atelier.svelte';
	import { ExportEngine } from '$lib/engine/export';
	import { loompad } from '$lib/engine/loompad';
	
	// Component Modules
	import SplashScreen from '$lib/components/brand/SplashScreen.svelte';
	import Linen from '$lib/components/canvas/Linen.svelte';
	import Header from '$lib/components/hud/Header.svelte';
	import DyePalette from '$lib/components/hud/DyePalette.svelte';
	import NeedleStats from '$lib/components/hud/NeedleStats.svelte';
	import WorkshopTools from '$lib/components/hud/WorkshopTools.svelte';
	
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
			const dataUrl = await ExportEngine.toPNG(
				atelier.linenWidth,
				atelier.linenHeight,
				atelier.stitches,
				scale,
				bgColor
			);
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

	function handleKeyDown(e: KeyboardEvent) {
		if (!atelier.isAppReady) return;
		atelier.resetInactivityTimer();

		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
			if (e.key === 'Escape') atelier.handleEscape();
			return;
		}

		const intent = loompad.getIntent(e, 'down');
		if (intent) {
			if (!intent.startsWith('MOVE_')) e.preventDefault();

			switch (intent) {
				case 'MOVE_UP': return atelier.moveNeedle(0, -1);
				case 'MOVE_DOWN': return atelier.moveNeedle(0, 1);
				case 'MOVE_LEFT': return atelier.moveNeedle(-1, 0);
				case 'MOVE_RIGHT': return atelier.moveNeedle(1, 0);
				case 'FLOW_STITCH': return (atelier.isCtrlPressed = true);
				case 'FLOW_UNSTITCH':
					atelier.isAltPressed = true;
					return (atelier.isSelecting = false);
				case 'FLOW_SELECT':
					atelier.isShiftPressed = true;
					if (!atelier.isSelecting) {
						atelier.isSelecting = true;
						atelier.startSelection();
					}
					return;
				case 'ESCAPE': return atelier.handleEscape();
				case 'OPEN_PALETTE': return (atelier.showPatternCatalog = !atelier.showPatternCatalog);
				case 'OPEN_DYES': return (atelier.showDyeBasin = !atelier.showDyeBasin);
				case 'OPEN_EXPORT': return (atelier.showArtifactCrate = true);
				case 'STITCH':
					if (atelier.isSelecting) return atelier.commitSelection();
					return atelier.stitch();
				case 'UNSTITCH': return atelier.unstitch();
				case 'PICK_DYE': return atelier.pickDye();
				case 'COPY': return atelier.copySelection();
				case 'CUT': return atelier.cutSelection();
				case 'PASTE': return atelier.pasteSelection();
				case 'FLIP_H': return atelier.flipLinen('horizontal');
				case 'FLIP_V': return atelier.flipLinen('vertical');
				case 'ROTATE': return atelier.rotateLinen();
				case 'CLEAR_LINEN': return atelier.clearLinen();
				case 'UNDO': return atelier.undo();
				case 'REDO': return atelier.redo();
				case 'ZOOM_IN': return atelier.setZoom(0.1);
				case 'ZOOM_OUT': return atelier.setZoom(-0.1);
				case 'RESET_ZOOM': return atelier.resetZoom();
				case 'TOGGLE_MUTE': return atelier.toggleMute();
				case 'OPEN_HELP': return (atelier.showArtisanGuide = true);
				default:
					if (intent.startsWith('SELECT_DYE_')) {
						const num = parseInt(intent.split('_')[2]);
						return atelier.selectPalette(num === 0 ? 9 : num - 1);
					}
			}
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		const intent = loompad.getIntent(e, 'up');
		const key = e.key.toLowerCase();

		if (intent === 'FLOW_STITCH' || key === 'control' || key === 'meta') {
			atelier.isCtrlPressed = false;
		} 
		
		if (intent === 'FLOW_UNSTITCH' || key === 'alt') {
			atelier.isAltPressed = false;
		} 
		
		if (intent === 'FLOW_SELECT' || key === 'shift') {
			atelier.isShiftPressed = false;
			atelier.isSelecting = false;
			atelier.selectionStart = null;
			atelier.selectionEnd = null;
		}
	}

	onMount(() => {
		const backupInterval = setInterval(() => atelier.backupProject(), 10 * 60 * 1000);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
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

<div class="relative flex h-screen flex-1 items-center justify-center overflow-hidden">
	<div class="artisan-frame flex h-[80vh] w-[82vw] items-center justify-center overflow-hidden">
		<Linen />
	</div>
</div>

<WorkshopTools />
