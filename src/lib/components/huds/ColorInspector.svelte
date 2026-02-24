<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import UsedColorList from './indicators/UsedColorList.svelte';
</script>

<div class="editor-panel flex w-full flex-col gap-4 border-none bg-canvas-bg p-3 shadow-sm">
	<!-- Active Color -->
	<div class="flex flex-col items-center gap-2 py-2">
		<span class="font-serif text-[8px] font-black tracking-widest text-text-main/30 uppercase"
			>{__('workspace:hud.active_color')}</span
		>
		<div
			class="editor-checker-small h-10 w-10 rounded border border-text-main/10 shadow-inner transition-colors"
			style="background-color: {editor.paletteState.activeColor};"
		></div>
		<div class="flex items-center gap-2">
			<span class="font-mono text-[9px] font-bold tracking-tight text-text-main/40 uppercase">
				{editor.paletteState.activeColor}
			</span>
			<button
				onclick={() => editor.paletteState.addSwatch(editor.paletteState.activeColor)}
				class="flex h-4 w-4 items-center justify-center rounded bg-ui-accent/10 text-[8px] text-ui-accent transition-all hover:bg-ui-accent hover:text-canvas-bg"
				title={__('workspace:hud.actions.add_color')}
			>
				＋
			</button>
		</div>
	</div>

	<div class="h-px w-full bg-text-main/5"></div>

	<!-- Used Colors -->
	<div class="flex flex-col gap-2">
		<span
			class="text-center font-serif text-[8px] font-black tracking-widest text-text-main/30 uppercase"
			>{__('workspace:hud.recent_colors')}</span
		>

		<UsedColorList colors={editor.usedColors} />
	</div>
</div>
