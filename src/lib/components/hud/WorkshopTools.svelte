<script lang="ts">
	import { atelier } from '../../state/atelier.svelte';
	import StateIndicator from './StateIndicator.svelte';
</script>

<div class="fixed bottom-0 left-0 z-50 flex w-full justify-center p-6">
	<div class="artisan-panel bottom-panel flex items-center gap-8 border-t-4 border-white px-8 py-4 shadow-xl">
		<div class="flex gap-3">
			<button class="artisan-tool-btn" onclick={() => (atelier.showPatternCatalog = true)}>
				<span>📖</span> Catalog
			</button>
			<button class="artisan-tool-btn" onclick={() => (atelier.showArtifactCrate = true)}>
				<span>🧺</span> Export
			</button>
			<button class="artisan-tool-btn" onclick={() => atelier.clearLinen()}>
				<span>🌿</span> Clear
			</button>
			<button class="artisan-tool-btn" onclick={() => atelier.toggleMute()}>
				<span>{atelier.isMuted ? '🔇' : '🔊'}</span>
				{atelier.isMuted ? 'Unmute' : 'Mute'}
			</button>
		</div>

		<div class="h-8 w-px bg-studio-text/10"></div>

		<StateIndicator />
	</div>
</div>