<script lang="ts">
	import { editor } from '$lib/state/editor.svelte.js';
	import { services } from '$lib/engine/services.js';
	import { editor as engine } from '$lib/engine/editor.svelte.js';

	// Layout Containers
	import EditorHeader from '$lib/components/hud/EditorHeader.svelte';
	import FrameSidebar from '$lib/components/hud/FrameSidebar.svelte';
	import InspectorSidebar from '$lib/components/hud/InspectorSidebar.svelte';
	import StatusFooter from '$lib/components/hud/StatusFooter.svelte';

	// Canvas
	import Canvas from '$lib/components/canvas/Canvas.svelte';
	import SplashScreen from '$lib/components/brand/SplashScreen.svelte';

	// Overlay Modules
	import ColorPicker from '$lib/components/overlay/ColorPicker.svelte';
	import CommandPalette from '$lib/components/overlay/CommandPalette.svelte';
	import ExportMenu from '$lib/components/overlay/ExportMenu.svelte';
	import GuideMenu from '$lib/components/overlay/Shortcuts.svelte';
	import PersistenceMenu from '$lib/components/overlay/PersistenceMenu.svelte';
	import CanvasSettings from '$lib/components/overlay/CanvasSettings.svelte';
	import PaletteLibrary from '$lib/components/overlay/PaletteLibrary.svelte';
	import GoToModal from '$lib/components/overlay/GoToModal.svelte';
	import AudioSettings from '$lib/components/overlay/AudioSettings.svelte';
	import UserGuide from '$lib/components/overlay/UserGuide.svelte';
	import UnderlayMenu from '$lib/components/overlay/UnderlayMenu.svelte';
	import ImportZone from '$lib/components/overlay/ImportZone.svelte';
	import ContextMenu from '$lib/components/ui/ContextMenu.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	import { onMount } from 'svelte';

	// Industry-Standard Layout Components
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import AppHeader from '$lib/components/layout/AppHeader.svelte';
	import AppFooter from '$lib/components/layout/AppFooter.svelte';
	import AppSidebar from '$lib/components/layout/AppSidebar.svelte';
	import AppViewport from '$lib/components/layout/AppViewport.svelte';
	import AppOverlay from '$lib/components/layout/AppOverlay.svelte';

	onMount(() => {
		return engine.mount();
	});
</script>

<AppShell>
	{#snippet header()}
		<AppHeader>
			<EditorHeader />
		</AppHeader>
	{/snippet}

	{#snippet sidebarLeft()}
		<AppSidebar side="left">
			<FrameSidebar />
		</AppSidebar>
	{/snippet}

	{#snippet viewport()}
		<AppViewport>
			<div
				class="relative flex h-full w-full items-center justify-center overflow-hidden bg-grid-border/20 p-6"
			>
				<div
					class="editor-frame flex h-full w-full items-center justify-center overflow-hidden shadow-2xl transition-all duration-700 ease-out {editor
						.project.isPlaying && editor.project.frames.length > 1
						? 'ring-palette-0 animate-pulse ring-8 ring-inset'
						: ''}"
				>
					<Canvas />
				</div>
			</div>
		</AppViewport>
	{/snippet}

	{#snippet sidebarRight()}
		<AppSidebar side="right">
			<InspectorSidebar />
		</AppSidebar>
	{/snippet}

	{#snippet footer()}
		<AppFooter>
			<StatusFooter />
		</AppFooter>
	{/snippet}

	{#snippet overlay()}
		<AppOverlay>
			<SplashScreen />

			{#if editor.showManual}
				<UserGuide onClose={() => (editor.showManual = false)} />
			{/if}

			{#if editor.showCommandPalette}
				<CommandPalette onClose={() => (editor.showCommandPalette = false)} />
			{/if}

			{#if editor.showColorPicker}
				<ColorPicker
					bind:value={editor.paletteState.activeColor}
					onClose={() => (editor.showColorPicker = false)}
				/>
			{/if}

			{#if editor.showExportMenu}
				<ExportMenu
					onExport={(format, scale, bgColor) => services.createArtifact(format, scale, bgColor)}
					onClose={() => (editor.showExportMenu = false)}
				/>
			{/if}

			{#if editor.showPersistenceMenu}
				<PersistenceMenu onClose={() => (editor.showPersistenceMenu = false)} />
			{/if}

			{#if editor.studio.showPaletteLibrary}
				<PaletteLibrary onClose={() => (editor.studio.showPaletteLibrary = false)} />
			{/if}

			{#if editor.showCanvasSettings}
				<CanvasSettings onClose={() => (editor.showCanvasSettings = false)} />
			{/if}

			{#if editor.showGoTo}
				<GoToModal onClose={() => (editor.showGoTo = false)} />
			{/if}

			{#if editor.studio.showPourBasin}
				<ImportZone onClose={() => (editor.studio.showPourBasin = false)} />
			{/if}

			{#if editor.showAudioSettings}
				<AudioSettings onClose={() => (editor.showAudioSettings = false)} />
			{/if}

			{#if editor.showShortcuts}
				<GuideMenu onClose={() => (editor.showShortcuts = false)} />
			{/if}

			{#if editor.studio.showUnderlayMenu}
				<UnderlayMenu />
			{/if}

			{#if editor.studio.contextMenu}
				<ContextMenu
					x={editor.studio.contextMenu.x}
					y={editor.studio.contextMenu.y}
					items={editor.studio.contextMenu.items}
					onClose={() => (editor.studio.contextMenu = null)}
				/>
			{/if}

			<Toast />
		</AppOverlay>
	{/snippet}
</AppShell>
