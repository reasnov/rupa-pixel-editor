<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import { fade } from 'svelte/transition';

	let draggedIndex = $state<number | null>(null);
	let dropTargetIndex = $state<number | null>(null);

	function handleDragStart(index: number) {
		draggedIndex = index;
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		dropTargetIndex = index;
	}

	function handleDrop(e: DragEvent, toIndex: number) {
		e.preventDefault();
		if (draggedIndex !== null) {
			if (editor.studio.projectActiveTab === 'layers') {
				services.project.reorderLayer(draggedIndex, toIndex);
			} else {
				services.project.reorderFrame(draggedIndex, toIndex);
			}
		}
		draggedIndex = null;
		dropTargetIndex = null;
	}

	function handleDragEnd() {
		draggedIndex = null;
		dropTargetIndex = null;
	}
</script>

<div
	class="flex h-full w-full flex-col overflow-hidden bg-transparent"
	role="region"
	aria-label="Project Explorer"
>
	<!-- Minimalist Tab Switcher -->
	<div class="flex border-b border-charcoal/10 bg-charcoal/5 p-1" role="tablist">
		<button
			onclick={() => (editor.studio.projectActiveTab = 'frames')}
			role="tab"
			aria-selected={editor.studio.projectActiveTab === 'frames'}
			title={__({ key: 'labels.TAB_TIMELINE' }) + ' (Alt+1)'}
			class="flex flex-1 items-center justify-center gap-2 py-2 text-[10px] font-bold tracking-widest uppercase transition-all {editor
				.studio.projectActiveTab === 'frames'
				? 'rounded bg-foam-white text-brand shadow-sm'
				: 'text-charcoal opacity-40 hover:opacity-60'}"
		>
			<span aria-hidden="true">🖼️</span>
			{__({ key: 'hud.project_panel.frames' })}
		</button>
		<button
			onclick={() => (editor.studio.projectActiveTab = 'layers')}
			role="tab"
			aria-selected={editor.studio.projectActiveTab === 'layers'}
			title={__({ key: 'labels.TAB_LAYERS' }) + ' (Alt+2)'}
			class="flex flex-1 items-center justify-center gap-2 py-2 text-[10px] font-bold tracking-widest uppercase transition-all {editor
				.studio.projectActiveTab === 'layers'
				? 'rounded bg-foam-white text-brand shadow-sm'
				: 'text-charcoal opacity-40 hover:opacity-60'}"
		>
			<span aria-hidden="true">🧵</span>
			{__({ key: 'hud.project_panel.layers' })}
		</button>
	</div>

	<!-- Content -->
	<div class="custom-scrollbar flex-1 overflow-y-auto p-2">
		{#if editor.studio.projectActiveTab === 'frames'}
			<div class="flex flex-col gap-1" transition:fade={{ duration: 150 }} role="list">
				{#each editor.project.frames as frame, i}
					<div
						role="listitem"
						draggable="true"
						ondragstart={() => handleDragStart(i)}
						ondragover={(e) => handleDragOver(e, i)}
						ondrop={(e) => handleDrop(e, i)}
						ondragend={handleDragEnd}
						class="group flex cursor-grab items-center justify-between rounded px-2 transition-all {i ===
						editor.project.activeFrameIndex
							? 'bg-brand/5 text-brand ring-1 ring-brand/10'
							: 'hover:bg-charcoal/5'} {dropTargetIndex === i && draggedIndex !== i
							? 'border-t-2 border-brand'
							: ''} {draggedIndex === i ? 'opacity-40' : ''}"
						aria-current={i === editor.project.activeFrameIndex ? 'true' : undefined}
					>
						<button
							class="flex flex-1 items-center gap-3 overflow-hidden py-2 pl-1 text-left"
							onclick={() => (editor.project.activeFrameIndex = i)}
						>
							<span class="font-mono text-[10px] opacity-30" aria-hidden="true">{i + 1}</span>
							<span class="truncate font-serif text-sm font-medium text-charcoal">{frame.name}</span
							>
						</button>
						<div class="flex items-center gap-2">
							<button
								onclick={(e) => {
									e.stopPropagation();
									services.project.duplicateFrame(i);
								}}
								class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
								title={__({ key: 'hud.actions.duplicate' })}
							>
								📋
							</button>
							{#if editor.project.frames.length > 1}
								<button
									onclick={(e) => {
										e.stopPropagation();
										services.project.removeFrame(i);
									}}
									class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
									title={__({ key: 'hud.actions.delete' })}
								>
									🗑️
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col gap-1" transition:fade={{ duration: 150 }} role="list">
				{#each editor.project.activeFrame.layers as layer, i}
					{@const parent = layer.parentId
						? editor.project.activeFrame.layers.find((l) => l.id === layer.parentId)
						: null}
					{#if !parent || !parent.isCollapsed}
						{@const isChild = layer.parentId !== null}
						<div
							role="listitem"
							draggable="true"
							ondragstart={() => handleDragStart(i)}
							ondragover={(e) => handleDragOver(e, i)}
							ondrop={(e) => handleDrop(e, i)}
							ondragend={handleDragEnd}
							class="group flex cursor-grab items-center justify-between rounded px-2 transition-all {i ===
							editor.project.activeFrame.activeLayerIndex
								? 'bg-brand/5 text-brand ring-1 ring-brand/10'
								: 'hover:bg-charcoal/5'} {dropTargetIndex === i && draggedIndex !== i
								? 'border-t-2 border-brand'
								: ''} {draggedIndex === i ? 'opacity-40' : ''}"
							style={isChild ? 'margin-left: 12px;' : ''}
							aria-current={i === editor.project.activeFrame.activeLayerIndex ? 'true' : undefined}
						>
							<div class="flex flex-1 items-center gap-2 overflow-hidden">
								{#if layer.type === 'FOLDER'}
									<button
										onclick={(e) => {
											e.stopPropagation();
											layer.isCollapsed = !layer.isCollapsed;
										}}
										class="text-[10px] opacity-40 hover:opacity-100"
									>
										{layer.isCollapsed ? '▶' : '▼'}
									</button>
								{/if}
								<button
									onclick={(e) => {
										e.stopPropagation();
										services.project.toggleVisibility(i);
									}}
									class="text-xs transition-opacity {layer.isVisible
										? 'opacity-100'
										: 'opacity-20'}"
									title={__({ key: 'hud.project_panel.visibility' })}
								>
									{layer.isVisible
										? layer.type === 'FOLDER'
											? '📂'
											: '👁️'
										: layer.type === 'FOLDER'
											? '📁'
											: '🕶️'}
								</button>
								<button
									class="flex-1 truncate py-2 text-left font-serif text-sm font-medium text-charcoal {layer.isVisible
										? ''
										: 'opacity-40'}"
									onclick={() => (editor.project.activeFrame.activeLayerIndex = i)}
								>
									{layer.name}
								</button>
							</div>
							<div class="flex items-center gap-2">
								<button
									onclick={(e) => {
										e.stopPropagation();
										services.project.toggleLock(i);
									}}
									class="text-[10px] transition-opacity {layer.isLocked
										? 'opacity-100'
										: 'opacity-20'}"
									title={__({ key: 'hud.project_panel.lock' })}
								>
									{layer.isLocked ? '🔒' : '🔓'}
								</button>
								<button
									onclick={(e) => {
										e.stopPropagation();
										services.project.removeLayer(i);
									}}
									class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
									title={__({ key: 'hud.actions.delete' })}
								>
									🗑️
								</button>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	<!-- Simplified Footer -->
	<div class="flex items-center justify-between border-t border-charcoal/5 bg-charcoal/5 px-4 py-2">
		<div class="flex items-center gap-3">
			<button
				onclick={() => {
					if (editor.studio.projectActiveTab === 'frames') services.project.addFrame();
					else services.project.addLayer();
				}}
				class="flex items-center gap-1 font-serif text-[9px] font-bold tracking-[0.1em] text-charcoal/40 uppercase hover:text-charcoal/80"
			>
				<span aria-hidden="true">＋</span>
				{editor.studio.projectActiveTab === 'frames'
					? __({ key: 'hud.actions.add_frame' })
					: __({ key: 'hud.actions.add_layer' })}
			</button>

			{#if editor.studio.projectActiveTab === 'layers'}
				<button
					onclick={() => services.project.addGroup()}
					class="flex items-center gap-1 font-serif text-[9px] font-bold tracking-[0.1em] text-charcoal/40 uppercase hover:text-charcoal/80"
				>
					<span aria-hidden="true">📁</span>
					Group
				</button>
			{/if}
		</div>
		<span class="font-mono text-[8px] font-bold text-charcoal/20 uppercase">
			{editor.studio.projectActiveTab === 'frames'
				? editor.project.frames.length
				: editor.project.activeFrame.layers.length}
		</span>
	</div>
</div>
