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
	<div class="mx-1 h-6 w-px bg-grid-border"></div>
	<button class="artisan-tool-btn !py-1.5" onclick={() => (atelier.showArtisanCodex = true)}>
		<span>📜</span> Codex
	</button>
	<button class="artisan-tool-btn !py-1.5" onclick={() => (atelier.showArtisanGuide = true)}>
		<span>⌨️</span> Keys
	</button>
</div>
