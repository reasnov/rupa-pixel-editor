<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { stance } from '../../engine/stance.svelte.js';
</script>

{#if atelier.selection.isActive && atelier.selection.start && atelier.selection.end}
    {@const isLooming = stance.current.type === 'LOOMING'}
    {@const x1 = Math.min(atelier.selection.start.x, atelier.selection.end.x)}
    {@const x2 = Math.max(atelier.selection.start.x, atelier.selection.end.x)}
    {@const y1 = Math.min(atelier.selection.start.y, atelier.selection.end.y)}
    {@const y2 = Math.max(atelier.selection.start.y, atelier.selection.end.y)}
    {@const width = x2 - x1 + 1}
    {@const height = y2 - y1 + 1}
    <div
        class="marching-ants pointer-events-none absolute z-40"
        style="
            left: {(x1 / atelier.linen.width) * 100}%; 
            top: {(y1 / atelier.linen.height) * 100}%; 
            width: {(width / atelier.linen.width) * 100}%; 
            height: {(height / atelier.linen.height) * 100}%;
            --lasso-color: {isLooming ? 'var(--color-brand)' : 'rgba(0,0,0,0.3)'};
            box-shadow: 0 0 0 1px rgba(255,255,255,0.5);
        "
    ></div>
{/if}

<style>
	.marching-ants {
		--ants-color: var(--lasso-color, var(--color-brand));
		background-image: linear-gradient(90deg, var(--ants-color) 50%, transparent 50%),
			linear-gradient(90deg, var(--ants-color) 50%, transparent 50%),
			linear-gradient(0deg, var(--ants-color) 50%, transparent 50%),
			linear-gradient(0deg, var(--ants-color) 50%, transparent 50%);
		background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
		background-size: 10px 1px, 10px 1px, 1px 10px, 1px 10px;
		background-position: 0 0, 0 100%, 0 0, 100% 0;
		animation: marching-ants-animation 0.6s infinite linear;
	}

	@keyframes marching-ants-animation {
		from { background-position: 0 0, 0 100%, 0 0, 100% 0; }
		to { background-position: 10px 0, -10px 100%, 0 -10px, 100% 10px; }
	}
</style>
