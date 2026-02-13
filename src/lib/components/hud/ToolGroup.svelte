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
	<button class="artisan-tool-btn !py-1.5" onclick={() => atelier.studio.toggleMute()}>
		<span>{atelier.studio.isMuted ? '🔇' : '🔊'}</span>
		{atelier.studio.isMuted ? 'Unmute' : 'Mute'}
	</button>
	<button
		class="artisan-tool-btn !py-1.5 {atelier.studio.isAmbientPlaying
			? 'border-brand/40 bg-brand/5 text-brand'
			: ''}"
		onclick={() => {
			atelier.studio.isAmbientPlaying = !atelier.studio.isAmbientPlaying;
		}}
	>
		<span>🎹</span>
		{atelier.studio.isAmbientPlaying ? 'Music On' : 'Music Off'}
	</button>
</div>
