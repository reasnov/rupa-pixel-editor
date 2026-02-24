<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { fade } from 'svelte/transition';
	import Button from '../elements/Button.svelte';
	import Input from '../elements/Input.svelte';
	import Slider from '../elements/Slider.svelte';
	import Toggle from '../elements/Toggle.svelte';

	import { FormatLogic } from '../../logic/format.js';
	import { editor as engine } from '../../engine/editor.svelte.js';

	const studio = editor.studio;
</script>

<div class="editor-panel flex w-full flex-col gap-4 border-none bg-canvas-bg p-3 shadow-sm">
	<div class="flex items-center justify-between">
		<span class="font-serif text-[8px] font-black tracking-widest text-text-main/30 uppercase"
			>{__('tools:brush_settings.title')}</span
		>
		<div class="flex items-center gap-1.5">
			<Button
				variant="tool"
				isActive={studio.brushShape === 'SQUARE'}
				onclick={() => engine.handleIntent('TOGGLE_BRUSH_SHAPE')}
				ariaLabel="tools:brush_settings.shape_square"
				class="h-6 w-6 !p-0"
			>
				<span class="text-[10px]">■</span>
			</Button>
			<Button
				variant="tool"
				isActive={studio.brushShape === 'CIRCLE'}
				onclick={() => engine.handleIntent('TOGGLE_BRUSH_SHAPE')}
				ariaLabel="tools:brush_settings.shape_circle"
				class="h-6 w-6 !p-0"
			>
				<span class="text-[10px]">●</span>
			</Button>
		</div>
	</div>

	<!-- Size -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<span class="font-serif text-[10px] font-bold text-text-main/40 uppercase"
				>{__('tools:brush_settings.size_label')}</span
			>
			<div class="flex items-center gap-1">
				<Input
					type="number"
					ariaLabel="tools:brush_settings.size_label"
					bind:value={studio.brushSize}
					class="w-12"
				/>
				<span class="font-tiny5 text-[8px] text-text-main/30">{__('ui:units.pixels')}</span>
			</div>
		</div>
		<Slider
			min={1}
			max={100}
			bind:value={studio.brushSize}
			ariaLabel="tools:brush_settings.size_label"
		/>
	</div>

	<div class="h-px w-full bg-text-main/5"></div>

	<!-- Dither Blend Toggle -->
	<div class="flex items-center justify-between">
		<div class="flex flex-col">
			<span class="font-serif text-[10px] font-bold text-text-main/40 uppercase"
				>{__('tools:brush_settings.dither_label')}</span
			>
			<span class="font-serif text-[8px] text-text-main/30 italic"
				>{__('tools:brush_settings.dither_desc')}</span
			>
		</div>
		<Toggle
			bind:checked={studio.isDitherBlendActive}
			ariaLabel="tools:brush_settings.dither_label"
		/>
	</div>

	{#if studio.isDitherBlendActive}
		<div transition:fade={{ duration: 150 }} class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<span class="font-serif text-[10px] font-bold text-text-main/40 uppercase"
					>{__('tools:brush_settings.hardness_label')}</span
				>
				<div class="flex items-center gap-1">
					<Input
						type="number"
						ariaLabel="tools:brush_settings.hardness_label"
						bind:value={studio.brushHardness}
						class="w-12"
					/>
					<span class="font-tiny5 text-[8px] text-text-main/30">{__('ui:units.percentage')}</span>
				</div>
			</div>
			<Slider
				min={0}
				max={100}
				bind:value={studio.brushHardness}
				ariaLabel="tools:brush_settings.hardness_label"
			/>
		</div>
	{/if}
</div>
