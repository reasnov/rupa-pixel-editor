<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import StateIndicator from './StateIndicator.svelte';
</script>

<div class="artisan-panel bottom-panel flex min-w-[600px] items-center justify-between gap-8 border-t-4 border-white px-10 py-4 shadow-xl">
	<div class="flex gap-3">
		<button class="artisan-tool-btn" onclick={() => (atelier.studio.showPatternCatalog = true)}>
			<span>📖</span> Catalog
		</button>
		<button class="artisan-tool-btn" onclick={() => (atelier.studio.showArtifactCrate = true)}>
			<span>🧺</span> Export
		</button>
		<button class="artisan-tool-btn" onclick={() => atelier.clearLinen()}>
			<span>🌿</span> Clear
		</button>
		<button class="artisan-tool-btn" onclick={() => atelier.toggleMute()}>
			<span>{atelier.studio.isMuted ? '🔇' : '🔊'}</span>
			{atelier.studio.isMuted ? 'Unmute' : 'Mute'}
		</button>
	</div>

	<div class="h-8 w-px bg-studio-text/10"></div>

	<StateIndicator />
</div>
