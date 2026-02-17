<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
</script>

<nav class="flex items-center gap-2" aria-label="Editor Tools">
	<!-- Menu & Service -->
	<div class="flex gap-1.5" role="group">
		<button
			class="editor-tool-btn"
			onclick={() => (editor.showCommandPalette = true)}
			title="{__({ key: 'hud.menu.catalog_title' })} (Ctrl+K)"
		>
			<span aria-hidden="true">📖</span>
			<span class="hidden xl:inline">{__({ key: 'hud.menu.catalog_title' })}</span>
		</button>
		
		<button
			class="editor-tool-btn"
			onclick={() => (editor.showExportMenu = true)}
			title="{__({ key: 'export.title' })} (Ctrl+E)"
		>
			<span aria-hidden="true">🍶</span>
			<span class="hidden xl:inline">{__({ key: 'export.title' })}</span>
		</button>
	</div>

	<div class="mx-2 h-4 w-px bg-charcoal/10" aria-hidden="true"></div>

	<!-- System Control -->
	<div class="flex gap-1.5" role="group">
		<button 
			class="editor-tool-btn" 
			onclick={() => editor.clearCanvas()}
			title="{__({ key: 'hud.actions.clear_canvas' })} (Ctrl+L)"
		>
			<span aria-hidden="true">🧼</span>
			<span class="hidden xl:inline">{__({ key: 'hud.actions.clear_canvas' })}</span>
		</button>
		
		<button 
			class="editor-tool-btn" 
			onclick={() => (editor.showAudioSettings = true)}
			title="{__({ key: 'hud.audio.title' })} (Ctrl+Shift+A)"
		>
			<span aria-hidden="true">{editor.isMuted ? '🔇' : '🔊'}</span>
			<span class="hidden xl:inline">{__({ key: 'hud.audio.title' })}</span>
		</button>
	</div>

	<div class="mx-2 h-4 w-px bg-charcoal/10" aria-hidden="true"></div>

	<!-- Knowledge & Help -->
	<div class="flex gap-1.5" role="group">
		<button 
			class="editor-tool-btn" 
			onclick={() => (editor.showGuideBook = true)}
			title="{__({ key: 'manual.title' })} (F1)"
		>
			<span aria-hidden="true">📜</span>
			<span class="hidden xl:inline">{__({ key: 'manual.title' })}</span>
		</button>
		
		<button 
			class="editor-tool-btn" 
			onclick={() => (editor.showGuideMenu = true)}
			title="{__({ key: 'shortcuts.title' })} (F2)"
		>
			<span aria-hidden="true">⌨️</span>
			<span class="hidden xl:inline">{__({ key: 'shortcuts.title' })}</span>
		</button>
	</div>
</nav>
