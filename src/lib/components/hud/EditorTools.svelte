<script lang="ts">
	import { __ } from "$lib/state/i18n.svelte.js";
	import { editor as state } from '../../state/editor.svelte.js';
	import { editor } from '../../engine/editor.svelte.js';
	import StateIndicator from './StateIndicator.svelte';
</script>

<div
	class="editor-panel bottom-panel flex min-w-[800px] items-center justify-between gap-12 border-t-4 border-white px-10 py-4 shadow-xl"
	role="toolbar"
	aria-label="Barista Tools"
>
	<div class="flex items-center gap-6">
		<div class="flex gap-2" role="group" aria-label={__({ key: 'shortcut_groups.system' })}>
			<button
				class="editor-tool-btn"
				onclick={() => editor.handleIntent('OPEN_MENU')}
				title={__({ key: 'shortcut_labels.OPEN_MENU' }) + ' (Ctrl+K)'}
			>
				<span aria-hidden="true">📖</span>
				{__({ key: 'hud.menu.catalog_title' })}
			</button>
			<button
				class="editor-tool-btn"
				onclick={() => editor.handleIntent('OPEN_EXPORT')}
				title={__({ key: 'shortcut_labels.OPEN_EXPORT' }) + ' (Ctrl+E)'}
			>
				<span aria-hidden="true">🧺</span>
				{__({ key: 'hud.actions.save_project' })}
			</button>
		</div>

		<div class="h-6 w-px bg-studio-text/10" aria-hidden="true"></div>

		<!-- Group: Magic & Transformations -->
		<div class="flex gap-2" role="group" aria-label={__({ key: 'shortcut_groups.magic' })}>
			<button
				class="editor-tool-btn"
				onclick={() => editor.handleIntent('FLOOD_FILL')}
				title={__({ key: 'shortcut_labels.FLOOD_FILL' }) + ' (F)'}
			>
				<span aria-hidden="true">💧</span>
				{__({ key: 'shortcut_labels.FLOOD_FILL' })}
			</button>
			<button
				class="editor-tool-btn"
				onclick={() => editor.handleIntent('SELECT_SAME')}
				title={__({ key: 'shortcut_labels.SELECT_SAME' }) + ' (W)'}
			>
				<span aria-hidden="true">🪄</span>
				{__({ key: 'shortcut_labels.SELECT_SAME' })}
			</button>
			<button
				class="editor-tool-btn"
				onclick={() => editor.handleIntent('ROTATE')}
				title={__({ key: 'shortcut_labels.ROTATE' }) + ' (R)'}
			>
				<span aria-hidden="true">🔄</span>
			</button>
		</div>

		<div class="h-6 w-px bg-studio-text/10" aria-hidden="true"></div>

		<!-- Group: Café Control -->
		<div class="flex gap-2" role="group" aria-label={__({ key: 'shortcut_groups.system' })}>
			<button
				class="editor-tool-btn"
				onclick={() => editor.handleIntent('CLEAR_CANVAS')}
				title={__({ key: 'shortcut_labels.CLEAR_CANVAS' }) + ' (Ctrl+L)'}
			>
				<span aria-hidden="true">🌿</span>
				{__({ key: 'hud.actions.clear_canvas' })}
			</button>
			<button
				class="editor-tool-btn"
				onclick={() => editor.handleIntent('TOGGLE_MUTE')}
				title={__({ key: 'shortcut_labels.TOGGLE_MUTE' }) + ' (Ctrl+M)'}
			>
				<span aria-hidden="true">{state.isMuted ? '🔇' : '🔊'}</span>
				{state.isMuted
					? __({ key: 'hud.actions.unmute_audio' })
					: __({ key: 'hud.actions.mute_audio' })}
			</button>
		</div>
	</div>

	<StateIndicator />
</div>
