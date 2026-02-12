<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
</script>

<div class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
    <!-- Vertical Center -->
    <div class="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-studio-text/30"></div>
    <!-- Horizontal Center -->
    <div class="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-studio-text/30"></div>

    <!-- 8-Bit Rhythmic Guides -->
    {#each [-24, -16, -8, 8, 16, 24] as offset}
        {@const pos = 50 + (offset / atelier.linen.width) * 100}
        {#if pos > 0 && pos < 100}
            <div
                class="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-studio-text/10"
                style="left: {pos}%"
            ></div>
        {/if}
    {/each}
    {#each [-24, -16, -8, 8, 16, 24] as offset}
        {@const pos = 50 + (offset / atelier.linen.height) * 100}
        {#if pos > 0 && pos < 100}
            <div
                class="absolute right-0 left-0 h-px -translate-y-1/2 bg-studio-text/10"
                style="top: {pos}%"
            ></div>
        {/if}
    {/each}
</div>
