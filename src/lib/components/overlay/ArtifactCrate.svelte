<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { ExportEngine } from '../../engine/export.js';
	import Modal from '../ui/Modal.svelte';
	import DyeBasin from './DyeBasin.svelte';
	import ArtifactPreview from './ArtifactPreview.svelte';

	import { onMount } from 'svelte';

	let { onExport, onClose = () => (atelier.showArtifactCrate = false) } = $props<{
		onExport: (
			format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4',
			scale: number,
			bgColor: string
		) => void;
		onClose?: () => void;
	}>();

	let format = $state<'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4'>('png');
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

	// Fallback logic for single-frame projects
	$effect(() => {
		const isKinetic =
			['webm', 'gif', 'mp4'].includes(format) ||
			(format === 'svg' && atelier.project.frames.length > 1);
		if (atelier.project.frames.length <= 1 && isKinetic) {
			format = 'png';
		}
	});
</script>

{#if showPicker}
	<DyeBasin bind:value={customBg} onClose={() => (showPicker = false)} />
{/if}

<Modal
	title={__({ key: 'artifact.title' })}
	subtitle={__({ key: 'artifact.subtitle' })}
	icon="🧺"
	{onClose}
	width="1000px"
	scrollable={false}
>
	<div class="flex h-[550px] items-start gap-12 overflow-hidden">
		<!-- Left: Live Preview (Square Area) - Fixed -->
		<div
			class="flex aspect-square w-[420px] shrink-0 items-center justify-center rounded-2xl bg-black/5 p-6 ring-1 ring-black/5"
			role="img"
			aria-label="Artifact Preview"
		>
			<ArtifactPreview
				{format}
				scale={atelier.studio.exportScale}
				bgColor={atelier.studio.exportBgColor}
			/>
		</div>

		<!-- Right: Settings - Independent Scroll -->
		<div
			class="custom-scrollbar flex h-full flex-1 flex-col gap-8 overflow-y-auto pr-4"
			role="group"
			aria-label="Export Settings"
		>
			<!-- Section: Static Stitches -->
			<div class="flex flex-col gap-3">
				<span
					class="font-serif text-[10px] font-bold tracking-[0.2em] text-studio-text/30 uppercase"
					aria-hidden="true"
				>
					{__({ key: 'artifact.static_title' })}
				</span>
				<div class="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Static Formats">
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'png'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
						onclick={() => (format = 'png')}
						role="radio"
						aria-checked={format === 'png'}
					>
						<span class="text-2xl" aria-hidden="true">🖼️</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'artifact.formats.png' })}
							</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'webp'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
						onclick={() => (format = 'webp')}
						role="radio"
						aria-checked={format === 'webp'}
					>
						<span class="text-2xl" aria-hidden="true">🕸️</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'artifact.formats.webp' })}
							</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'jpg'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
						onclick={() => (format = 'jpg')}
						role="radio"
						aria-checked={format === 'jpg'}
					>
						<span class="text-2xl" aria-hidden="true">📷</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'artifact.formats.jpg' })}
							</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'svg' && atelier.project.frames.length <= 1
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
						onclick={() => (format = 'svg')}
						role="radio"
						aria-checked={format === 'svg' && atelier.project.frames.length <= 1}
					>
						<span class="text-2xl" aria-hidden="true">📐</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'artifact.formats.svg_static' })}
							</h3>
						</div>
					</button>
				</div>
			</div>

			<!-- Section: Kinetic Weaves -->
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<span
						class="font-serif text-[10px] font-bold tracking-[0.2em] text-studio-text/30 uppercase"
						aria-hidden="true"
					>
						{__({ key: 'artifact.kinetic_title' })}
					</span>
					{#if atelier.project.frames.length <= 1}
						<span class="font-serif text-[9px] font-bold text-brand italic opacity-60">
							{__({ key: 'artifact.requires_frames' })}
						</span>
					{/if}
				</div>
				<div
					class="grid grid-cols-2 gap-3 {atelier.project.frames.length <= 1 ? 'opacity-40' : ''}"
					role="radiogroup"
					aria-label="Kinetic Formats"
				>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'webm'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'} {atelier.project.frames
							.length <= 1
							? 'pointer-events-none opacity-20'
							: ''}"
						onclick={() => (format = 'webm')}
						disabled={atelier.project.frames.length <= 1}
						role="radio"
						aria-checked={format === 'webm'}
					>
						<span class="text-2xl" aria-hidden="true">🎬</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'artifact.formats.webm' })}
							</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'gif'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'} {atelier.project.frames
							.length <= 1
							? 'pointer-events-none opacity-20'
							: ''}"
						onclick={() => (format = 'gif')}
						disabled={atelier.project.frames.length <= 1}
						role="radio"
						aria-checked={format === 'gif'}
					>
						<span class="text-2xl" aria-hidden="true">🎀</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'artifact.formats.gif' })}
							</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'mp4'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'} {atelier.project.frames
							.length <= 1
							? 'pointer-events-none opacity-20'
							: ''}"
						onclick={() => (format = 'mp4')}
						disabled={atelier.project.frames.length <= 1}
						role="radio"
						aria-checked={format === 'mp4'}
					>
						<span class="text-2xl" aria-hidden="true">📽️</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'artifact.formats.mp4' })}
							</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'svg' && atelier.project.frames.length > 1
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'} {atelier.project.frames
							.length <= 1
							? 'pointer-events-none opacity-20'
							: ''}"
						onclick={() => (format = 'svg')}
						disabled={atelier.project.frames.length <= 1}
						role="radio"
						aria-checked={format === 'svg' && atelier.project.frames.length > 1}
					>
						<span class="text-2xl" aria-hidden="true">🌀</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'artifact.formats.svg_kinetic' })}
							</h3>
						</div>
					</button>
				</div>
			</div>

			<!-- Settings -->
			<div class="flex flex-col gap-6 rounded-xl border border-black/5 bg-white/40 p-8">
				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<label
							for="scale-input"
							class="font-serif text-sm font-bold tracking-tight text-studio-text/60 uppercase"
						>
							{__({ key: 'artifact.scale_label' })}
						</label>
						<span class="font-serif text-[10px] text-studio-text/40">
							{__({ key: 'artifact.scale_desc' })}
						</span>
					</div>
					<input
						id="scale-input"
						type="number"
						bind:value={atelier.studio.exportScale}
						min="1"
						max="100"
						class="w-24 rounded-xl border border-black/10 bg-white px-4 py-2 font-mono text-lg text-studio-text focus:outline-none"
					/>
				</div>

				{#if format === 'webm' || format === 'gif' || format === 'mp4' || (format === 'svg' && atelier.project.frames.length > 1)}
					<div class="h-px w-full bg-black/5" aria-hidden="true"></div>
					<div class="flex items-center justify-between">
						<div class="flex flex-col gap-1">
							<label
								for="fps-input"
								class="font-serif text-sm font-bold tracking-tight text-studio-text/60 uppercase"
							>
								{__({ key: 'artifact.fps_label' })}
							</label>
							<span class="font-serif text-[10px] text-studio-text/40">
								{__({ key: 'artifact.fps_desc' })}
							</span>
						</div>
						<input
							id="fps-input"
							type="number"
							bind:value={atelier.studio.fps}
							min="1"
							max="60"
							class="w-24 rounded-xl border border-black/10 bg-white px-4 py-2 font-mono text-lg text-studio-text focus:outline-none"
						/>
					</div>
				{/if}

				<div class="h-px w-full bg-black/5" aria-hidden="true"></div>

				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-bold tracking-tight text-studio-text/60 uppercase">
							{__({ key: 'artifact.bg_label' })}
						</span>
						<span class="font-serif text-[10px] text-studio-text/40">
							{__({ key: 'artifact.bg_desc' })}
						</span>
					</div>
					<div
						class="flex flex-wrap items-center gap-3"
						role="radiogroup"
						aria-label="Background Type"
					>
						<button
							class="h-10 w-10 rounded-xl border-2 {atelier.studio.exportBgColor === 'transparent'
								? 'border-brand'
								: 'border-black/5'}"
							style="background: repeating-conic-gradient(#eee8d5 0% 25%, #fff 0% 50%) 50% / 10px 10px;"
							onclick={() => (atelier.studio.exportBgColor = 'transparent')}
							title="Transparent"
							role="radio"
							aria-checked={atelier.studio.exportBgColor === 'transparent'}
						></button>
						<button
							class="h-10 w-10 rounded-xl border-2 {atelier.studio.exportBgColor === '#eee8d5'
								? 'border-brand'
								: 'border-black/5'} bg-[#eee8d5]"
							onclick={() => (atelier.studio.exportBgColor = '#eee8d5')}
							title="Studio Cream"
							role="radio"
							aria-checked={atelier.studio.exportBgColor === '#eee8d5'}
						></button>
						<button
							class="h-10 w-10 rounded-xl border-2 {atelier.studio.exportBgColor === '#000000'
								? 'border-brand'
								: 'border-black/5'} bg-black"
							onclick={() => (atelier.studio.exportBgColor = '#000000')}
							title="Deep Black"
							role="radio"
							aria-checked={atelier.studio.exportBgColor === '#000000'}
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
								role="radio"
								aria-checked={atelier.studio.exportBgColor === customBg}
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
							<span aria-hidden="true">🎨</span>
							{__({ key: 'artifact.match_linen' })}
						</button>
					{/if}
				</div>
			</div>

			<button
				class="artisan-primary-btn w-full py-5 text-xl"
				onclick={() => onExport(format, atelier.studio.exportScale, atelier.studio.exportBgColor)}
			>
				{__({ key: 'artifact.export_action' })}
			</button>
		</div>
	</div></Modal
>
