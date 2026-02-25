<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { ExportEngine } from '../../engine/export.js';
	import Dialog from '../elements/Dialog.svelte';
	import Button from '../elements/Button.svelte';
	import Input from '../elements/Input.svelte';
	import Slider from '../elements/Slider.svelte';
	import Toggle from '../elements/Toggle.svelte';
	import Tabs from '../elements/Tabs.svelte';
	import Progress from '../elements/Progress.svelte';
	import ChoiceCard from '../elements/ChoiceCard.svelte';
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

	let activeTabId = $state('image');
	let format = $state<'svg' | 'png' | 'jpg' | 'webp' | 'webm' | 'gif' | 'mp4'>('png');
	let showPicker = $state(false);
	let isCustomSelected = $state(false);
	let isExporting = $state(false);

	let customBg = $state(editor.backgroundColor);

	// Derived logic for valid formats based on project state
	let canUseVideo = $derived(editor.project.frames.length > 1);

	function handleTabChange(tabId: string) {
		if (isExporting) return;
		activeTabId = tabId;
		if (tabId === 'image') format = 'png';
		else if (canUseVideo) format = 'gif';
		else {
			activeTabId = 'image';
			format = 'png';
		}
	}

	function handleClose() {
		if (isExporting) {
			editor.studio.show(__('ui:studio.wait_brewing'));
			return;
		}
		onClose();
	}

	async function handleExport() {
		if (isExporting) return;

		const isKinetic =
			['webm', 'gif', 'mp4'].includes(format) || (format === 'svg' && activeTabId === 'video');
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
		if (editor.backgroundColor !== '#fdf6e3') {
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

	const exportTabs = $derived([
		{ id: 'image', label: 'export:tabs.image' },
		{ id: 'video', label: 'export:tabs.video', disabled: !canUseVideo }
	]);

	const staticFormats = [
		{ id: 'png', label: 'export:format.png', icon: '🖼️' },
		{ id: 'webp', label: 'export:format.webp', icon: '🕸️' },
		{ id: 'jpg', label: 'export:format.jpg', icon: '📷' },
		{ id: 'svg', label: 'export:format.svg_static', icon: '📐' }
	];

	const kineticFormats = [
		{ id: 'gif', label: 'export:format.gif', icon: '🎀' },
		{ id: 'webm', label: 'export:format.webm', icon: '🎬' },
		{ id: 'mp4', label: 'export:format.mp4', icon: '📽️' },
		{ id: 'svg', label: 'export:format.svg_kinetic', icon: '📐' }
	];
</script>

{#if showPicker}
	<ColorPicker bind:value={customBg} onClose={() => (showPicker = false)} />
{/if}

<Dialog
	title="export:title"
	subtitle="export:subtitle"
	isOpen={true}
	onClose={handleClose}
	width="1000px"
>
	<div class="flex h-[75vh] flex-col items-start gap-12 overflow-hidden lg:flex-row">
		<!-- Left: Live Preview (Sticky/Scrollable Area) -->
		<div class="custom-scrollbar flex w-full shrink-0 flex-col gap-4 overflow-y-auto lg:h-full lg:w-[420px]">
			<div
				class="flex aspect-square w-full items-center justify-center rounded-2xl bg-text-main/5 p-6 ring-1 ring-text-main/5"
				role="img"
				aria-label={__('export:preview_label')}
			>
				<ExportPreview
					{format}
					scale={editor.studio.exportScale}
					bgColor={editor.studio.exportBgColor}
				/>
			</div>

			<div class="hidden flex-1 flex-col justify-end gap-2 lg:flex">
				<span class="font-serif text-[10px] font-bold text-text-main/40 uppercase tracking-widest">
					{__('export:preview_label')}
				</span>
				<p class="font-serif text-[9px] leading-relaxed text-text-main/30 italic">
					{__('export:description.scale')} & {__('export:description.background')}
				</p>
			</div>
		</div>

		<!-- Right: Settings (Independent Scrollable Area) -->
		<div class="custom-scrollbar flex h-full flex-1 flex-col gap-6 overflow-y-auto pr-4">
			<Tabs
				tabs={exportTabs}
				bind:activeTab={activeTabId}
				ariaLabel="export:settings_label"
				onchange={handleTabChange}
				class={isExporting ? 'pointer-events-none opacity-50' : ''}
			/>

			{#if activeTabId === 'image'}
				<!-- Section: Static Art -->
				<div class="flex flex-col gap-3" transition:fade={{ duration: 150 }}>
					<div
						class="grid grid-cols-2 gap-3 {isExporting ? 'pointer-events-none opacity-50' : ''}"
						role="radiogroup"
					>
						{#each staticFormats as f}
							<ChoiceCard
								id={f.id}
								label={f.label}
								icon={f.icon}
								isSelected={format === f.id}
								onclick={(id) => (format = id as any)}
								disabled={isExporting}
							/>
						{/each}
					</div>

					<!-- Selection Strategy -->
					<div
						class="mt-2 flex flex-col gap-4 rounded-xl border border-text-main/5 bg-text-main/5 p-4 {isExporting
							? 'pointer-events-none opacity-50'
							: ''}"
					>
						<div class="flex flex-col gap-1">
							<span
								class="font-serif text-[10px] font-bold tracking-widest text-text-main/60 uppercase"
							>
								{__('export:label.selection')}
							</span>
							<span class="font-serif text-[9px] text-text-main/40">
								{__('export:description.selection')}
							</span>
						</div>
						<div class="grid grid-cols-2 gap-2" role="radiogroup">
							{#each ['ACTIVE', 'VISIBLE', 'SELECTED', 'ALL', 'SELECTED_LAYERS'] as opt}
								{@const count =
									opt === 'ACTIVE'
										? 1
										: opt === 'VISIBLE'
											? editor.project.frames.filter((f) => f.isVisible).length
											: opt === 'SELECTED'
												? editor.project.selectedFrameIndices.size
												: opt === 'SELECTED_LAYERS'
													? editor.project.activeFrame.selectedLayerIndices.size
													: editor.project.frames.length}
								<button
									class="rounded-lg border px-2 py-2 text-center transition-all {editor.studio
										.exportFrameSelection === opt
										? 'border-ui-accent bg-white text-ui-accent shadow-sm'
										: 'border-transparent bg-white/20 text-text-main/50 hover:bg-white/40'}"
									onclick={() => (editor.studio.exportFrameSelection = opt as any)}
									role="radio"
									aria-checked={editor.studio.exportFrameSelection === opt}
								>
									<span class="font-serif text-[9px] font-bold tracking-tight uppercase">
										{__(`export:selection.${opt.toLowerCase()}`)}
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
						<div class="rounded-xl border border-ui-accent/20 bg-ui-accent/5 p-4 text-center">
							<span class="font-serif text-xs font-bold text-ui-accent italic">
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
						{#each kineticFormats as f}
							<ChoiceCard
								id={f.id}
								label={f.label}
								icon={f.icon}
								isSelected={format === f.id}
								onclick={(id) => (format = id as any)}
								disabled={!canUseVideo || isExporting}
							/>
						{/each}
					</div>

					<!-- FPS Control -->
					<Input
						label="export:label.fps"
						type="number"
						bind:value={editor.project.fps}
						min={1}
						max={60}
						ariaLabel="export:label.fps"
						class={isExporting ? 'pointer-events-none opacity-50' : ''}
					/>
				</div>
			{/if}

			<!-- Global Settings -->
			<div
				class="flex flex-col gap-5 rounded-xl border border-text-main/5 bg-text-main/[0.05] p-6 {isExporting
					? 'pointer-events-none opacity-50'
					: ''}"
			>
				<Input
					label="export:label.scale"
					type="number"
					bind:value={editor.studio.exportScale}
					min={1}
					max={100}
					ariaLabel="export:label.scale"
				/>

				<div class="h-px w-full bg-text-main/5" aria-hidden="true"></div>

				<div class="flex items-center justify-between">
					<div class="flex flex-col gap-1">
						<span
							class="font-serif text-[10px] font-bold tracking-widest text-text-main/60 uppercase"
						>
							{__('export:label.borders')}
						</span>
						<span class="font-serif text-[9px] text-text-main/40">
							{__('export:description.borders')}
						</span>
					</div>
					<Toggle
						bind:checked={editor.studio.includePixelBorders}
						ariaLabel="export:label.borders"
					/>
				</div>

				<div class="h-px w-full bg-text-main/5" aria-hidden="true"></div>

				<!-- Background -->
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<span
							class="font-serif text-[10px] font-bold tracking-widest text-text-main/60 uppercase"
						>
							{__('export:label.background')}
						</span>
						<span class="font-serif text-[9px] text-text-main/40">
							{__('export:description.background')}
						</span>
					</div>
					<div class="flex flex-wrap items-center gap-3" role="radiogroup">
						<button
							class="h-10 w-10 rounded-xl border-2 {editor.studio.exportBgColor === 'transparent'
								? 'border-ui-accent'
								: 'border-text-main/5'}"
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
								? 'border-ui-accent'
								: 'border-text-main/5'} bg-[#fdf6e3]"
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
								? 'border-ui-accent'
								: 'border-text-main/5'} bg-[#333d29]"
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
									? 'border-ui-accent'
									: 'border-text-main/5'} editor-checker-small transition-transform hover:scale-105"
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
						<Button
							variant="ghost"
							size="sm"
							onclick={() => {
								customBg = editor.backgroundColor;
								editor.studio.exportBgColor = customBg;
							}}
							ariaLabel="export:background.match_canvas"
							class="flex items-center gap-2 !p-0 text-ui-accent opacity-60 hover:opacity-100"
						>
							<span aria-hidden="true">🎨</span>
							{__('export:background.match_canvas')}
						</Button>
					{/if}
				</div>
			</div>

			<div class="flex flex-col gap-3">
				{#if isExporting}
					<Progress
						label="export:status.progress"
						value={editor.studio.exportProgress}
						class="mb-2"
					/>
				{/if}

				<Button
					variant="primary"
					class="w-full py-5 text-xl"
					onclick={handleExport}
					disabled={isExporting || (activeTabId === 'video' && !canUseVideo)}
					ariaLabel="export:button.submit"
				>
					{#if isExporting}
						<span class="animate-spin text-2xl">⏳</span>
						<span>{__('export:status.brewing')}</span>
					{:else}
						<span>{__('export:button.submit')}</span>
					{/if}
				</Button>
			</div>
		</div>
	</div>
</Dialog>
