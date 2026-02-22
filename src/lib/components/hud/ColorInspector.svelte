<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import { slide } from 'svelte/transition';
</script>

<div class="editor-panel flex w-full flex-col gap-4 border-none bg-washi-white p-3 shadow-sm">
	<!-- Active Color -->
	<div class="flex flex-col items-center gap-2 py-2">
		<span class="font-serif text-[8px] font-black tracking-widest text-evergreen/30 uppercase"
			>Active Pigment</span
		>
		<div
			class="editor-checker-small h-10 w-10 rounded border border-evergreen/10 shadow-inner transition-colors"
			style="background-color: {editor.paletteState.activeColor};"
		></div>
		<div class="flex items-center gap-2">
			<span class="font-mono text-[9px] font-bold tracking-tight text-evergreen/40 uppercase">
				{editor.paletteState.activeColor}
			</span>
			<button
				onclick={() => editor.paletteState.addSwatch(editor.paletteState.activeColor)}
				class="flex h-4 w-4 items-center justify-center rounded bg-lantern-gold/10 text-[8px] text-lantern-gold transition-all hover:bg-lantern-gold hover:text-white"
				title="Add to Current Palette"
			>
				＋
			</button>
		</div>
	</div>

	<div class="h-px w-full bg-evergreen/5"></div>

	<!-- Used Colors -->
	<div class="flex flex-col gap-2">
		<span
			class="text-center font-serif text-[8px] font-black tracking-widest text-evergreen/30 uppercase"
			>Recent Weaves</span
		>

		<div
			class="custom-scrollbar flex max-h-[120px] flex-row flex-wrap gap-1.5 overflow-y-auto px-1"
		>
			{#each editor.usedColors as color (color)}
				<button
					transition:slide={{ duration: 200 }}
					class="group editor-checker-small relative h-5 w-5 shrink-0 rounded border border-evergreen/10 shadow-sm transition-all hover:scale-110 active:scale-95"
					style="background-color: {color};"
					onclick={() => services.color.setColor(color)}
					title={color}
				>
					<div
						class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
					>
						<span class="text-[8px]">📍</span>
					</div>
				</button>
			{:else}
				<div
					class="flex h-5 w-5 items-center justify-center rounded border border-dashed border-evergreen/10"
				>
					<span class="text-[8px] opacity-20">🎨</span>
				</div>
			{/each}
		</div>
	</div>
</div>
