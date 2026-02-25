<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Dialog from '../elements/Dialog.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import Button from '../elements/Button.svelte';
	import Input from '../elements/Input.svelte';
	import Slider from '../elements/Slider.svelte';

	let { onClose = () => (editor.showSettings = false) } = $props<{
		onClose: () => void;
	}>();

	let widthStr = $state(editor.canvas.width.toString());
	let heightStr = $state(editor.canvas.height.toString());
	let isRatioLocked = $state(false);
	let ratio = editor.canvas.width / editor.canvas.height;
	let showPicker = $state(false);

	/**
	 * Safely evaluates simple math expressions (+, -, *, /).
	 */
	function evaluate(val: string): number {
		try {
			// Sanitize input: allow only digits and operators
			const clean = val.replace(/[^0-9+\-*/.]/g, '');
			// Use Function constructor as a safer alternative to eval for simple math
			const result = new Function(`return ${clean}`)();
			return isNaN(result) ? 0 : Math.round(result);
		} catch {
			return parseInt(val) || 0;
		}
	}

	function handleWidthChange() {
		const val = evaluate(widthStr);
		if (isRatioLocked && val > 0) {
			const newHeight = Math.round(val / ratio);
			heightStr = newHeight.toString();
		}
	}

	function handleHeightChange() {
		const val = evaluate(heightStr);
		if (isRatioLocked && val > 0) {
			const newWidth = Math.round(val * ratio);
			widthStr = newWidth.toString();
		}
	}

	function toggleLock() {
		isRatioLocked = !isRatioLocked;
		if (isRatioLocked) {
			ratio = evaluate(widthStr) / evaluate(heightStr) || 1;
		}
	}

	function apply() {
		const finalW = Math.max(1, evaluate(widthStr));
		const finalH = Math.max(1, evaluate(heightStr));
		services.manipulation.resize(finalW, finalH);
		onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			apply();
		}
	}
</script>

<Dialog
	title="workspace:settings.title"
	subtitle="workspace:settings.subtitle"
	isOpen={true}
	{onClose}
	width="450px"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="flex flex-col gap-8" onkeydown={handleKeydown}>
		<div class="flex flex-col gap-6 rounded-xl border border-text-main/5 bg-text-main/[0.05] p-8">
			<!-- Dimensions -->
			<div class="relative flex items-end gap-4">
				<div class="flex-1">
					<Input
						label="workspace:settings.width"
						type="text"
						bind:value={widthStr}
						oninput={handleWidthChange}
						ariaLabel="workspace:settings.width"
					/>
				</div>

				<button
					onclick={toggleLock}
					class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border transition-all {isRatioLocked
						? 'border-ui-accent bg-ui-accent/10 text-ui-accent shadow-inner'
						: 'border-text-main/10 bg-canvas-bg text-text-main/30 hover:text-text-main/60'}"
					title="Lock Aspect Ratio"
				>
					<span class="text-xs">{isRatioLocked ? '🔒' : '🔓'}</span>
				</button>

				<div class="flex-1">
					<Input
						label="workspace:settings.height"
						type="text"
						bind:value={heightStr}
						oninput={handleHeightChange}
						ariaLabel="workspace:settings.height"
					/>
				</div>
			</div>

			<div class="h-px w-full bg-text-main/5" aria-hidden="true"></div>

			<!-- Stabilization -->
			<Slider
				label="workspace:settings.stabilization"
				bind:value={editor.studio.stabilization}
				min={0}
				max={100}
				ariaLabel="workspace:settings.stabilization"
			/>

			<div class="h-px w-full bg-text-main/5" aria-hidden="true"></div>

			<!-- Flow Pace (FPS) -->
			<Input
				label="workspace:settings.fps_label"
				type="number"
				bind:value={editor.project.fps}
				min={1}
				max={60}
				ariaLabel="workspace:settings.fps_label"
				class="w-24"
			/>

			<div class="h-px w-full bg-text-main/5" aria-hidden="true"></div>

			<!-- Backdrop -->
			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-1">
					<span class="font-serif text-sm font-bold tracking-tight text-text-main/60 uppercase">
						{__('workspace:settings.background_label')}
					</span>
					<span class="font-serif text-[10px] text-text-main/40">
						{__('workspace:settings.background_desc')}
					</span>
				</div>
				<div class="flex items-center gap-3">
					<div
						class="flex items-center gap-1.5 rounded-lg border border-text-main/5 bg-text-main/[0.03] p-1"
					>
						<button
							class="h-6 w-6 rounded-md border border-text-main/10 shadow-sm transition-transform hover:scale-110 active:scale-95"
							style="background-color: #fdf6e3;"
							onclick={() => (editor.backgroundColor = '#fdf6e3')}
							title="Canvas Cream (Washi White)"
							aria-label="Set background to Canvas Cream"
						></button>
						<button
							class="h-6 w-6 rounded-md border border-text-main/10 shadow-sm transition-transform hover:scale-110 active:scale-95"
							style="background-color: #121412;"
							onclick={() => (editor.backgroundColor = '#121412')}
							title="Canvas Dark (Night Washi)"
							aria-label="Set background to Canvas Dark"
						></button>
					</div>

					<button
						class="group relative flex items-center gap-3"
						onclick={() => (showPicker = true)}
						aria-label={__('actions:pick_color')}
					>
						<div
							class="editor-checker-small h-10 w-16 rounded-xl border-2 border-canvas-bg shadow-sm transition-transform group-hover:scale-105"
							style="background-color: {editor.backgroundColor};"
						></div>
						<div
							class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-ui-accent text-[8px] text-white opacity-0 transition-opacity group-hover:opacity-100"
						>
							🎨
						</div>
					</button>
				</div>
			</div>

			<p class="font-serif text-[10px] leading-relaxed text-text-main/40 italic">
				{__('workspace:settings.note')}
			</p>
		</div>

		<Button
			variant="primary"
			class="w-full py-4 text-lg"
			onclick={apply}
			ariaLabel="workspace:settings.apply"
		>
			{__('workspace:settings.apply')}
		</Button>
	</div>
</Dialog>

{#if showPicker}
	<ColorPicker bind:value={editor.backgroundColor} onClose={() => (showPicker = false)} />
{/if}
