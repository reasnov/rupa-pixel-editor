<script lang="ts">
	import { __ } from '../../state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { ExportEngine } from '../../engine/export.js';
	import Modal from '../ui/Modal.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import ArtifactPreview from './ArtifactPreview.svelte';

	import { onMount } from 'svelte';

	let { onExport, onClose = () => (editor.showExportMenu = false) } = $props<{
		onExport: (
			format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4',
			scale: number,
			bgColor: string
		) => void;
		onClose?: () => void;
	}>();

	let format = $state<'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4'>('png');
	let showPicker = $state(false);
	let isCustomSelected = $state(false);

	let customBg = $state(editor.backgroundColor);

	onMount(() => {
		if (editor.backgroundColor !== '#eee8d5') {
			editor.studio.exportBgColor = editor.backgroundColor;
			customBg = editor.backgroundColor;
			isCustomSelected = true;
		}
	});

	$effect(() => {
		if (isCustomSelected) {
			editor.studio.exportBgColor = customBg;
		}
	});

	$effect(() => {
		const isKinetic =
			['webm', 'gif', 'mp4'].includes(format) ||
			(format === 'svg' && editor.project.frames.length > 1);
		if (editor.project.frames.length <= 1 && isKinetic) {
			format = 'png';
		}
	});
</script>

