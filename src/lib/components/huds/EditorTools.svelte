<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor as state } from '../../state/editor.svelte.js';
	import { editor } from '../../engine/editor.svelte.js';
	import StateIndicator from './StateIndicator.svelte';
	import Button from '../elements/Button.svelte';
</script>

<div
	class="editor-panel bottom-panel flex min-w-[800px] items-center justify-between gap-12 border-t-4 border-canvas-bg px-10 py-4 shadow-xl"
	role="toolbar"
	aria-label="Rural Artisan Tools"
>
	<div class="flex items-center gap-6">
		<div class="flex gap-2" role="group" aria-label={__('shortcuts:groups.system')}>
			<Button
				variant="tool"
				onclick={() => editor.handleIntent('OPEN_MENU')}
				ariaLabel="actions:open_menu"
			>
				<span aria-hidden="true">📖</span>
				{__('workspace:hud.menu.catalog_title')}
			</Button>
			<Button
				variant="tool"
				onclick={() => editor.handleIntent('OPEN_EXPORT')}
				ariaLabel="actions:open_export"
			>
				<span aria-hidden="true">📦</span>
				{__('workspace:hud.actions.save_project')}
			</Button>
		</div>

		<div class="h-6 w-px bg-text-main/10" aria-hidden="true"></div>

		<!-- Group: Magic & Transformations -->
		<div class="flex gap-2" role="group" aria-label={__('shortcuts:groups.magic')}>
			<Button
				variant="tool"
				onclick={() => editor.handleIntent('FLOOD_FILL')}
				ariaLabel="actions:flood_fill"
			>
				<span aria-hidden="true">💧</span>
				{__('actions:flood_fill')}
			</Button>
			<Button
				variant="tool"
				onclick={() => editor.handleIntent('SELECT_SAME')}
				ariaLabel="actions:select_same"
			>
				<span aria-hidden="true">🪄</span>
				{__('actions:select_same')}
			</Button>
			<Button
				variant="tool"
				onclick={() => editor.handleIntent('ROTATE')}
				ariaLabel="actions:rotate"
			>
				<span aria-hidden="true">🔄</span>
			</Button>
		</div>

		<div class="h-6 w-px bg-text-main/10" aria-hidden="true"></div>

		<!-- Group: Rural Sanctuary Control -->
		<div class="flex gap-2" role="group" aria-label={__('shortcuts:groups.system')}>
			<Button
				variant="tool"
				onclick={() => editor.handleIntent('CLEAR_CANVAS')}
				ariaLabel="actions:clear_canvas"
			>
				<span aria-hidden="true">🌿</span>
				{__('workspace:hud.actions.clear_canvas')}
			</Button>
			<Button
				variant="tool"
				onclick={() => editor.handleIntent('TOGGLE_MUTE')}
				ariaLabel="actions:toggle_mute"
			>
				<span aria-hidden="true">{state.isMuted ? '🔇' : '🔊'}</span>
				{state.isMuted
					? __('workspace:hud.actions.unmute_audio')
					: __('workspace:hud.actions.mute_audio')}
			</Button>
		</div>
	</div>

	<StateIndicator />
</div>
