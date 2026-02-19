<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
</script>

<div class="editor-panel w-full border-none bg-stone-light/50 p-3 shadow-sm" role="status">
	<div class="flex flex-col gap-3">
		<div class="flex flex-col">
			<span class="font-serif text-[8px] font-black tracking-widest text-charcoal/30 uppercase"
				>{__({ key: 'stats.cursor_focus' })}</span
			>
			<span class="font-mono text-[11px] font-bold text-charcoal tabular-nums">
				{editor.displayCoords.x}, {editor.displayCoords.y}
			</span>
		</div>

		<div class="h-px w-full bg-charcoal/5" aria-hidden="true"></div>

		<div class="flex flex-col">
			<span class="font-serif text-[8px] font-black tracking-widest text-charcoal/30 uppercase"
				>{__({ key: 'stats.canvas_size' })}</span
			>
			<span class="font-mono text-[11px] font-bold text-charcoal tabular-nums">
				{editor.canvas.width}×{editor.canvas.height}
			</span>
		</div>
	</div>
</div>
