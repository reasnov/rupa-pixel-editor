<script lang="ts">
	import { __ } from "$lib/state/i18n.svelte.js";
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
</script>

<div
	class="editor-panel flex w-full flex-col gap-3 border-none bg-stone-light/30 p-3 shadow-sm"
	role="region"
	aria-label="Color Palette"
>
	<span
		class="text-center font-serif text-[8px] font-black tracking-widest text-charcoal/30 uppercase"
		>{__({ key: 'shortcut_groups.colors' })}</span
	>

	<div class="grid grid-cols-4 gap-2" role="radiogroup">
		{#each editor.palette as color, i}
			<button
				class="editor-checker-small h-8 w-8 rounded transition-all {editor.activeColor === color
					? 'z-10 scale-110 border-2 border-brand shadow-md'
					: 'border border-charcoal/5 opacity-80 hover:scale-105 hover:opacity-100'}"
				style="background-color: {color};"
				onclick={() => services.color.select(i)}
				aria-label={__({ key: `shortcut_labels.SELECT_COLOR_${(i + 1) % 10}` })}
				title={__({ key: `shortcut_labels.SELECT_COLOR_${(i + 1) % 10}` }) + ` (${(i + 1) % 10})`}
				role="radio"
				aria-checked={editor.activeColor === color}
			></button>
		{/each}

		<button
			class="flex h-8 w-8 items-center justify-center rounded border border-dashed border-charcoal/20 bg-charcoal/5 transition-all hover:scale-110 hover:border-brand/40 hover:bg-white"
			onclick={() => (editor.showColorPicker = true)}
			title="{__({ key: 'color_picker.title' })} (B)"
			aria-label={__({ key: 'color_picker.title' })}
		>
			<span class="text-xs opacity-40" aria-hidden="true">＋</span>
		</button>
	</div>
</div>
