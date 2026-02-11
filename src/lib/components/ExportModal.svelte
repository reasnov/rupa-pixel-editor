<script lang="ts">
	import { editor } from '../state/editor.svelte';
	import { ExportEngine } from '../engine/export';

	let { onExport } = $props<{ onExport: (format: 'png' | 'svg', scale: number) => void }>();

	let customWidth = $state(editor.gridWidth * editor.exportScale);
	let isCustom = $state(false);

	const presets = [0.5, 1, 2, 4, 10, 20];

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

	// Register Escape listener
	import { onMount } from 'svelte';
	$effect(() => {
		editor.pushEscapeAction(close);
		return () => editor.popEscapeAction(close);
	});
</script>

<div 
	class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-sm"
	onmousedown={(e) => (e.target as HTMLElement).id === 'export-overlay' && close()}
	id="export-overlay"
>
	<div class="bg-[#fdf6e3] p-8 rounded-[2.5rem] border-8 border-white shadow-2xl w-96 flex flex-col gap-6 ring-1 ring-black/5">
		<div class="flex justify-between items-center">
			<span class="font-serif italic text-2xl text-studio-warm">Export Project</span>
			<button onclick={close} class="text-[10px] uppercase font-bold opacity-30 hover:opacity-100 tracking-widest">Cancel</button>
		</div>

		<!-- Scaling Presets -->
		<div class="flex flex-col gap-3">
			<span class="text-[10px] uppercase font-black opacity-30 tracking-wider">Size Presets</span>
			<div class="flex flex-wrap gap-2">
				{#each presets as s}
					<button 
						class="px-3 py-1.5 rounded-full border-2 text-xs font-mono transition-all {!isCustom && editor.exportScale === s ? 'bg-studio-warm text-white border-studio-warm' : 'bg-white border-black/5 opacity-60 hover:opacity-100'}"
						onclick={() => handlePresetClick(s)}
					>
						{s}x
					</button>
				{/each}
			</div>
		</div>

		<!-- Custom Dimensions -->
		<div class="flex flex-col gap-3">
			<span class="text-[10px] uppercase font-black opacity-30 tracking-wider">Custom Width (px)</span>
			<div class="relative">
				<input 
					type="number" 
					value={Math.round(customWidth)}
					oninput={handleCustomInput}
					class="w-full bg-white/50 border-2 border-black/5 rounded-xl px-4 py-2 font-mono text-sm outline-none focus:border-studio-warm/30 transition-colors"
				/>
				<span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] opacity-20 font-bold italic">Ratio Locked</span>
			</div>
			<div class="text-[10px] opacity-40 italic">
				Result: {Math.round(editor.gridWidth * editor.exportScale)} × {Math.round(editor.gridHeight * editor.exportScale)} pixels
			</div>
		</div>

		<!-- Export Actions -->
		<div class="flex gap-3 mt-2">
			<button 
				class="flex-1 bg-studio-teal text-white font-serif italic py-3 rounded-2xl shadow-md hover:scale-[1.02] active:scale-100 transition-all"
				onclick={() => onExport('png', editor.exportScale)}
			>
				Export PNG
			</button>
			<button 
				class="flex-1 bg-studio-warm text-white font-serif italic py-3 rounded-2xl shadow-md hover:scale-[1.02] active:scale-100 transition-all"
				onclick={() => onExport('svg', 1)}
			>
				Export SVG
			</button>
		</div>
	</div>
</div>
