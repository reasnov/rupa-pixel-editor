<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { pointer } from '../../engine/pointer.svelte.js';

	interface Props {
		w: number;
		h: number;
	}

	let { w, h }: Props = $props();

	let isSnapped = $derived(pointer.isSnappedState);
	let polylinePoints = $derived(editor.canvas.strokePoints.map((p) => `${p.x},${p.y}`).join(' '));
</script>

<svg
	class="pointer-events-none absolute inset-0 z-[20] h-full w-full overflow-visible"
	viewBox="0 0 {w} {h}"
	preserveAspectRatio="none"
>
	{#if editor.canvas.strokePoints.length > 1}
		<polyline
			points={polylinePoints}
			fill="none"
			stroke={editor.paletteState.activeColor}
			stroke-width={isSnapped ? '0.08' : '0.03'}
			stroke-dasharray={isSnapped ? 'none' : '0.1 0.1'}
			stroke-linecap="round"
			stroke-linejoin="round"
			class="{isSnapped ? 'drop-shadow-md' : 'marching-ants'} transition-all duration-300"
			style="opacity: {isSnapped ? '1' : '0.4'}"
		/>
	{/if}
</svg>

<style>
	.marching-ants {
		animation: ants 1s linear infinite;
	}

	@keyframes ants {
		from {
			stroke-dashoffset: 0.2;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
