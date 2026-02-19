<script lang="ts">
	import { fade } from 'svelte/transition';

	let { target, margin = '0px' } = $props<{
		target: { opacity: number };
		margin?: string;
	}>();
</script>

<div
	transition:fade={{ duration: 100 }}
	class="mb-2 mr-2 flex flex-col gap-2 rounded-b-lg border-x border-b border-charcoal/5 bg-charcoal/[0.02] p-3 pt-1"
	style="margin-left: {margin};"
>
	<div class="flex items-center justify-between gap-4">
		<span class="font-serif text-[10px] font-bold text-charcoal/40 uppercase">Opacity</span>
		<div class="flex flex-1 items-center gap-2">
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				bind:value={target.opacity}
				class="editor-slider h-1 flex-1"
			/>
			<input
				type="number"
				min="0"
				max="100"
				value={Math.round(target.opacity * 100)}
				oninput={(e) =>
					(target.opacity = Math.max(0, Math.min(100, Number(e.currentTarget.value))) / 100)}
				class="w-10 rounded border border-charcoal/10 bg-white p-0.5 text-center font-mono text-[10px]"
			/>
			<span class="font-mono text-[8px] opacity-30">%</span>
		</div>
	</div>
</div>
