<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { ExportEngine } from '../engine/export';
	import ColorPicker from './ColorPicker.svelte';
	import { onMount } from 'svelte';

	let {
		onExport
	} = $props<{
		onExport: (format: 'png' | 'svg', scale: number, bgColor: string | 'transparent') => void;
	}>();

	let customWidth = $state(editor.gridWidth * editor.exportScale);
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
			editor.gridWidth,
			editor.gridHeight,
			editor.pixelData,
			5,
			editor.exportBgColor
		);
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

	// Watch for background color changes to update preview
	$effect(() => {
		editor.exportBgColor;
		updatePreview();
	});

	// Register Escape listener for the Export Modal itself
	$effect(() => {
		editor.pushEscapeAction(close);
		return () => editor.popEscapeAction(close);
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
	<div
		class="flex max-h-[90vh] w-[500px] flex-col gap-6 overflow-y-auto rounded-[2.5rem] border-8 border-white bg-[#fdf6e3] p-8 shadow-2xl ring-1 ring-black/5"
	>
		<div class="flex items-center justify-between">
			<span class="font-serif text-2xl text-studio-warm italic">Export Project</span>
			<button
				onclick={close}
				class="text-[10px] font-bold tracking-widest uppercase opacity-30 transition-opacity hover:opacity-100"
				>Cancel</button
			>
		</div>

		<!-- Live Preview -->
		<div class="flex flex-col gap-3">
			<span class="text-[10px] font-black tracking-wider uppercase opacity-30"
				>Linen Preview</span
			>
			<div
				class="artisan-checker relative flex h-48 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#eee8d5] shadow-inner"
			>
				{#if previewUrl}
					<img
						src={previewUrl}
						alt="Preview"
						class="max-h-full max-w-full shadow-lg"
						style="image-rendering: pixelated;"
					/>
				{/if}
			</div>
		</div>

		<div class="grid grid-cols-2 gap-6">
			<!-- Scaling Presets -->
			<div class="flex flex-col gap-3">
				<span class="text-[10px] font-black tracking-wider uppercase opacity-30">Scaling</span>
				<div class="flex flex-wrap gap-2">
					{#each presets as s}
						<button
							class="rounded-full border-2 px-2.5 py-1 font-mono text-[10px] transition-all {!isCustom &&
							editor.exportScale === s
								? 'border-studio-warm bg-studio-warm text-white'
								: 'border-black/5 bg-white opacity-60 hover:opacity-100'}"
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
						class="w-full rounded-xl border-2 border-black/5 bg-white/50 px-3 py-1.5 font-mono text-xs outline-none transition-colors focus:border-studio-warm/30"
					/>
					<span
						class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[8px] font-bold text-studio-text italic opacity-20"
						>px</span
					>
				</div>
			</div>

			<!-- Background Options -->
			<div class="flex flex-col gap-3">
				<span class="text-[10px] font-black tracking-wider uppercase opacity-30"
					>Background Dye</span
				>
				<div class="flex flex-col gap-2">
					{#each bgPresets as opt}
						<button
							class="flex items-center gap-2 rounded-lg border-2 p-1.5 font-serif text-[10px] transition-all italic {editor.exportBgColor ===
							opt.value
								? 'border-studio-warm bg-white shadow-sm'
								: 'border-transparent opacity-60 hover:opacity-100'}"
							onclick={() => (editor.exportBgColor = opt.value)}
						>
							<div
								class="h-3 w-3 rounded-sm border border-black/10 {opt.value === 'transparent'
									? 'artisan-checker'
									: ''}"
								style="background-color: {opt.value === 'transparent' ? 'transparent' : opt.value};"
							></div>
							{opt.label}
						</button>
					{/each}

					<!-- Custom Background Option -->
					<button
						class="flex items-center gap-2 rounded-lg border-2 p-1.5 font-serif text-[10px] transition-all italic {!bgPresets.some(
							(p) => p.value === editor.exportBgColor
						)
							? 'border-studio-warm bg-white shadow-sm'
							: 'border-transparent opacity-60 hover:opacity-100'}"
						onclick={() => {
							if (editor.exportBgColor === 'transparent') {
								editor.exportBgColor = '#fdf6e3'; // Set a starting color
							}
							showBgPicker = true;
						}}
					>
						<div
							class="h-3 w-3 rounded-sm border border-black/10 bg-gradient-to-tr from-rose-300 via-sage-300 to-sky-300"
							style="background-color: {!bgPresets.some((p) => p.value === editor.exportBgColor)
								? editor.exportBgColor
								: ''}"
						></div>
						Custom Dye...
					</button>
				</div>
			</div>
		</div>

		<!-- Export Actions -->
		<div class="mt-2 flex gap-3">
			<button
				class="flex flex-1 flex-col items-center rounded-2xl bg-studio-teal py-3 text-white shadow-md transition-all font-serif hover:scale-[1.02] italic active:scale-100"
				onclick={() => onExport('png', editor.exportScale, editor.exportBgColor)}
			>
				<span class="text-lg">Export PNG</span>
				<span class="mt-1 text-[8px] font-bold tracking-widest uppercase opacity-60"
					>Raster Print</span
				>
			</button>
			<button
				class="flex flex-1 flex-col items-center rounded-2xl bg-studio-warm py-3 text-white shadow-md transition-all font-serif hover:scale-[1.02] italic active:scale-100"
				onclick={() => onExport('svg', 1, editor.exportBgColor)}
			>
				<span class="text-lg">Export SVG</span>
				<span class="mt-1 text-[8px] font-bold tracking-widest uppercase opacity-60"
					>Vector Tapestry</span
				>
			</button>
		</div>
	</div>
</div>

{#if showBgPicker}
	<!-- Nested ColorPicker for Background -->
	<ColorPicker 
		bind:value={editor.exportBgColor} 
		onClose={() => showBgPicker = false} 
		title="Background Dye"
	/>
{/if}

<style>
	.artisan-checker {
		background-image: linear-gradient(45deg, #eee8d5 25%, transparent 25%),
			linear-gradient(-45deg, #eee8d5 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #eee8d5 75%),
			linear-gradient(-45deg, transparent 75%, #eee8d5 75%);
		background-size: 10px 10px;
		background-position:
			0 0,
			0 5px,
			5px -5px,
			-5px 0px;
	}
</style>
