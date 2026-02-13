<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
</script>

<div class="flex items-center gap-3">
	<button
		class="artisan-tool-btn !py-1.5"
		onclick={() => (atelier.studio.showPatternCatalog = true)}
	>
		<span>📖</span> Catalog
	</button>
	<button
		class="artisan-tool-btn !py-1.5"
		onclick={() => (atelier.studio.showArtifactCrate = true)}
	>
		<span>🧺</span> Export
	</button>
	<button class="artisan-tool-btn !py-1.5" onclick={() => atelier.clearLinen()}>
		<span>🌿</span> Clear
	</button>
	<button class="artisan-tool-btn !py-1.5" onclick={() => (atelier.showAudioBasin = true)}>
		<span>{atelier.isMuted ? '🔇' : '🔊'}</span>
		Audio
	</button>
	<div
		class="flex items-center gap-2 rounded-lg border border-black/5 bg-black/5 px-3 py-1.5"
		title="Atmosphere Status"
	>
		<span class={atelier.usageMinutes >= 30 ? 'animate-pulse' : 'opacity-40'}>🎹</span>
		<span class="font-serif text-[10px] italic tabular-nums opacity-40">
			{#if atelier.usageMinutes < 30}
				Waiting ({30 - atelier.usageMinutes}m)
			{:else if atelier.usageMinutes < 60}
				Weaving...
			{:else}
				Full Resonance
			{/if}
		</span>
	</div>
</div>
