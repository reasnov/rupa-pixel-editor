<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { ExportEngine } from '../../engine/export.js';
	import Modal from '../ui/Modal.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import ExportPreview from './ExportPreview.svelte';

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { onExport, onClose = () => (editor.showExportMenu = false) } = $props<{
		onExport: (
			format: 'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4',
			scale: number,
			bgColor: string
		) => Promise<void> | void;
		onClose?: () => void;
	}>();

	let activeTab = $state<'image' | 'video'>('image');
	let format = $state<'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4'>('png');
	let showPicker = $state(false);
	let isCustomSelected = $state(false);
	let isExporting = $state(false);

	let customBg = $state(editor.backgroundColor);

	// Derived logic for valid formats based on project state
	let canUseVideo = $derived(editor.project.frames.length > 1);

	function setTab(tab: 'image' | 'video') {
		if (isExporting) return;
		activeTab = tab;
		if (tab === 'image') format = 'png';
		else if (canUseVideo) format = 'gif';
		else {
			activeTab = 'image';
			format = 'png';
		}
	}

	function handleClose() {
		if (isExporting) {
			editor.studio.show('Please wait, brewing in progress...');
			return;
		}
		onClose();
	}

	async function handleExport() {
		if (isExporting) return;

		const isKinetic =
			['webm', 'gif', 'mp4'].includes(format) || (format === 'svg' && activeTab === 'video');
		if (isKinetic && !canUseVideo) {
			editor.studio.show(__('export:status.requires_frames'));
			return;
		}

		isExporting = true;
		try {
			await onExport(format, editor.studio.exportScale, editor.studio.exportBgColor);
		} finally {
			isExporting = false;
		}
	}

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
</script>

