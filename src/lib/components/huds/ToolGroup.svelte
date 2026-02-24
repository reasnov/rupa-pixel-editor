<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import Button from '../elements/Button.svelte';
</script>

<nav class="flex items-center gap-2" aria-label="Editor Tools">
	<!-- Menu & Service -->
	<div class="flex gap-1.5" role="group">
		<Button
			variant="tool"
			onclick={() => (editor.showCommandPalette = true)}
			ariaLabel="workspace:hud.menu.catalog_title"
		>
			<span aria-hidden="true">📖</span>
			<span class="hidden xl:inline">{__('workspace:hud.menu.catalog_title')}</span>
		</Button>

		<Button variant="tool" onclick={() => (editor.showExportMenu = true)} ariaLabel="export:title">
			<span aria-hidden="true">📦</span>
			<span class="hidden xl:inline">{__('export:title')}</span>
		</Button>
	</div>

	<div class="mx-2 h-4 w-px bg-text-main/10" aria-hidden="true"></div>

	<!-- System Control -->
	<div class="flex gap-1.5" role="group">
		<Button
			variant="tool"
			onclick={() => editor.clearCanvas()}
			ariaLabel="workspace:hud.actions.clear_canvas"
		>
			<span aria-hidden="true">🍃</span>
			<span class="hidden xl:inline">{__('workspace:hud.actions.clear_canvas')}</span>
		</Button>

		<Button
			variant="tool"
			onclick={() => (editor.showAudioSettings = true)}
			ariaLabel="workspace:hud.audio.title"
		>
			<span aria-hidden="true">{editor.isMuted ? '🔇' : '🔊'}</span>
			<span class="hidden xl:inline">{__('workspace:hud.audio.title')}</span>
		</Button>
	</div>

	<div class="mx-2 h-4 w-px bg-text-main/10" aria-hidden="true"></div>

	<!-- Knowledge & Help -->
	<div class="flex gap-1.5" role="group">
		<Button variant="tool" onclick={() => (editor.showManual = true)} ariaLabel="manual:title">
			<span aria-hidden="true">📜</span>
			<span class="hidden xl:inline">{__('manual:title')}</span>
		</Button>

		<Button
			variant="tool"
			onclick={() => (editor.showShortcuts = true)}
			ariaLabel="shortcuts:title"
		>
			<span aria-hidden="true">⌨️</span>
			<span class="hidden xl:inline">{__('shortcuts:title')}</span>
		</Button>
	</div>
</nav>
