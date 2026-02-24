<script lang="ts">
	import { editor } from '$lib/state/editor.svelte.js';
	import { services } from '$lib/engine/services.js';
	import { editor as engine } from '$lib/engine/editor.svelte.js';

	// Layout Containers
	import EditorHeader from '$lib/components/huds/EditorHeader.svelte';
	import FrameSidebar from '$lib/components/huds/FrameSidebar.svelte';
	import InspectorSidebar from '$lib/components/huds/InspectorSidebar.svelte';
	import StatusFooter from '$lib/components/huds/StatusFooter.svelte';

	// Canvas
	import Canvas from '$lib/components/canvases/Canvas.svelte';
	import SplashScreen from '$lib/components/brands/SplashScreen.svelte';

	// Overlay Modules
	import ColorPicker from '$lib/components/overlays/ColorPicker.svelte';
	import CommandPalette from '$lib/components/overlays/CommandPalette.svelte';
	import ExportMenu from '$lib/components/overlays/ExportMenu.svelte';
	import GuideMenu from '$lib/components/overlays/Shortcuts.svelte';
	import PersistenceMenu from '$lib/components/overlays/PersistenceMenu.svelte';
	import CanvasSettings from '$lib/components/overlays/CanvasSettings.svelte';
	import PaletteLibrary from '$lib/components/overlays/PaletteLibrary.svelte';
	import GoToModal from '$lib/components/overlays/GoToModal.svelte';
	import AudioSettings from '$lib/components/overlays/AudioSettings.svelte';
	import UserGuide from '$lib/components/overlays/UserGuide.svelte';
	import UnderlayMenu from '$lib/components/overlays/UnderlayMenu.svelte';
	import ImportZone from '$lib/components/overlays/ImportZone.svelte';
	import ErrorDialog from '$lib/components/overlays/ErrorDialog.svelte';
	import RecoveryPrompt from '$lib/components/overlays/RecoveryPrompt.svelte';
	import ContextMenu from '$lib/components/elements/ContextMenu.svelte';
	import Toast from '$lib/components/elements/Toast.svelte';

	import { onMount } from 'svelte';

	// Industry-Standard Layout Components
	import AppShell from '$lib/components/layouts/AppShell.svelte';
	import AppHeader from '$lib/components/layouts/AppHeader.svelte';
	import AppFooter from '$lib/components/layouts/AppFooter.svelte';
	import AppSidebar from '$lib/components/layouts/AppSidebar.svelte';
	import AppViewport from '$lib/components/layouts/AppViewport.svelte';
	import AppOverlay from '$lib/components/layouts/AppOverlay.svelte';

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

			{#if editor.studio.showErrorDialog}
				<ErrorDialog onClose={() => (editor.studio.showErrorDialog = false)} />
			{/if}

			{#if editor.studio.showRecoveryPrompt}
				<RecoveryPrompt onResolve={() => (editor.studio.showRecoveryPrompt = false)} />
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