{#if showPicker}
	<ColorPicker bind:value={customBg} onClose={() => (showPicker = false)} />
{/if}

<Modal
	title={__('export:title')}
	subtitle={__('export:subtitle')}
	icon="📦"
	onClose={handleClose}
	width="1000px"
	scrollable={false}
>
	<div class="flex h-[550px] items-start gap-12 overflow-hidden">
		<!-- Left: Live Preview (Square Area) - Fixed -->
		<div
			class="flex aspect-square w-[420px] shrink-0 items-center justify-center rounded-2xl bg-evergreen/5 p-6 ring-1 ring-evergreen/5"
			role="img"
			aria-label={__('export:preview_label')}
		>
			<ExportPreview
				{format}
				scale={editor.studio.exportScale}
				bgColor={editor.studio.exportBgColor}
			/>
		</div>

		<!-- Right: Settings - Independent Scroll -->
		<div
			class="custom-scrollbar flex h-full flex-1 flex-col gap-6 overflow-y-auto pr-4"
			role="group"
			aria-label={__('export:settings_label')}
		>
			<!-- Tab Switcher -->
			<div
				class="flex rounded-xl bg-evergreen/5 p-1 {isExporting
					? 'pointer-events-none opacity-50'
					: ''}"
			>
				<button
					onclick={() => setTab('image')}
					class="flex-1 rounded-lg py-2 font-serif text-[10px] font-bold tracking-widest uppercase transition-all {activeTab ===
					'image'
						? 'bg-white text-lantern-gold shadow-sm'
						: 'text-evergreen/40 hover:text-evergreen'}"
				>
					{__('export:tabs.image')}
				</button>
				<button
					onclick={() => setTab('video')}
					class="flex-1 rounded-lg py-2 font-serif text-[10px] font-bold tracking-widest uppercase transition-all {activeTab ===
					'video'
						? 'bg-white text-lantern-gold shadow-sm'
						: 'text-evergreen/40 hover:text-evergreen'}"
				>
					{__('export:tabs.video')}
				</button>
			</div>

			{#if activeTab === 'image'}
				<!-- Section: Static Art -->
				<div class="flex flex-col gap-3" transition:fade={{ duration: 150 }}>
					<div
						class="grid grid-cols-2 gap-3 {isExporting ? 'pointer-events-none opacity-50' : ''}"
						role="radiogroup"
					>
						<button
							class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'png'
								? 'border-lantern-gold bg-lantern-gold/5'
								: 'border-evergreen/5 bg-white/40 opacity-40 hover:opacity-100'}"
							onclick={() => (format = 'png')}
							role="radio"
							aria-checked={format === 'png'}
						>
							<span class="text-2xl" aria-hidden="true">🖼️</span>
							<div class="text-center">
								<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
									{__('export:format.png')}
								</h3>
							</div>
						</button>
						<button
							class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'webp'
								? 'border-lantern-gold bg-lantern-gold/5'
								: 'border-evergreen/5 bg-white/40 opacity-40 hover:opacity-100'}"
							onclick={() => (format = 'webp')}
							role="radio"
							aria-checked={format === 'webp'}
						>
							<span class="text-2xl" aria-hidden="true">🕸️</span>
							<div class="text-center">
								<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
									{__('export:format.webp')}
								</h3>
							</div>
						</button>
						<button
							class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'jpg'
								? 'border-lantern-gold bg-lantern-gold/5'
								: 'border-evergreen/5 bg-white/40 opacity-40 hover:opacity-100'}"
							onclick={() => (format = 'jpg')}
							role="radio"
							aria-checked={format === 'jpg'}
						>
							<span class="text-2xl" aria-hidden="true">📷</span>
							<div class="text-center">
								<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
									{__('export:format.jpg')}
								</h3>
							</div>
						</button>
						<button
							class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'svg'
								? 'border-lantern-gold bg-lantern-gold/5'
								: 'border-evergreen/5 bg-white/40 opacity-40 hover:opacity-100'}"
							onclick={() => (format = 'svg')}
							role="radio"
							aria-checked={format === 'svg'}
						>
							<span class="text-2xl" aria-hidden="true">📐</span>
							<div class="text-center">
								<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
									{__('export:format.svg_static')}
								</h3>
							</div>
						</button>
					</div>

					<!-- Selection Strategy -->
					<div
						class="mt-2 flex flex-col gap-4 rounded-xl border border-evergreen/5 bg-evergreen/5 p-4 {isExporting
							? 'pointer-events-none opacity-50'
							: ''}"
					>
						<div class="flex flex-col gap-1">
							<span
								class="font-serif text-[10px] font-bold tracking-widest text-evergreen/60 uppercase"
							>
								{__('export:label.selection')}
							</span>
							<span class="font-serif text-[9px] text-evergreen/40">
								{__('export:description.selection')}
							</span>
						</div>
						<div class="grid grid-cols-2 gap-2" role="radiogroup">
							{#each ['ACTIVE', 'VISIBLE', 'SELECTED', 'ALL'] as opt}
								{@const count =
									opt === 'ACTIVE'
										? 1
										: opt === 'VISIBLE'
											? editor.project.frames.filter((f) => f.isVisible).length
											: opt === 'SELECTED'
												? editor.project.selectedFrameIndices.size
												: editor.project.frames.length}
								<button
									class="rounded-lg border px-2 py-2 text-center transition-all {editor.studio
										.exportFrameSelection === opt
										? 'border-lantern-gold bg-white text-lantern-gold shadow-sm'
										: 'border-transparent bg-white/20 text-evergreen/50 hover:bg-white/40'}"
									onclick={() => (editor.studio.exportFrameSelection = opt as any)}
									role="radio"
									aria-checked={editor.studio.exportFrameSelection === opt}
								>
									<span class="font-serif text-[9px] font-bold tracking-tight uppercase">
										{__(`common:export.selection.${opt.toLowerCase()}`)}
										{#if opt !== 'ACTIVE'}({count}){/if}
									</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			{:else}
				<!-- Section: Animated Flows -->
				<div class="flex flex-col gap-3" transition:fade={{ duration: 150 }}>
					{#if !canUseVideo}
						<div class="rounded-xl border border-lantern-gold/20 bg-lantern-gold/5 p-4 text-center">
							<span class="font-serif text-xs font-bold text-lantern-gold italic">
								{__('export:status.requires_frames')}
							</span>
						</div>
					{/if}
					<div
						class="grid grid-cols-2 gap-3 {!canUseVideo || isExporting
							? 'pointer-events-none opacity-40'
							: ''}"
						role="radiogroup"
					>
						<button
							class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'gif'
								? 'border-lantern-gold bg-lantern-gold/5'
								: 'border-evergreen/5 bg-white/40 opacity-40 hover:opacity-100'}"
							onclick={() => (format = 'gif')}
							role="radio"
							aria-checked={format === 'gif'}
						>
							<span class="text-2xl" aria-hidden="true">🎀</span>
							<div class="text-center">
								<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
									{__('export:format.gif')}
								</h3>
							</div>
						</button>
						<button
							class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'webm'
								? 'border-lantern-gold bg-lantern-gold/5'
								: 'border-evergreen/5 bg-white/40 opacity-40 hover:opacity-100'}"
							onclick={() => (format = 'webm')}
							role="radio"
							aria-checked={format === 'webm'}
						>
							<span class="text-2xl" aria-hidden="true">🎬</span>
							<div class="text-center">
								<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
									{__('export:format.webm')}
								</h3>
							</div>
						</button>
						<button
							class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'mp4'
								? 'border-lantern-gold bg-lantern-gold/5'
								: 'border-evergreen/5 bg-white/40 opacity-40 hover:opacity-100'}"
							onclick={() => (format = 'mp4')}
							role="radio"
							aria-checked={format === 'mp4'}
						>
							<span class="text-2xl" aria-hidden="true">📽️</span>
							<div class="text-center">
								<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
									{__('export:format.mp4')}
								</h3>
							</div>
						</button>
						<button
							class="flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all {format ===
							'svg'
								? 'border-lantern-gold bg-lantern-gold/5'
								: 'border-evergreen/5 bg-white/40 opacity-40 hover:opacity-100'}"
							onclick={() => (format = 'svg')}
							role="radio"
							aria-checked={format === 'svg'}
						>
							<span class="text-2xl" aria-hidden="true">📐</span>
							<div class="text-center">
								<h3 class="font-serif text-[10px] font-bold tracking-tight uppercase">
									{__('export:format.svg_kinetic')}
								</h3>
							</div>
						</button>
					</div>

					<!-- FPS Control -->
					<div
						class="mt-2 flex items-center justify-between rounded-xl bg-evergreen/5 p-4 {isExporting
							? 'pointer-events-none opacity-50'
							: ''}"
					>
						<div class="flex flex-col gap-1">
							<label
								for="fps-input"
								class="font-serif text-[10px] font-bold tracking-widest text-evergreen/60 uppercase"
							>
								{__('export:label.fps')}
							</label>
							<span class="font-serif text-[9px] text-evergreen/40">
								{__('export:description.fps')}
							</span>
						</div>
						<input
							id="fps-input"
							type="number"
							bind:value={editor.project.fps}
							min="1"
							max="60"
							class="w-20 rounded-xl border border-evergreen/10 bg-white px-4 py-2 font-mono text-lg text-evergreen focus:outline-none"
						/>
					</div>
				</div>
			{/if}

			<!-- Global Settings -->
			<div
				class="flex flex-col gap-5 rounded-xl border border-evergreen/5 bg-white/40 p-6 {isExporting
					? 'pointer-events-none opacity-50'
					: ''}"
			>
				<!-- Scale -->
				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<label
							for="scale-input"
							class="font-serif text-[10px] font-bold tracking-widest text-evergreen/60 uppercase"
						>
							{__('export:label.scale')}
						</label>
						<span class="font-serif text-[9px] text-evergreen/40">
							{__('export:description.scale')}
						</span>
					</div>
					<input
						id="scale-input"
						type="number"
						bind:value={editor.studio.exportScale}
						min="1"
						max="100"
						class="w-20 rounded-xl border border-evergreen/10 bg-white px-4 py-2 font-mono text-lg text-evergreen focus:outline-none"
					/>
				</div>

				<div class="h-px w-full bg-evergreen/5" aria-hidden="true"></div>

				<!-- Pixel Borders -->
				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<span
							class="font-serif text-[10px] font-bold tracking-widest text-evergreen/60 uppercase"
						>
							{__('export:label.borders')}
						</span>
						<span class="font-serif text-[9px] text-evergreen/40">
							{__('export:description.borders')}
						</span>
					</div>
					<button
						class="flex h-6 w-12 items-center rounded-full transition-colors {editor.studio
							.includePixelBorders
							? 'bg-lantern-gold'
							: 'bg-evergreen/10'}"
						onclick={() => (editor.studio.includePixelBorders = !editor.studio.includePixelBorders)}
						aria-label={__('export:label.borders')}
					>
						<div
							class="h-4 w-4 rounded-full bg-white shadow-sm transition-transform {editor.studio
								.includePixelBorders
								? 'translate-x-7'
								: 'translate-x-1'}"
						></div>
					</button>
				</div>

				<div class="h-px w-full bg-evergreen/5" aria-hidden="true"></div>

				<!-- Background -->
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<span
							class="font-serif text-[10px] font-bold tracking-widest text-evergreen/60 uppercase"
						>
							{__('export:label.background')}
						</span>
						<span class="font-serif text-[9px] text-evergreen/40">
							{__('export:description.background')}
						</span>
					</div>
					<div class="flex flex-wrap items-center gap-3" role="radiogroup">
						<button
							class="h-10 w-10 rounded-xl border-2 {editor.studio.exportBgColor === 'transparent'
								? 'border-lantern-gold'
								: 'border-evergreen/5'}"
							style="background: repeating-conic-gradient(#dad7cd 0% 25%, #fff 0% 50%) 50% / 10px 10px;"
							onclick={() => {
								editor.studio.exportBgColor = 'transparent';
								isCustomSelected = false;
							}}
							title={__('export:background.transparent')}
							role="radio"
							aria-checked={editor.studio.exportBgColor === 'transparent'}
						></button>
						<button
							class="h-10 w-10 rounded-xl border-2 {editor.studio.exportBgColor === '#fdf6e3'
								? 'border-lantern-gold'
								: 'border-evergreen/5'} bg-[#fdf6e3]"
							onclick={() => {
								editor.studio.exportBgColor = '#fdf6e3';
								isCustomSelected = false;
							}}
							title={__('export:background.cream')}
							role="radio"
							aria-checked={editor.studio.exportBgColor === '#fdf6e3'}
						></button>
						<button
							class="h-10 w-10 rounded-xl border-2 {editor.studio.exportBgColor === '#333d29'
								? 'border-lantern-gold'
								: 'border-evergreen/5'} bg-[#333d29]"
							onclick={() => {
								editor.studio.exportBgColor = '#333d29';
								isCustomSelected = false;
							}}
							title={__('export:background.black')}
							role="radio"
							aria-checked={editor.studio.exportBgColor === '#333d29'}
						></button>

						<div class="flex items-center gap-2">
							<button
								class="h-10 w-16 rounded-xl border-2 {isCustomSelected
									? 'border-lantern-gold'
									: 'border-evergreen/5'} editor-checker-small transition-transform hover:scale-105"
								style="background-color: {customBg};"
								onclick={() => {
									isCustomSelected = true;
									editor.studio.exportBgColor = customBg;
									showPicker = true;
								}}
								title={__('export:background.custom')}
								role="radio"
								aria-checked={isCustomSelected}
							></button>
						</div>
					</div>

					{#if editor.backgroundColor !== '#fdf6e3'}
						<button
							onclick={() => {
								customBg = editor.backgroundColor;
								editor.studio.exportBgColor = customBg;
							}}
							class="flex items-center gap-2 font-serif text-[10px] font-bold tracking-widest text-lantern-gold uppercase opacity-60 hover:opacity-100"
						>
							<span aria-hidden="true">🎨</span>
							{__('export:background.match_canvas')}
						</button>
					{/if}
				</div>
			</div>

			<div class="flex flex-col gap-3">
				{#if isExporting}
					<div class="flex flex-col gap-2" transition:fade>
						<div
							class="flex items-center justify-between font-serif text-[10px] font-bold tracking-widest text-lantern-gold uppercase"
						>
							<span>{__('export:status.progress')}</span>
							<span>{editor.studio.exportProgress}%</span>
						</div>
						<div
							class="h-1.5 w-full overflow-hidden rounded-full bg-evergreen/5 ring-1 ring-evergreen/5"
						>
							<div
								class="h-full bg-lantern-gold transition-all duration-300 ease-out"
								style="width: {editor.studio.exportProgress}%"
							></div>
						</div>
					</div>
				{/if}

				<button
					class="editor-primary-btn flex w-full items-center justify-center gap-3 py-5 text-xl transition-all {isExporting
						? 'opacity-80'
						: ''}"
					onclick={handleExport}
					disabled={isExporting || (activeTab === 'video' && !canUseVideo)}
				>
					{#if isExporting}
						<span class="animate-spin text-2xl">⏳</span>
						<span>{__('export:status.brewing')}</span>
					{:else}
						<span>{__('export:button.submit')}</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
</Modal>
