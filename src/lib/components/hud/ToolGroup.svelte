<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
</script>

<div
	class="artisan-panel pointer-events-auto flex gap-2 rounded-xl border-b-2 border-white px-4 py-2 shadow-sm"
>
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
	<button class="artisan-tool-btn !py-1.5" onclick={() => atelier.studio.toggleMute()}>
		<span>{atelier.studio.isMuted ? '🔇' : '🔊'}</span>
		{atelier.studio.isMuted ? 'Unmute' : 'Mute'}
	</button>
</div>