{#if showPicker}
	<ColorPicker bind:value={customBg} onClose={() => (showPicker = false)} />
{/if}

<Modal
	title={__({ key: 'export.title' })}
	subtitle={__({ key: 'export.subtitle' })}
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
			aria-label={__({ key: 'export.preview_label' })}
		>
			<ArtifactPreview
				{format}
				scale={editor.studio.exportScale}
				bgColor={editor.studio.exportBgColor}
			/>
		</div>

		<!-- Right: Settings - Independent Scroll -->
		<div
			class="custom-scrollbar flex h-full flex-1 flex-col gap-8 overflow-y-auto pr-4"
			role="group"
			aria-label={__({ key: 'export.settings_label' })}
		>
			<!-- Section: Static Art -->
			<div class="flex flex-col gap-3">
				<span
					class="font-serif text-[10px] font-bold tracking-[0.2em] text-studio-text/30 uppercase"
					aria-hidden="true"
				>
					{__({ key: 'export.static_title' })}
				</span>
				<div
					class="grid grid-cols-2 gap-3"
					role="radiogroup"
					aria-label={__({ key: 'export.static_formats_label' })}
				>
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
								{__({ key: 'export.formats.png' })}
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
								{__({ key: 'export.formats.webp' })}
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
								{__({ key: 'export.formats.jpg' })}
							</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'svg' && editor.project.frames.length <= 1
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
						onclick={() => (format = 'svg')}
						role="radio"
						aria-checked={format === 'svg' && editor.project.frames.length <= 1}
					>
						<span class="text-2xl" aria-hidden="true">📐</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'export.formats.svg_static' })}
							</h3>
						</div>
					</button>
				</div>
			</div>

			<!-- Section: Animated Flows -->
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<span
						class="font-serif text-[10px] font-bold tracking-[0.2em] text-studio-text/30 uppercase"
						aria-hidden="true"
					>
						{__({ key: 'export.animated_title' })}
					</span>
					{#if editor.project.frames.length <= 1}
						<span class="font-serif text-[9px] font-bold text-brand italic opacity-60">
							{__({ key: 'export.requires_frames' })}
						</span>
					{/if}
				</div>
				<div
					class="grid grid-cols-2 gap-3 {editor.project.frames.length <= 1 ? 'opacity-40' : ''}"
					role="radiogroup"
					aria-label={__({ key: 'export.kinetic_formats_label' })}
				>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'webm'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'} {editor.project.frames
							.length <= 1
							? 'pointer-events-none opacity-20'
							: ''}"
						onclick={() => (format = 'webm')}
						disabled={editor.project.frames.length <= 1}
						role="radio"
						aria-checked={format === 'webm'}
					>
						<span class="text-2xl" aria-hidden="true">🎬</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'export.formats.webm' })}
							</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'gif'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'} {editor.project.frames
							.length <= 1
							? 'pointer-events-none opacity-20'
							: ''}"
						onclick={() => (format = 'gif')}
						disabled={editor.project.frames.length <= 1}
						role="radio"
						aria-checked={format === 'gif'}
					>
						<span class="text-2xl" aria-hidden="true">🎀</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'export.formats.gif' })}
							</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
						'mp4'
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'} {editor.project.frames
							.length <= 1
							? 'pointer-events-none opacity-20'
							: ''}"
						onclick={() => (format = 'mp4')}
						disabled={editor.project.frames.length <= 1}
						role="radio"
						aria-checked={format === 'mp4'}
					>
						<span class="text-2xl" aria-hidden="true">📽️</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'export.formats.mp4' })}
							</h3>
						</div>
					</button>
					<button
						class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'svg' && editor.project.frames.length > 1
							? 'border-brand bg-brand/5'
							: 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'} {editor.project.frames
							.length <= 1
							? 'pointer-events-none opacity-20'
							: ''}"
						onclick={() => (format = 'svg')}
						disabled={editor.project.frames.length <= 1}
						role="radio"
						aria-checked={format === 'svg' && editor.project.frames.length > 1}
					>
						<span class="text-2xl" aria-hidden="true">📐</span>
						<div class="text-center">
							<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
								{__({ key: 'export.formats.svg_kinetic' })}
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
							{__({ key: 'export.scale_label' })}
						</label>
						<span class="font-serif text-[10px] text-studio-text/40">
							{__({ key: 'export.scale_desc' })}
						</span>
					</div>
					<input
						id="scale-input"
						type="number"
						bind:value={editor.studio.exportScale}
						min="1"
						max="100"
						class="w-24 rounded-xl border border-black/10 bg-white px-4 py-2 font-mono text-lg text-studio-text focus:outline-none"
					/>
				</div>

				{#if format === 'webm' || format === 'gif' || format === 'mp4' || (format === 'svg' && editor.project.frames.length > 1)}
					<div class="h-px w-full bg-black/5" aria-hidden="true"></div>
					<div class="flex items-center justify-between">
						<div class="flex flex-col gap-1">
							<label
								for="fps-input"
								class="font-serif text-sm font-bold tracking-tight text-studio-text/60 uppercase"
							>
								{__({ key: 'export.fps_label' })}
							</label>
							<span class="font-serif text-[10px] text-studio-text/40">
								{__({ key: 'export.fps_desc' })}
							</span>
						</div>
						<input
							id="fps-input"
							type="number"
							bind:value={editor.studio.fps}
							min="1"
							max="60"
							class="w-24 rounded-xl border border-black/10 bg-white px-4 py-2 font-mono text-lg text-studio-text focus:outline-none"
						/>
					</div>
				{/if}

				<div class="h-px w-full bg-black/5" aria-hidden="true"></div>

				<!-- Pixel Borders Toggle -->
				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-bold tracking-tight text-charcoal/60 uppercase">
							{__({ key: 'export.grid_borders_label' })}
						</span>
						<span class="font-serif text-[10px] text-charcoal/40">
							{__({ key: 'export.grid_borders_desc' })}
						</span>
					</div>
					<button
						class="flex h-6 w-12 items-center rounded-full transition-colors {editor.studio
							.includePixelBorders
							? 'bg-brand'
							: 'bg-charcoal/10'}"
						onclick={() => (editor.studio.includePixelBorders = !editor.studio.includePixelBorders)}
						aria-label={__({ key: 'export.grid_borders_toggle' })}
					>
						<div
							class="h-4 w-4 rounded-full bg-white shadow-sm transition-transform {editor.studio
								.includePixelBorders
								? 'translate-x-7'
								: 'translate-x-1'}"
						></div>
					</button>
				</div>

				<div class="h-px w-full bg-black/5" aria-hidden="true"></div>

				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-bold tracking-tight text-studio-text/60 uppercase">
							{__({ key: 'export.background_label' })}
						</span>
						<span class="font-serif text-[10px] text-studio-text/40">
							{__({ key: 'export.background_desc' })}
						</span>
					</div>
					<div
						class="flex flex-wrap items-center gap-3"
						role="radiogroup"
						aria-label={__({ key: 'export.background_type_label' })}
					>
						<button
							class="h-10 w-10 rounded-xl border-2 {editor.studio.exportBgColor === 'transparent'
								? 'border-brand'
								: 'border-black/5'}"
							style="background: repeating-conic-gradient(#eee8d5 0% 25%, #fff 0% 50%) 50% / 10px 10px;"
							onclick={() => {
								editor.studio.exportBgColor = 'transparent';
								isCustomSelected = false;
							}}
							title={__({ key: 'export.background_transparent' })}
							role="radio"
							aria-checked={editor.studio.exportBgColor === 'transparent'}
						></button>
						<button
							class="h-10 w-10 rounded-xl border-2 {editor.studio.exportBgColor === '#eee8d5'
								? 'border-brand'
								: 'border-black/5'} bg-[#eee8d5]"
							onclick={() => {
								editor.studio.exportBgColor = '#eee8d5';
								isCustomSelected = false;
							}}
							title={__({ key: 'export.background_cream' })}
							role="radio"
							aria-checked={editor.studio.exportBgColor === '#eee8d5'}
						></button>
						<button
							class="h-10 w-10 rounded-xl border-2 {editor.studio.exportBgColor === '#000000'
								? 'border-brand'
								: 'border-black/5'} bg-black"
							onclick={() => {
								editor.studio.exportBgColor = '#000000';
								isCustomSelected = false;
							}}
							title={__({ key: 'export.background_black' })}
							role="radio"
							aria-checked={editor.studio.exportBgColor === '#000000'}
						></button>

						<div class="flex items-center gap-2">
							<button
								class="h-10 w-16 rounded-xl border-2 {isCustomSelected
									? 'border-brand'
									: 'border-black/5'} editor-checker-small transition-transform hover:scale-105"
								style="background-color: {customBg};"
								onclick={() => {
									isCustomSelected = true;
									editor.studio.exportBgColor = customBg;
									showPicker = true;
								}}
								title={__({ key: 'export.background_custom' })}
								role="radio"
								aria-checked={isCustomSelected}
							></button>
						</div>
					</div>

					{#if editor.backgroundColor !== '#eee8d5'}
						<button
							onclick={() => {
								customBg = editor.backgroundColor;
								editor.studio.exportBgColor = customBg;
							}}
							class="flex items-center gap-2 font-serif text-[10px] font-bold tracking-widest text-brand uppercase opacity-60 hover:opacity-100"
						>
							<span aria-hidden="true">🎨</span>
							{__({ key: 'export.match_canvas_background' })}
						</button>
					{/if}
				</div>
			</div>

			<button
				class="editor-primary-btn w-full py-5 text-xl"
				onclick={() => onExport(format, editor.studio.exportScale, editor.studio.exportBgColor)}
			>
				{__({ key: 'export.action' })}
			</button>
		</div>
	</div></Modal
>
