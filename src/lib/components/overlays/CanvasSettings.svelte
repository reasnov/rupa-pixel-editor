<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import Dialog from '../elements/Dialog.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import Button from '../elements/Button.svelte';
	import Input from '../elements/Input.svelte';
	import Slider from '../elements/Slider.svelte';

	let { onClose = () => (editor.showCanvasSettings = false) } = $props<{
		onClose: () => void;
	}>();

	let width = $state(editor.canvas.width);
	let height = $state(editor.canvas.height);
	let showPicker = $state(false);

	function apply() {
		services.manipulation.resize(width, height);
		onClose();
	}
</script>

<Dialog
	title="workspace:settings.title"
	subtitle="workspace:settings.subtitle"
	isOpen={true}
	{onClose}
	width="450px"
>
	<div class="flex flex-col gap-8">
		<div class="flex flex-col gap-6 rounded-xl border border-text-main/5 bg-text-main/[0.05] p-8">
			<!-- Dimensions -->
			<div class="grid grid-cols-2 gap-8">
				<Input
					label="workspace:settings.width"
					type="number"
					bind:value={width}
					ariaLabel="workspace:settings.width"
				/>
				<Input
					label="workspace:settings.height"
					type="number"
					bind:value={height}
					ariaLabel="workspace:settings.height"
				/>
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
