<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
</script>

<div
	class="editor-panel flex w-full flex-col gap-3 border-none bg-bamboo-shoot/30 p-3 shadow-sm"
	role="region"
	aria-label="Natural Pigments"
>
	<span
		class="text-center font-serif text-[8px] font-black tracking-widest text-evergreen/30 uppercase"
		>{__({ key: 'shortcuts:groups.colors' })}</span
	>

	<div class="grid grid-cols-4 gap-2" role="radiogroup">
		{#each editor.palette as color, i}
			<button
				class="editor-checker-small h-8 w-8 rounded transition-all {editor.activeColor === color
					? 'is-active-pigment z-10 scale-110 border-2 border-lantern-gold shadow-md'
					: 'border border-evergreen/5 opacity-80 hover:scale-105 hover:opacity-100'}"
				style="background-color: {color};"
				onclick={() => services.color.select(i)}
				oncontextmenu={(e) => {
					e.preventDefault();
					editor.studio.contextMenu = {
						x: e.clientX,
						y: e.clientY,
						items: [
							{
								label: 'Spill Pigment',
								icon: '🗑️',
								danger: true,
								disabled: editor.palette.length <= 1,
								action: () => editor.paletteState.removeSwatch(i)
							}
						]
					};
				}}
				aria-label={__(`labels.SELECT_COLOR_${(i + 1) % 10}`)}
				title={__(`labels.SELECT_COLOR_${(i + 1) % 10}`) + ` (${(i + 1) % 10})`}
				role="radio"
				aria-checked={editor.activeColor === color}
			></button>
		{/each}

		<button
			class="flex h-8 w-8 items-center justify-center rounded border border-dashed border-evergreen/20 bg-evergreen/5 transition-all hover:scale-110 hover:border-lantern-gold/40 hover:bg-white"
			onclick={() => (editor.showColorPicker = true)}
			title={__('color_picker.title') + ' (B)'}
			aria-label={__('color_picker.title')}
		>
			<span class="text-xs opacity-40" aria-hidden="true">＋</span>
		</button>

		<button
			class="flex h-8 w-8 items-center justify-center rounded border border-dashed border-evergreen/20 bg-evergreen/5 transition-all hover:scale-110 hover:border-lantern-gold/40 hover:bg-white"
			onclick={() => (editor.studio.showPaletteLibrary = true)}
			title={__('palette_library.title')}
			aria-label={__('palette_library.title')}
		>
			<span class="text-xs opacity-40" aria-hidden="true">🎨</span>
		</button>
	</div>
</div>
