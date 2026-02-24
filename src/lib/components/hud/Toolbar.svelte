<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { editor as engine } from '../../engine/editor.svelte.js';
	import { sfx } from '../../engine/audio.js';
	import { fade, scale } from 'svelte/transition';
	import Button from '../ui/Button.svelte';

	const studio = editor.studio;

	let { side = 'left' }: { side?: 'left' | 'right' } = $props();

	function handleToolClick(intent: any) {
		sfx.playCeramicSlide();
		engine.handleIntent(intent);
	}

	// Tool Definitions
	const primaryTools = [
		{ id: 'BRUSH', icon: '🖌️', intent: 'TOOL_BRUSH' as const, label: 'TOOL_BRUSH' },
		{ id: 'ERASER', icon: '🧹', intent: 'TOOL_ERASER' as const, label: 'TOOL_ERASER' },
		{ id: 'RECT_SELECT', icon: '✨', intent: 'TOOL_RECT_SELECT' as const, label: 'TOOL_RECT_SELECT' },
		{ id: 'LASSO_SELECT', icon: '➰', intent: 'TOOL_LASSO_SELECT' as const, label: 'TOOL_LASSO_SELECT' },
		{ id: 'POLY_SELECT', icon: '📐', intent: 'TOOL_POLY_SELECT' as const, label: 'TOOL_POLY_SELECT' },
		{ id: 'RECTANGLE', icon: '📦', intent: 'TOOL_RECTANGLE' as const, label: 'TOOL_RECTANGLE' },
		{ id: 'ELLIPSE', icon: '⭕', intent: 'TOOL_ELLIPSE' as const, label: 'TOOL_ELLIPSE' },
		{ id: 'POLYGON', icon: '⭐', intent: 'TOOL_POLYGON' as const, label: 'TOOL_POLYGON' },
		{ id: 'HAND', icon: '🤚', intent: 'TOGGLE_HAND_TOOL' as const, label: 'TOGGLE_HAND_TOOL' }
	];
    // ... rest of logic remains same ...
</script>

<div
	class="toolbar custom-scrollbar flex h-full flex-col items-center gap-4 overflow-y-auto py-4"
>
	{#if side === 'left'}
		<!-- Main Drawing Tools -->
		<div class="flex flex-col gap-1.5">
			{#each primaryTools as tool}
				<div class="relative">
					<Button
						variant="tool"
						isActive={studio.activeTool === tool.id}
						ariaLabel={__(`common:labels.${tool.label}`)}
						onclick={() => handleToolClick(tool.intent)}
						class="w-8 h-8 !p-0"
					>
						<span class="text-sm">{tool.icon}</span>
					</Button>

					<!-- Polygon Sides Controller -->
					{#if tool.id === 'POLYGON' && studio.activeTool === 'POLYGON'}
						<div
							transition:fade
							class="absolute top-0 -right-12 flex flex-col items-center gap-1 rounded-md bg-washi-white p-1 shadow-md ring-1 ring-evergreen/10 z-50"
						>
							<button
								class="flex h-4 w-4 items-center justify-center text-[10px] hover:text-fern-green"
								onclick={() => engine.handleIntent('POLY_SIDES_INC')}
							>
								+
							</button>
							<span class="font-tiny5 text-[8px] text-fern-green">{studio.polygonSides}</span>
							<button
								class="flex h-4 w-4 items-center justify-center text-[10px] hover:text-fern-green"
								onclick={() => engine.handleIntent('POLY_SIDES_DEC')}
							>
								-
							</button>

							<div class="my-1 h-px w-2 bg-evergreen/10"></div>

							<!-- Indentation Control -->
							<div class="flex flex-col items-center gap-0.5">
								<button
									class="text-[8px] hover:text-fern-green"
									onclick={() =>
										(studio.polygonIndentation = Math.min(100, studio.polygonIndentation + 10))}
								>
									▴
								</button>
								<span class="text-[7px] font-bold text-fern-green/60"
									>{studio.polygonIndentation}%</span
								>
								<button
									class="text-[8px] hover:text-fern-green"
									onclick={() =>
										(studio.polygonIndentation = Math.max(0, studio.polygonIndentation - 10))}
								>
									▾
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<!-- Shading & Toning -->
		<div class="flex flex-col gap-1.5">
			{#each shading as tool}
				<Button
					variant="tool"
					isActive={tool.active()}
					ariaLabel={__(`common:labels.${tool.label}`)}
					onclick={() => engine.handleIntent(tool.intent)}
					class="w-8 h-8 !p-0"
				>
					<span class="text-sm">{tool.icon}</span>
				</Button>
			{/each}
		</div>

		<div class="h-px w-4 bg-evergreen/10"></div>

		<!-- Behavioral Toggles -->
		<div class="flex flex-col gap-1.5">
			{#each toggles as toggle}
				<Button
					variant="tool"
					isActive={toggle.active()}
					disabled={toggle.disabled?.()}
					ariaLabel={__(`common:labels.${toggle.label}`)}
					onclick={() => !toggle.disabled?.() && engine.handleIntent(toggle.intent)}
					class="w-8 h-8 !p-0"
				>
					<span class="text-sm">{toggle.icon}</span>
				</Button>
			{/each}
		</div>

		<div class="h-px w-4 bg-evergreen/10"></div>

		<!-- Status Locks -->
		<div class="flex flex-col gap-1.5">
			{#each locks as lock}
				<Button
					variant="tool"
					isActive={lock.active()}
					ariaLabel={__(`common:labels.${lock.label}`)}
					onclick={() => engine.handleIntent(lock.intent)}
					class="w-8 h-8 !p-0 font-bold"
				>
					<span class="text-[10px]">{lock.icon}</span>
					{#if lock.active()}
						<div transition:scale class="absolute -top-1 -right-1 text-[8px]">🔒</div>
					{/if}
				</Button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.toolbar {
		scrollbar-width: none; /* Firefox */
	}

	.toolbar::-webkit-scrollbar {
		display: none; /* Chrome/Safari */
	}
</style>
