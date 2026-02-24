<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { fade } from 'svelte/transition';

	const studio = editor.studio;
</script>

<div class="editor-panel flex w-full flex-col gap-4 border-none bg-washi-white p-3 shadow-sm">
	<div class="flex items-center justify-between">
		<span class="font-serif text-[8px] font-black tracking-widest text-evergreen/30 uppercase"
			>{__('tools:brush_settings.title')}</span
		>
		<div class="flex items-center gap-1.5">
			<button
				onclick={() => (studio.brushShape = 'SQUARE')}
				class="h-5 w-5 rounded border transition-all {studio.brushShape === 'SQUARE'
					? 'border-lantern-gold bg-lantern-gold text-white shadow-sm'
					: 'border-transparent bg-evergreen/5 text-evergreen/40 hover:bg-evergreen/10'}"
				title={__('tools:brush_settings.shape_square')}
			>
				<span class="text-[10px]">■</span>
			</button>
			<button
				onclick={() => (studio.brushShape = 'CIRCLE')}
				class="h-5 w-5 rounded border transition-all {studio.brushShape === 'CIRCLE'
					? 'border-lantern-gold bg-lantern-gold text-white shadow-sm'
					: 'border-transparent bg-evergreen/5 text-evergreen/40 hover:bg-evergreen/10'}"
				title={__('tools:brush_settings.shape_circle')}
			>
				<span class="text-[10px]">●</span>
			</button>
		</div>
	</div>

	<!-- Size -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<span class="font-serif text-[10px] font-bold text-evergreen/40 uppercase"
				>{__('tools:brush_settings.size_label')}</span
			>
			<div class="flex items-center gap-1">
				<input
					type="number"
					min="1"
					max="100"
					bind:value={studio.brushSize}
					class="editor-input-number w-10"
				/>
				<span class="font-tiny5 text-[8px] text-evergreen/30">px</span>
			</div>
		</div>
		<input
			type="range"
			min="1"
			max="100"
			step="1"
			bind:value={studio.brushSize}
			class="editor-slider"
		/>
	</div>

	<div class="h-px w-full bg-evergreen/5"></div>

	<!-- Dither Blend Toggle -->
	<div class="flex items-center justify-between">
		<div class="flex flex-col">
			<span class="font-serif text-[10px] font-bold text-evergreen/40 uppercase"
				>{__('tools:brush_settings.dither_label')}</span
			>
			<span class="font-serif text-[8px] text-evergreen/30 italic"
				>{__('tools:brush_settings.dither_desc')}</span
			>
		</div>
		<button
			onclick={() => (studio.isDitherBlendActive = !studio.isDitherBlendActive)}
			class="flex h-4 w-8 items-center rounded-full transition-colors {studio.isDitherBlendActive
				? 'bg-lantern-gold'
				: 'bg-evergreen/10'}"
			aria-label={__('tools:brush_settings.dither_label')}
		>
			<div
				class="h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform {studio.isDitherBlendActive
					? 'translate-x-4.5'
					: 'translate-x-1'}"
			></div>
		</button>
	</div>

	{#if studio.isDitherBlendActive}
		<div transition:fade={{ duration: 150 }} class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<span class="font-serif text-[10px] font-bold text-evergreen/40 uppercase"
					>{__('tools:brush_settings.hardness_label')}</span
				>
				<div class="flex items-center gap-1">
					<input
						type="number"
						min="0"
						max="100"
						bind:value={studio.brushHardness}
						class="editor-input-number w-10"
					/>
					<span class="font-tiny5 text-[8px] text-evergreen/30">%</span>
				</div>
			</div>
			<input
				type="range"
				min="0"
				max="100"
				step="1"
				bind:value={studio.brushHardness}
				class="editor-slider"
			/>
		</div>
	{/if}
</div>
