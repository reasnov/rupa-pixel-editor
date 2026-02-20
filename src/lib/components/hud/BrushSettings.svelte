<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { fade } from 'svelte/transition';

	const studio = editor.studio;
</script>

<div class="editor-panel flex w-full flex-col gap-4 border-none bg-foam-white p-3 shadow-sm">
	<div class="flex items-center justify-between">
		<span class="font-serif text-[8px] font-black tracking-widest text-charcoal/30 uppercase"
			>Brush Settings</span
		>
		<div class="flex items-center gap-1.5">
			<button
				onclick={() => (studio.brushShape = 'SQUARE')}
				class="h-5 w-5 rounded border transition-all {studio.brushShape === 'SQUARE'
					? 'bg-brand text-white border-brand shadow-sm'
					: 'bg-charcoal/5 border-transparent text-charcoal/40 hover:bg-charcoal/10'}"
				title="Square Vessel"
			>
				<span class="text-[10px]">■</span>
			</button>
			<button
				onclick={() => (studio.brushShape = 'CIRCLE')}
				class="h-5 w-5 rounded border transition-all {studio.brushShape === 'CIRCLE'
					? 'bg-brand text-white border-brand shadow-sm'
					: 'bg-charcoal/5 border-transparent text-charcoal/40 hover:bg-charcoal/10'}"
				title="Circle Vessel"
			>
				<span class="text-[10px]">●</span>
			</button>
		</div>
	</div>

	<!-- Size -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<span class="font-serif text-[10px] font-bold text-charcoal/40 uppercase">Grind Size</span>
			<div class="flex items-center gap-1">
				<input
					type="number"
					min="1"
					max="100"
					bind:value={studio.brushSize}
					class="editor-input-number w-10"
				/>
				<span class="font-tiny5 text-[8px] text-charcoal/30">px</span>
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

	<div class="h-px w-full bg-charcoal/5"></div>

	<!-- Dither Blend Toggle -->
	<div class="flex items-center justify-between">
		<div class="flex flex-col">
			<span class="font-serif text-[10px] font-bold text-charcoal/40 uppercase">Aroma Blend</span>
			<span class="font-serif text-[8px] text-charcoal/30 italic">Checkerboard dithering</span>
		</div>
		<button
			onclick={() => (studio.isDitherBlendActive = !studio.isDitherBlendActive)}
			class="flex h-4 w-8 items-center rounded-full transition-colors {studio.isDitherBlendActive
				? 'bg-brand'
				: 'bg-charcoal/10'}"
			aria-label="Toggle Aroma Blend"
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
				<span class="font-serif text-[10px] font-bold text-charcoal/40 uppercase">Frothiness</span>
				<div class="flex items-center gap-1">
					<input
						type="number"
						min="0"
						max="100"
						bind:value={studio.brushHardness}
						class="editor-input-number w-10"
					/>
					<span class="font-tiny5 text-[8px] text-charcoal/30">%</span>
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
