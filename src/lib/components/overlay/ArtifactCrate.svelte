<script lang="ts">
	import { atelier } from '../../state/atelier.svelte';
	import { ExportEngine } from '../../engine/export';
	import DyeBasin from './DyeBasin.svelte';
	import { onMount } from 'svelte';

	let { onExport } = $props<{
		onExport: (format: 'png' | 'svg', scale: number, bgColor: string | 'transparent') => void;
	}>();

	let customWidth = $state(atelier.linenWidth * atelier.exportScale);
	let isCustom = $state(false);
	let previewUrl = $state('');
	let showBgPicker = $state(false);

	const presets = [0.5, 1, 2, 4, 10, 20];
	const bgPresets = [
		{ label: 'Transparent', value: 'transparent' },
		{ label: 'Studio Cream', value: '#fdf6e3' },
		{ label: 'White', value: '#ffffff' },
		{ label: 'Black', value: '#000000' }
	];

	async function updatePreview() {
		previewUrl = await ExportEngine.toPNG(
			atelier.linenWidth,
			atelier.linenHeight,
			atelier.stitches,
			5,
			atelier.exportBgColor
		);
	}

	function handlePresetClick(s: number) {
		atelier.exportScale = s;
		customWidth = atelier.linenWidth * s;
		isCustom = false;
	}

	function handleCustomInput(e: Event) {
		const val = parseInt((e.target as HTMLInputElement).value);
		if (!isNaN(val) && val > 0) {
			customWidth = val;
			atelier.exportScale = val / atelier.linenWidth;
			isCustom = true;
		}
	}

	function close() {
		atelier.showArtifactCrate = false;
	}

	$effect(() => {
		atelier.exportBgColor;
		updatePreview();
	});

	$effect(() => {
		atelier.pushEscapeAction(close);
		return () => atelier.popEscapeAction(close);
	});

	onMount(() => {
		updatePreview();
	});
</script>

<div
	class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-sm"
	onmousedown={(e) => (e.target as HTMLElement).id === 'artifact-overlay' && close()}
	id="artifact-overlay"
>
	<div class="flex max-h-[90vh] w-[500px] flex-col gap-6 overflow-y-auto rounded-[2.5rem] border-8 border-white bg-[#fdf6e3] p-8 shadow-2xl ring-1 ring-black/5">
		<div class="flex items-center justify-between">
			<span class="font-serif text-2xl text-brand italic">Artifact Crate</span>
			<button onclick={close} class="text-[10px] font-bold tracking-widest uppercase opacity-30 transition-opacity hover:opacity-100">Cancel</button>
		</div>

		<div class="flex flex-col gap-3">
			<span class="text-[10px] font-black tracking-wider uppercase opacity-30">Linen Preview</span>
			<div class="artisan-checker relative flex h-48 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#eee8d5] shadow-inner">
				{#if previewUrl}
					<img src={previewUrl} alt="Preview" class="max-h-full max-w-full shadow-lg" style="image-rendering: pixelated;" />
				{/if}
			</div>
		</div>

		<div class="grid grid-cols-2 gap-6">
			<div class="flex flex-col gap-3">
				<span class="text-[10px] font-black tracking-wider uppercase opacity-30">Scaling</span>
				<div class="flex flex-wrap gap-2">
					{#each presets as s}
						<button
							class="rounded-full border-2 px-2.5 py-1 font-mono text-[10px] transition-all {!isCustom && atelier.exportScale === s ? 'border-brand bg-brand text-white' : 'border-black/5 bg-white opacity-60 hover:opacity-100'}"
							onclick={() => handlePresetClick(s)}
						>{s}x</button>
					{/each}
				</div>
				<div class="relative mt-1">
					<input type="number" value={Math.round(customWidth)} oninput={handleCustomInput} class="w-full rounded-xl border-2 border-black/5 bg-white/50 px-3 py-1.5 font-mono text-xs transition-colors outline-none focus:border-brand/30" />
					<span class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[8px] font-bold text-studio-text italic opacity-20">px</span>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<span class="text-[10px] font-black tracking-wider uppercase opacity-30">Background Dye</span>
				<div class="flex flex-col gap-2">
					{#each bgPresets as opt}
						<button
							class="flex items-center gap-2 rounded-lg border-2 p-1.5 font-serif text-[10px] italic transition-all {atelier.exportBgColor === opt.value ? 'border-brand bg-white shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}"
							onclick={() => (atelier.exportBgColor = opt.value)}
						>
							<div class="h-3 w-3 rounded-sm border border-black/10 {opt.value === 'transparent' ? 'artisan-checker' : ''}" style="background-color: {opt.value === 'transparent' ? 'transparent' : opt.value};"></div>
							{opt.label}
						</button>
					{/each}
					<button
						class="flex items-center gap-2 rounded-lg border-2 p-1.5 font-serif text-[10px] italic transition-all {!bgPresets.some(p => p.value === atelier.exportBgColor) ? 'border-brand bg-white shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}"
						onclick={() => { if (atelier.exportBgColor === 'transparent') atelier.exportBgColor = '#fdf6e3'; showBgPicker = true; }}
					>
						<div class="via-sage-300 h-3 w-3 rounded-sm border border-black/10 bg-gradient-to-tr from-rose-300 to-sky-300" style="background-color: {!bgPresets.some(p => p.value === atelier.exportBgColor) ? atelier.exportBgColor : ''}"></div>
						Custom Dye...
					</button>
				</div>
			</div>
		</div>

		<div class="mt-2 flex gap-3">
			<button class="flex flex-1 flex-col items-center rounded-2xl bg-studio-teal py-3 font-serif text-white italic shadow-md transition-all hover:scale-[1.02] active:scale-100" onclick={() => onExport('png', atelier.exportScale, atelier.exportBgColor)}>
				<span class="text-lg">Export PNG</span>
				<span class="mt-1 text-[8px] font-bold tracking-widest uppercase opacity-60">Raster Print</span>
			</button>
			<button class="flex flex-1 flex-col items-center rounded-2xl bg-brand py-3 font-serif text-white italic shadow-md transition-all hover:scale-[1.02] active:scale-100" onclick={() => onExport('svg', 1, atelier.exportBgColor)}>
				<span class="text-lg">Export SVG</span>
				<span class="mt-1 text-[8px] font-bold tracking-widest uppercase opacity-60">Vector Tapestry</span>
			</button>
		</div>
	</div>
</div>

{#if showBgPicker}
	<DyeBasin bind:value={atelier.exportBgColor} onClose={() => (showBgPicker = false)} title="Background Dye" />
{/if}

<style>
	.artisan-checker {
		background-image: linear-gradient(45deg, #eee8d5 25%, transparent 25%), linear-gradient(-45deg, #eee8d5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee8d5 75%), linear-gradient(-45deg, transparent 75%, #eee8d5 75%);
		background-size: 10px 10px;
		background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
	}
</style>