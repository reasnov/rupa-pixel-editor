<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
</script>

<nav class="flex items-center gap-2" aria-label="Editor Tools">
	<!-- Menu & Service -->
	<div class="flex gap-1.5" role="group">
		<button
			class="editor-tool-btn"
			onclick={() => (editor.showCommandPalette = true)}
			title="{__('common:hud.menu.catalog_title')} (Ctrl+K)"
		>
			<span aria-hidden="true">📖</span>
			<span class="hidden xl:inline">{__('common:hud.menu.catalog_title')}</span>
		</button>

		<button
			class="editor-tool-btn"
			onclick={() => (editor.showExportMenu = true)}
			title="{__('common:export.title')} (Ctrl+E)"
		>
			<span aria-hidden="true">📦</span>
			<span class="hidden xl:inline">{__('common:export.title')}</span>
		</button>
	</div>

	<div class="mx-2 h-4 w-px bg-evergreen/10" aria-hidden="true"></div>

	<!-- System Control -->
	<div class="flex gap-1.5" role="group">
		<button
			class="editor-tool-btn"
			onclick={() => editor.clearCanvas()}
			title="{__('common:hud.actions.clear_canvas')} (Ctrl+L)"
		>
			<span aria-hidden="true">🍃</span>
			<span class="hidden xl:inline">{__('common:hud.actions.clear_canvas')}</span>
		</button>

		<button
			class="editor-tool-btn"
			onclick={() => (editor.showAudioSettings = true)}
			title="{__('common:hud.audio.title')} (Ctrl+Shift+A)"
		>
			<span aria-hidden="true">{editor.isMuted ? '🔇' : '🔊'}</span>
			<span class="hidden xl:inline">{__('common:hud.audio.title')}</span>
		</button>
	</div>

	<div class="mx-2 h-4 w-px bg-evergreen/10" aria-hidden="true"></div>

	<!-- Knowledge & Help -->
	<div class="flex gap-1.5" role="group">
		<button
			class="editor-tool-btn"
			onclick={() => (editor.showManual = true)}
			title="User Guide (F1)"
		>
			<span aria-hidden="true">📜</span>
			<span class="hidden xl:inline">User Guide</span>
		</button>

		<button
			class="editor-tool-btn"
			onclick={() => (editor.showShortcuts = true)}
			title="{__('shortcuts:title')} (F2)"
		>
			<span aria-hidden="true">⌨️</span>
			<span class="hidden xl:inline">{__('shortcuts:title')}</span>
		</button>
	</div>
</nav>
