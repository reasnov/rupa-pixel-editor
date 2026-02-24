<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { editor as engine } from '../../engine/editor.svelte.js';
	import { services } from '../../engine/services.js';
</script>

<div
	class="editor-panel flex w-full flex-col gap-3 border-none bg-sidebar-bg/30 p-3 shadow-sm"
	role="region"
	aria-label="Natural Pigments"
>
	<span
		class="text-center font-serif text-[8px] font-black tracking-widest text-text-main/30 uppercase"
		>{__('shortcuts:groups.colors')}</span
	>

	<div class="grid grid-cols-4 gap-2" role="radiogroup">
		{#each editor.palette as color, i}
			<button
				class="editor-checker-small h-8 w-8 rounded transition-all {editor.activeColor === color
					? 'is-active-pigment z-10 scale-110 border-2 border-ui-accent shadow-md'
					: 'border border-text-main/5 opacity-80 hover:scale-105 hover:opacity-100'}"
				style="background-color: {color};"
				onclick={() => engine.handleIntent(`SELECT_COLOR_${(i + 1) % 10}` as any)}
				oncontextmenu={(e) => {
					e.preventDefault();
					editor.studio.contextMenu = {
						x: e.clientX,
						y: e.clientY,
						items: [
							{
								label: __('workspace:hud.context_menu.delete_color'),
								icon: '🗑️',
								danger: true,
								disabled: editor.palette.length <= 1,
								action: () => editor.paletteState.removeSwatch(i)
							}
						]
					};
				}}
				aria-label={__(`actions:select_color_${(i + 1) % 10}`)}
				title={__(`actions:select_color_${(i + 1) % 10}`) + ` (${(i + 1) % 10})`}
				role="radio"
				aria-checked={editor.activeColor === color}
			></button>
		{/each}

		<button
			class="flex h-8 w-8 items-center justify-center rounded border border-dashed border-text-main/20 bg-text-main/5 transition-all hover:scale-110 hover:border-ui-accent/40 hover:bg-ui-highlight/20"
			onclick={() => (editor.showColorPicker = true)}
			title={__('tools:color_picker.title') + ' (B)'}
			aria-label={__('tools:color_picker.title')}
		>
			<span class="text-xs opacity-40" aria-hidden="true">＋</span>
		</button>

		<button
			class="flex h-8 w-8 items-center justify-center rounded border border-dashed border-text-main/20 bg-text-main/5 transition-all hover:scale-110 hover:border-ui-accent/40 hover:bg-ui-highlight/20"
			onclick={() => (editor.studio.showPaletteLibrary = true)}
			title={__('tools:palette_library.title')}
			aria-label={__('tools:palette_library.title')}
		>
			<span class="text-xs opacity-40" aria-hidden="true">🎨</span>
		</button>
	</div>
</div>
