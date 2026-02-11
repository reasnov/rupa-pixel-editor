<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { ExportEngine } from '../engine/export';
	import { onMount } from 'svelte';

	let { onExport } = $props<{ onExport: (format: 'png' | 'svg', scale: number, bgColor: string | 'transparent') => void }>();

	let customWidth = $state(editor.gridWidth * editor.exportScale);
	let isCustom = $state(false);
	let previewUrl = $state('');

	const presets = [0.5, 1, 2, 4, 10, 20];
	const bgOptions = [
		{ label: 'Transparent', value: 'transparent' },
		{ label: 'Studio Cream', value: '#fdf6e3' },
		{ label: 'White', value: '#ffffff' },
		{ label: 'Black', value: '#000000' }
	];

	async function updatePreview() {
		previewUrl = await ExportEngine.toPNG(editor.gridWidth, editor.gridHeight, editor.pixelData, 5, editor.exportBgColor);
	}

	function handlePresetClick(s: number) {
		editor.exportScale = s;
		customWidth = editor.gridWidth * s;
		isCustom = false;
	}

	function handleCustomInput(e: Event) {
		const val = parseInt((e.target as HTMLInputElement).value);
		if (!isNaN(val) && val > 0) {
			customWidth = val;
			editor.exportScale = val / editor.gridWidth;
			isCustom = true;
		}
	}

	function close() {
		window.dispatchEvent(new CustomEvent('app:close-export'));
	}

	$effect(() => {
		editor.exportBgColor;
		updatePreview();
	});

	onMount(() => {
		updatePreview();
	});
</script>

<div 
	class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-sm"
	onmousedown={(e) => (e.target as HTMLElement).id === 'export-overlay' && close()}
	id="export-overlay"
>
	<div class="bg-[#fdf6e3] p-8 rounded-[2.5rem] border-8 border-white shadow-2xl w-[500px] flex flex-col gap-6 ring-1 ring-black/5 max-h-[90vh] overflow-y-auto">
		<div class="flex justify-between items-center">
			<span class="font-serif italic text-2xl text-studio-warm">Export Your Work</span>
			<button onclick={close} class="text-[10px] uppercase font-bold opacity-30 hover:opacity-100 tracking-widest">Cancel</button>
		</div>

		<!-- Live Preview -->
		<div class="flex flex-col gap-3">
			<span class="text-[10px] uppercase font-black opacity-30 tracking-wider">Linen Preview</span>
			<div class="h-48 rounded-2xl border-4 border-white shadow-inner flex items-center justify-center relative overflow-hidden bg-[#eee8d5] artisan-checker">
				{#if previewUrl}
					<img src={previewUrl} alt="Preview" class="max-h-full max-w-full shadow-lg" style="image-rendering: pixelated;" />
				{/if}
			</div>
		</div>

		<div class="grid grid-cols-2 gap-6">
			<!-- Scaling Presets -->
			<div class="flex flex-col gap-3">
				<span class="text-[10px] uppercase font-black opacity-30 tracking-wider">Scaling</span>
				<div class="flex flex-wrap gap-2">
					{#each presets as s}
						<button 
							class="px-2.5 py-1 rounded-full border-2 text-[10px] font-mono transition-all {!isCustom && editor.exportScale === s ? 'bg-studio-warm text-white border-studio-warm' : 'bg-white border-black/5 opacity-60 hover:opacity-100'}"
							onclick={() => handlePresetClick(s)}
						>
							{s}x
						</button>
					{/each}
				</div>
				<div class="relative mt-1">
					<input 
						type="number" 
						value={Math.round(customWidth)}
						oninput={handleCustomInput}
						class="w-full bg-white/50 border-2 border-black/5 rounded-xl px-3 py-1.5 font-mono text-xs outline-none focus:border-studio-warm/30 transition-colors"
					/>
					<span class="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] opacity-20 font-bold italic">px</span>
				</div>
			</div>

			<!-- Background Options -->
			<div class="flex flex-col gap-3">
				<span class="text-[10px] uppercase font-black opacity-30 tracking-wider">Background Dye</span>
				<div class="flex flex-col gap-2">
					{#each bgOptions as opt}
						<button 
							class="flex items-center gap-2 text-[10px] font-serif italic p-1.5 rounded-lg border-2 transition-all {editor.exportBgColor === opt.value ? 'bg-white border-studio-warm shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}"
							onclick={() => editor.exportBgColor = opt.value}
						>
							<div class="h-3 w-3 rounded-sm border border-black/10 {opt.value === 'transparent' ? 'artisan-checker' : ''}" style="background-color: {opt.value === 'transparent' ? 'transparent' : opt.value};"></div>
							{opt.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Export Actions -->
		<div class="flex gap-3 mt-2">
			<button 
				class="flex-1 bg-studio-teal text-white font-serif italic py-3 rounded-2xl shadow-md hover:scale-[1.02] active:scale-100 transition-all flex flex-col items-center"
				onclick={() => onExport('png', editor.exportScale, editor.exportBgColor)}
			>
				<span class="text-lg">Export PNG</span>
				<span class="text-[8px] uppercase tracking-widest opacity-60 font-bold -mt-1">Raster Print</span>
			</button>
			<button 
				class="flex-1 bg-studio-warm text-white font-serif italic py-3 rounded-2xl shadow-md hover:scale-[1.02] active:scale-100 transition-all flex flex-col items-center"
				onclick={() => onExport('svg', 1, editor.exportBgColor)}
			>
				<span class="text-lg">Export SVG</span>
				<span class="text-[8px] uppercase tracking-widest opacity-60 font-bold -mt-1">Vector Tapestry</span>
			</button>
		</div>
	</div>
</div>

<style>
	.artisan-checker {
		background-image: linear-gradient(45deg, #eee8d5 25%, transparent 25%), 
						  linear-gradient(-45deg, #eee8d5 25%, transparent 25%), 
						  linear-gradient(45deg, transparent 75%, #eee8d5 75%), 
						  linear-gradient(-45deg, transparent 75%, #eee8d5 75%);
		background-size: 10px 10px;
		background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
	}
</style>