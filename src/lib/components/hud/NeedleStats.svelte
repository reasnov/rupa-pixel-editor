<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
</script>

<div class="artisan-panel stats-panel w-full rounded-xl px-4 py-3 shadow-sm" role="status">
	<div class="flex flex-col gap-2">
		<div class="flex flex-col">
			<span class="font-serif text-[7px] font-bold text-studio-text/30 uppercase"
				>{__({ key: 'stats.needle_focus' })}</span
			>
			<span class="font-mono text-[10px] font-bold text-studio-text tabular-nums">
				{atelier.displayCoords.x}, {atelier.displayCoords.y}
			</span>
		</div>

		<div class="h-px w-full bg-studio-text/10" aria-hidden="true"></div>

		<div class="flex flex-col">
			<span class="font-serif text-[7px] font-bold text-studio-text/30 uppercase"
				>{__({ key: 'stats.linen_size' })}</span
			>
			<span class="font-mono text-[10px] font-bold text-studio-text tabular-nums">
				{atelier.linen.width}×{atelier.linen.height}
			</span>
		</div>
	</div>
</div>
