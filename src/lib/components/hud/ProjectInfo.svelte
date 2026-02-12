<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { fade } from 'svelte/transition';
</script>

<div class="pointer-events-auto flex flex-col items-end gap-2">
    <div class="artisan-panel px-6 py-3 shadow-sm border-b-2 border-white rounded-2xl">
        <h2 class="font-serif text-xs font-bold uppercase tracking-[0.2em] opacity-40">
            {atelier.project.name}
        </h2>
    </div>
    
    {#if atelier.project.lastSaved}
        <span transition:fade class="font-serif text-[9px] font-bold uppercase tracking-widest opacity-20 mr-4">
            Last Archived: {atelier.project.lastSaved.toLocaleTimeString()}
        </span>
    {/if}
</div>
