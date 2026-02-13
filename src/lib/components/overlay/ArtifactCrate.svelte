<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { ExportEngine } from '../../engine/export.js';
	import Modal from '../ui/Modal.svelte';
	import DyeBasin from './DyeBasin.svelte';
	import ArtifactPreview from './ArtifactPreview.svelte';

	import { onMount } from 'svelte';

	let { onExport, onClose = () => (atelier.showArtifactCrate = false) } = $props<{
		onExport: (
			format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm',
			scale: number,
			bgColor: string
		) => void;
		onClose?: () => void;
	}>();

	let format = $state<'svg' | 'png' | 'jpg' | 'webp' | 'webm'>('png');
	let showPicker = $state(false);

	// HSLA / Custom color state
	let customBg = $state(atelier.studio.canvasBgColor);

	onMount(() => {
		// Auto-match linen backdrop if it's customized
		if (atelier.studio.canvasBgColor !== '#eee8d5') {
			atelier.studio.exportBgColor = atelier.studio.canvasBgColor;
			customBg = atelier.studio.canvasBgColor;
		}
	});

	$effect(() => {
		// If user changes custom color input, update the export bg
		if (
			atelier.studio.exportBgColor !== 'transparent' &&
			atelier.studio.exportBgColor !== '#eee8d5' &&
			atelier.studio.exportBgColor !== '#000000'
		) {
			atelier.studio.exportBgColor = customBg;
		}
	});
</script>

{#if showPicker}
	<DyeBasin bind:value={customBg} onClose={() => (showPicker = false)} />
{/if}

<Modal
	title="Artifact Crate"
	subtitle="Prepare Artifacts for Export"
	icon="🧺"
	{onClose}
	width="1000px"
	scrollable={false}
>
	<div class="flex h-[550px] items-start gap-12 overflow-hidden">
		<!-- Left: Live Preview (Square Area) - Fixed -->
		<div
			class="flex aspect-square w-[420px] shrink-0 items-center justify-center rounded-2xl bg-black/5 p-6 ring-1 ring-black/5"
		>
			<ArtifactPreview
				{format}
				scale={atelier.studio.exportScale}
				bgColor={atelier.studio.exportBgColor}
			/>
		</div>

		<!-- Right: Settings - Independent Scroll -->
		<div class="custom-scrollbar flex h-full flex-1 flex-col gap-8 overflow-y-auto pr-4">
			<!-- Section: Static Stitches -->
			<div class="flex flex-col gap-3">
				<span class="font-serif text-[10px] font-bold tracking-[0.2em] uppercase opacity-30"
					>Static Stitches</span
				>
				<div class="grid grid-cols-2 gap-3">
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'png'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
						onclick={() => (format = 'png')}
					>
						<span class="text-2xl">🖼️</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">Raster PNG</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'webp'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
						onclick={() => (format = 'webp')}
					>
						<span class="text-2xl">🕸️</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">WebP</h3>
						</div>
					</button>
				</div>
			</div>

			<!-- Section: Kinetic Weaves -->
			<div class="flex flex-col gap-3">
				<span class="font-serif text-[10px] font-bold tracking-[0.2em] uppercase opacity-30"
					>Kinetic Weaves</span
				>
				<div class="grid grid-cols-2 gap-3">
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'webm'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
						onclick={() => (format = 'webm')}
					>
						<span class="text-2xl">🎬</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">Video WebM</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'svg'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
						onclick={() => (format = 'svg')}
					>
						<span class="text-2xl">📐</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">Vector SVG</h3>
						</div>
					</button>
				</div>
			</div>

			<!-- Settings -->
			<div class="flex flex-col gap-6 rounded-xl border border-black/5 bg-white/40 p-8">
				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-bold tracking-tight uppercase opacity-60"
							>Artifact Scale</span
						>
						<span class="font-serif text-[10px] opacity-40">Multiplier for raster output size</span>
					</div>
					<input
						type="number"
						bind:value={atelier.studio.exportScale}
						min="1"
						max="100"
						class="w-24 rounded-xl border border-black/10 bg-white px-4 py-2 font-mono text-lg focus:outline-none"
					/>
				</div>

				{#if format === 'webm' || (format === 'svg' && atelier.project.frames.length > 1)}
					<div class="h-px w-full bg-black/5"></div>
					<div class="flex items-center justify-between">
						<div class="flex flex-col gap-1">
							<span class="font-serif text-sm font-bold tracking-tight uppercase opacity-60"
								>Kinetic Pace (FPS)</span
							>
							<span class="font-serif text-[10px] opacity-40">Frames per second</span>
						</div>
						<input
							type="number"
							bind:value={atelier.studio.fps}
							min="1"
							max="60"
							class="w-24 rounded-xl border border-black/10 bg-white px-4 py-2 font-mono text-lg focus:outline-none"
						/>
					</div>
				{/if}

				<div class="h-px w-full bg-black/5"></div>

				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-bold tracking-tight uppercase opacity-60"
							>Background</span
						>
						<span class="font-serif text-[10px] opacity-40">Fill empty stitches with color</span>
					</div>
					<div class="flex flex-wrap items-center gap-3">
						<button
							class="h-10 w-10 rounded-xl border-2 {atelier.studio.exportBgColor === 'transparent'
								? 'border-brand'
								: 'border-black/5'}"
							style="background: repeating-conic-gradient(#eee8d5 0% 25%, #fff 0% 50%) 50% / 10px 10px;"
							onclick={() => (atelier.studio.exportBgColor = 'transparent')}
							title="Transparent"
						></button>
						<button
							class="h-10 w-10 rounded-xl border-2 {atelier.studio.exportBgColor === '#eee8d5'
								? 'border-brand'
								: 'border-black/5'} bg-[#eee8d5]"
							onclick={() => (atelier.studio.exportBgColor = '#eee8d5')}
							title="Studio Cream"
						></button>
						<button
							class="h-10 w-10 rounded-xl border-2 {atelier.studio.exportBgColor === '#000000'
								? 'border-brand'
								: 'border-black/5'} bg-black"
							onclick={() => (atelier.studio.exportBgColor = '#000000')}
							title="Deep Black"
						></button>

						<!-- Custom Option -->
						<div class="flex items-center gap-2">
							<button
								class="h-10 w-16 rounded-xl border-2 {atelier.studio.exportBgColor === customBg
									? 'border-brand'
									: 'border-black/5'} artisan-checker-small transition-transform hover:scale-105"
								style="background-color: {customBg};"
								onclick={() => {
									customBg = customBg; // Trigger reactivity if needed
									atelier.studio.exportBgColor = customBg;
									showPicker = true;
								}}
								title="Custom Backdrop"
							></button>
						</div>
					</div>

					{#if atelier.studio.canvasBgColor !== '#eee8d5'}
						<button
							onclick={() => {
								customBg = atelier.studio.canvasBgColor;
								atelier.studio.exportBgColor = customBg;
							}}
							class="flex items-center gap-2 font-serif text-[10px] font-bold tracking-widest text-brand uppercase opacity-60 hover:opacity-100"
						>
							<span>🎨</span> Match Linen Backdrop
						</button>
					{/if}
				</div>
			</div>

			<button
				class="artisan-primary-btn w-full py-5 text-xl"
				onclick={() => onExport(format, atelier.studio.exportScale, atelier.studio.exportBgColor)}
			>
				Weave & Export Artifact
			</button>
		</div>
	</div></Modal
>
