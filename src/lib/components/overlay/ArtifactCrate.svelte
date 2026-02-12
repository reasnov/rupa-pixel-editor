<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { ExportEngine } from '../../engine/export.js';
	import Modal from '../ui/Modal.svelte';

	import { onMount } from 'svelte';

	let { onExport, onClose = () => (atelier.showArtifactCrate = false) } = $props<{
		onExport: (format: 'svg' | 'png', scale: number, bgColor: string) => void;
		onClose?: () => void;
	}>();

	let format = $state<'svg' | 'png'>('png');

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
		if (atelier.studio.exportBgColor !== 'transparent' && atelier.studio.exportBgColor !== '#eee8d5' && atelier.studio.exportBgColor !== '#000000') {
			atelier.studio.exportBgColor = customBg;
		}
	});
</script>

<Modal title="Artifact Crate" subtitle="Prepare Artifacts for Export" icon="🧺" {onClose}>
	<div class="flex flex-col gap-8">
		<!-- Format Selection -->
		<div class="grid grid-cols-2 gap-4">
			<button
				class="flex flex-col items-center gap-3 rounded-xl border-2 p-8 transition-all {format ===
				'png'
					? 'border-brand bg-brand/5'
					: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
				onclick={() => (format = 'png')}
			>
				<span class="text-4xl">🖼️</span>
				<div class="text-center">
					<h3 class="font-serif text-sm font-bold tracking-tight uppercase">Raster PNG</h3>
					<span class="font-serif text-[9px] font-bold tracking-widest uppercase opacity-40"
						>Pixel Perfect</span
					>
				</div>
			</button>
			<button
				class="flex flex-col items-center gap-3 rounded-xl border-2 p-8 transition-all {format ===
				'svg'
					? 'border-brand bg-brand/5'
					: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
				onclick={() => (format = 'svg')}
			>
				<span class="text-4xl">📐</span>
				<div class="text-center">
					<h3 class="font-serif text-sm font-bold tracking-tight uppercase">Vector SVG</h3>
					<span class="font-serif text-[9px] font-bold tracking-widest uppercase opacity-40"
						>Infinite Scale</span
					>
				</div>
			</button>
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
							class="h-10 w-10 rounded-xl border-2 {atelier.studio.exportBgColor === customBg
								? 'border-brand'
								: 'border-black/5'} artisan-checker-small"
							style="background-color: {customBg};"
							onclick={() => (atelier.studio.exportBgColor = customBg)}
							title="Custom Backdrop"
						></button>
						<input
							type="color"
							bind:value={customBg}
							class="h-10 w-16 cursor-pointer rounded-xl border border-black/5 bg-white p-1"
						/>
					</div>
				</div>

				{#if atelier.studio.canvasBgColor !== '#eee8d5'}
					<button
						onclick={() => {
							customBg = atelier.studio.canvasBgColor;
							atelier.studio.exportBgColor = customBg;
						}}
						class="flex items-center gap-2 font-serif text-[10px] font-bold tracking-widest uppercase text-brand opacity-60 hover:opacity-100"
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
</Modal>
