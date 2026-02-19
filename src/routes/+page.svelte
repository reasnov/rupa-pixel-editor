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
	import GuideMenu from '$lib/components/overlay/GuideMenu.svelte';
	import PersistenceMenu from '$lib/components/overlay/PersistenceMenu.svelte';
	import CanvasSettings from '$lib/components/overlay/CanvasSettings.svelte';
	import GoToModal from '$lib/components/overlay/GoToModal.svelte';
	import AudioSettings from '$lib/components/overlay/AudioSettings.svelte';
	import GuideBook from '$lib/components/overlay/GuideBook.svelte';
	import UnderlayMenu from '$lib/components/overlay/UnderlayMenu.svelte';
	import Minimap from '$lib/components/hud/Minimap.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	import { onMount } from 'svelte';

	onMount(() => {
		return engine.mount();
	});
</script>

<SplashScreen />

{#if editor.showGuideBook}
	<GuideBook onClose={() => (editor.showGuideBook = false)} />
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

{#if editor.showCanvasSettings}
	<CanvasSettings onClose={() => (editor.showCanvasSettings = false)} />
{/if}

{#if editor.showGoTo}
	<GoToModal onClose={() => (editor.showGoTo = false)} />
{/if}

{#if editor.showAudioSettings}
	<AudioSettings onClose={() => (editor.showAudioSettings = false)} />
{/if}

{#if editor.showGuideMenu}
	<GuideMenu onClose={() => (editor.showGuideMenu = false)} />
{/if}

{#if editor.studio.showUnderlayMenu}
	<UnderlayMenu />
{/if}

{#if editor.studio.showMinimap}
	<Minimap />
{/if}

<Toast />

<!-- HUD Layout -->
<div class="flex h-screen w-screen flex-col overflow-hidden bg-canvas-bg selection:bg-brand/20">
	<EditorHeader />

	<div class="flex flex-1 overflow-hidden">
		<!-- Left Sidebar -->
		<aside class="flex w-64 flex-col overflow-hidden">
			<FrameSidebar />
		</aside>

		<main
			class="relative flex flex-1 items-center justify-center overflow-hidden bg-grid-border/20 p-6"
		>
			<div
				class="editor-frame flex h-full w-full items-center justify-center overflow-hidden shadow-2xl transition-all duration-700 ease-out {editor
					.project.isPlaying && editor.project.frames.length > 1
					? 'ring-palette-0 animate-pulse ring-8 ring-inset'
					: ''}"
			>
				<Canvas />
			</div>
		</main>

		<!-- Right Sidebar -->
		<aside class="flex w-72 flex-col overflow-hidden">
			<InspectorSidebar />
		</aside>
	</div>

	<StatusFooter />
</div>
