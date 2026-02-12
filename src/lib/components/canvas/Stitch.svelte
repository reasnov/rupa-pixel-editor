<script lang="ts">
	import Needle from './Needle.svelte';

	let { color, x, y, activeX, activeY } = $props<{
		color: string | null;
		x: number;
		y: number;
		activeX: number;
		activeY: number;
	}>();

	let isActive = $derived(activeX === x && activeY === y);
	let isEmpty = $derived(color === null);
</script>

<div
    class="cell-stitch relative h-full w-full {isActive ? 'z-30' : 'z-10'}"
    style="background-color: {isEmpty ? 'transparent' : color};"
>
    {#if isActive}
        <Needle />
    {/if}
</div>
