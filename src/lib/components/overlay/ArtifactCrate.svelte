<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { ExportEngine } from '../../engine/export.js';
	import Modal from '../ui/Modal.svelte';

	let { onExport, onClose = () => (atelier.showArtifactCrate = false) } = $props<{ 
		onExport: (format: 'svg' | 'png', scale: number, bgColor: string) => void;
		onClose?: () => void;
	}>();

	let format = $state<'svg' | 'png'>('png');
</script>

<Modal title="Artifact Crate" subtitle="Prepare Artifacts for Export" icon="🧺" {onClose}>
	<div class="flex flex-col gap-8">
		<!-- Format Selection -->
		<div class="grid grid-cols-2 gap-4">
			<button 
				class="flex flex-col items-center gap-3 rounded-3xl border-2 p-8 transition-all {format === 'png' ? 'border-brand bg-brand/5' : 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
				onclick={() => format = 'png'}
			>
				<span class="text-4xl">🖼️</span>
				<div class="text-center">
					<h3 class="font-serif text-sm font-bold uppercase tracking-tight">Raster PNG</h3>
					<span class="font-serif text-[9px] font-bold uppercase tracking-widest opacity-40">Pixel Perfect</span>
				</div>
			</button>
			<button 
				class="flex flex-col items-center gap-3 rounded-3xl border-2 p-8 transition-all {format === 'svg' ? 'border-brand bg-brand/5' : 'border-black/5 bg-white/40 opacity-40 hover:opacity-100'}"
				onclick={() => format = 'svg'}
			>
				<span class="text-4xl">📐</span>
				<div class="text-center">
					<h3 class="font-serif text-sm font-bold uppercase tracking-tight">Vector SVG</h3>
					<span class="font-serif text-[9px] font-bold uppercase tracking-widest opacity-40">Infinite Scale</span>
				</div>
			</button>
		</div>

		<!-- Settings -->
		<div class="flex flex-col gap-6 rounded-3xl border border-black/5 bg-white/40 p-8">
			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-1">
					<span class="font-serif text-sm font-bold uppercase tracking-tight opacity-60">Artifact Scale</span>
					<span class="font-serif text-[10px] opacity-40">Multiplier for raster output size</span>
				</div>
				<input 
					type="number" 
					bind:value={atelier.studio.exportScale} 
					min="1" 
					max="100"
					class="w-24 rounded-xl border border-black/10 bg-white px-4 py-2 font-mono text-lg focus:outline-none"
				/>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-1">
					<span class="font-serif text-sm font-bold uppercase tracking-tight opacity-60">Background</span>
					<span class="font-serif text-[10px] opacity-40">Fill empty stitches with color</span>
				</div>
				<div class="flex gap-2">
					<button 
						class="h-10 w-10 rounded-full border-2 {atelier.studio.exportBgColor === 'transparent' ? 'border-brand' : 'border-black/5'}"
						style="background: repeating-conic-gradient(#eee8d5 0% 25%, #fff 0% 50%) 50% / 10px 10px;"
						onclick={() => atelier.studio.exportBgColor = 'transparent'}
						title="Transparent"
					></button>
					<button 
						class="h-10 w-10 rounded-full border-2 {atelier.studio.exportBgColor === '#eee8d5' ? 'border-brand' : 'border-black/5'} bg-[#eee8d5]"
						onclick={() => atelier.studio.exportBgColor = '#eee8d5'}
						title="Studio Cream"
					></button>
					<button 
						class="h-10 w-10 rounded-full border-2 {atelier.studio.exportBgColor === '#000000' ? 'border-brand' : 'border-black/5'} bg-black"
						onclick={() => atelier.studio.exportBgColor = '#000000'}
						title="Deep Black"
					></button>
				</div>
			</div>
		</div>

		<button 
			class="artisan-primary-btn w-full py-5 text-xl"
			onclick={() => onExport(format, atelier.studio.exportScale, atelier.studio.exportBgColor)}
		>
			Weave & Export Artifact
		</button>
	</div>
</Modal>
