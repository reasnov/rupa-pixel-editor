<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { loom } from '../../engine/loom.svelte.js';
	import StateIndicator from './StateIndicator.svelte';
</script>

<div
	class="artisan-panel bottom-panel flex min-w-[800px] items-center justify-between gap-12 border-t-4 border-white px-10 py-4 shadow-xl"
	role="toolbar"
	aria-label="Artisan Workshop Tools"
>
	<div class="flex items-center gap-6">
		<!-- Group: The Pattern Book -->
		<div
			class="flex gap-2"
			role="group"
			aria-label={__({ key: 'shortcuts.groups.the_pattern_book' })}
		>
			<button
				class="artisan-tool-btn"
				onclick={() => loom.handleIntent('OPEN_PALETTE')}
				title={__({ key: 'shortcuts.labels.OPEN_PALETTE' }) + ' (Ctrl+K)'}
			>
				<span aria-hidden="true">📖</span>
				{__({ key: 'hud.basin.catalog_title' })}
			</button>
			<button
				class="artisan-tool-btn"
				onclick={() => loom.handleIntent('OPEN_EXPORT')}
				title={__({ key: 'shortcuts.labels.OPEN_EXPORT' }) + ' (Ctrl+E)'}
			>
				<span aria-hidden="true">🧺</span>
				{__({ key: 'hud.actions.preserve_weave' })}
			</button>
		</div>

		<div class="h-6 w-px bg-studio-text/10" aria-hidden="true"></div>

		<!-- Group: Magic & Transformations -->
		<div class="flex gap-2" role="group" aria-label={__({ key: 'shortcuts.groups.artisan_magic' })}>
			<button
				class="artisan-tool-btn"
				onclick={() => loom.handleIntent('SOAK')}
				title={__({ key: 'shortcuts.labels.SOAK' }) + ' (F)'}
			>
				<span aria-hidden="true">💧</span>
				{__({ key: 'shortcuts.labels.SOAK' })}
			</button>
			<button
				class="artisan-tool-btn"
				onclick={() => loom.handleIntent('SPIRIT_PICK')}
				title={__({ key: 'shortcuts.labels.SPIRIT_PICK' }) + ' (W)'}
			>
				<span aria-hidden="true">🪄</span>
				{__({ key: 'shortcuts.labels.SPIRIT_PICK' })}
			</button>
			<button
				class="artisan-tool-btn"
				onclick={() => loom.handleIntent('ROTATE')}
				title={__({ key: 'shortcuts.labels.ROTATE' }) + ' (R)'}
			>
				<span aria-hidden="true">🔄</span>
			</button>
		</div>

		<div class="h-6 w-px bg-studio-text/10" aria-hidden="true"></div>

		<!-- Group: Studio Control -->
		<div
			class="flex gap-2"
			role="group"
			aria-label={__({ key: 'shortcuts.groups.atmosphere_tuning' })}
		>
			<button
				class="artisan-tool-btn"
				onclick={() => loom.handleIntent('CLEAR_LINEN')}
				title={__({ key: 'shortcuts.labels.CLEAR_LINEN' }) + ' (Ctrl+L)'}
			>
				<span aria-hidden="true">🌿</span>
				{__({ key: 'hud.actions.clear_linen' })}
			</button>
			<button
				class="artisan-tool-btn"
				onclick={() => loom.handleIntent('TOGGLE_MUTE')}
				title={__({ key: 'shortcuts.labels.TOGGLE_MUTE' }) + ' (Ctrl+M)'}
			>
				<span aria-hidden="true">{atelier.studio.isMuted ? '🔇' : '🔊'}</span>
				{atelier.studio.isMuted
					? __({ key: 'hud.actions.unmute_ambient' })
					: __({ key: 'hud.actions.mute_ambient' })}
			</button>
		</div>
	</div>

	<StateIndicator />
</div>
