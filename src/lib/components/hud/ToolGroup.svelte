<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
</script>

<div class="flex items-center gap-3">
	<button
		class="artisan-tool-btn !py-1.5"
		onclick={() => (atelier.studio.showPatternCatalog = true)}
	>
		<span aria-hidden="true">📖</span>
		{__({ key: 'hud.basin.catalog_title' })}
	</button>
	<button
		class="artisan-tool-btn !py-1.5"
		onclick={() => (atelier.studio.showArtifactCrate = true)}
	>
		<span aria-hidden="true">🧺</span>
		{__({ key: 'hud.actions.preserve_weave' })}
	</button>
	<button class="artisan-tool-btn !py-1.5" onclick={() => atelier.clearLinen()}>
		<span aria-hidden="true">🌿</span>
		{__({ key: 'hud.actions.clear_linen' })}
	</button>
	<button class="artisan-tool-btn !py-1.5" onclick={() => (atelier.showAudioBasin = true)}>
		<span aria-hidden="true">{atelier.isMuted ? '🔇' : '🔊'}</span>
		{__({ key: 'hud.atmosphere.title' })}
	</button>
	<div class="mx-1 h-6 w-px bg-grid-border" aria-hidden="true"></div>
	<button class="artisan-tool-btn !py-1.5" onclick={() => (atelier.showArtisanCodex = true)}>
		<span aria-hidden="true">📜</span>
		{__({ key: 'codex.title' })}
	</button>
	<button class="artisan-tool-btn !py-1.5" onclick={() => (atelier.showArtisanGuide = true)}>
		<span aria-hidden="true">⌨️</span>
		{__({ key: 'guide.title' })}
	</button>
</div>
