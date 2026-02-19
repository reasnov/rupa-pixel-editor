<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import { fade } from 'svelte/transition';
	import PropertiesPanel from './layering/PropertiesPanel.svelte';

	let draggedIndex = $state<number | null>(null);
	let dropTargetIndex = $state<number | null>(null);

	// Renaming State
	let editingIndex = $state<number | null>(null);
	let tempName = $state('');

	// Properties Menu State
	let activePropertiesType = $state<'layer' | 'frame' | null>(null);
	let activePropertiesIndex = $state<number | null>(null);

	function toggleProperties(type: 'layer' | 'frame', index: number, event: MouseEvent) {
		event.stopPropagation();
		if (activePropertiesType === type && activePropertiesIndex === index) {
			activePropertiesType = null;
			activePropertiesIndex = null;
		} else {
			activePropertiesType = type;
			activePropertiesIndex = index;
		}
	}

	function startRenaming(index: number, currentName: string) {
		editingIndex = index;
		tempName = currentName;
	}

	function focusInput(node: HTMLInputElement) {
		node.focus();
		node.select();
	}

	function commitRename() {
		if (editingIndex === null) return;
		if (editor.studio.projectActiveTab === 'layers') {
			editor.project.activeFrame.layers[editingIndex].name = tempName;
		} else {
			editor.project.frames[editingIndex].name = tempName;
		}
		editingIndex = null;
	}

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

	function resetSelections() {
		const project = editor.project;
		project.selectedFrameIndices = new Set([project.activeFrameIndex]);

		const frame = project.activeFrame;
		frame.selectedLayerIndices = new Set([frame.activeLayerIndex]);
	}

	function selectFrame(index: number, event: MouseEvent) {
		const project = editor.project;
		if (event.ctrlKey || event.metaKey) {
			if (project.selectedFrameIndices.has(index) && project.selectedFrameIndices.size > 1) {
				project.selectedFrameIndices.delete(index);
			} else {
				project.selectedFrameIndices.add(index);
			}
		} else if (event.shiftKey) {
			const start = Math.min(project.activeFrameIndex, index);
			const end = Math.max(project.activeFrameIndex, index);
			const nextSet = new Set<number>();
			for (let i = start; i <= end; i++) nextSet.add(i);
			project.selectedFrameIndices = nextSet;
		} else {
			project.selectedFrameIndices = new Set([index]);
		}
		project.activeFrameIndex = index;
	}

	function selectLayer(index: number, event: MouseEvent) {
		const frame = editor.project.activeFrame;
		if (event.ctrlKey || event.metaKey) {
			if (frame.selectedLayerIndices.has(index) && frame.selectedLayerIndices.size > 1) {
				frame.selectedLayerIndices.delete(index);
			} else {
				frame.selectedLayerIndices.add(index);
			}
		} else if (event.shiftKey) {
			const start = Math.min(frame.activeLayerIndex, index);
			const end = Math.max(frame.activeLayerIndex, index);
			const nextSet = new Set<number>();
			for (let i = start; i <= end; i++) nextSet.add(i);
			frame.selectedLayerIndices = nextSet;
		} else {
			frame.selectedLayerIndices = new Set([index]);
		}
		frame.activeLayerIndex = index;
	}

	function handleFrameContextMenu(e: MouseEvent, index: number) {
		e.preventDefault();
		const project = editor.project;
		if (!project.selectedFrameIndices.has(index)) {
			project.selectedFrameIndices = new Set([index]);
			project.activeFrameIndex = index;
		}

		const isMulti = project.selectedFrameIndices.size > 1;

		editor.studio.contextMenu = {
			x: e.clientX,
			y: e.clientY,
			items: [
				{
					label: isMulti
						? `Duplicate ${project.selectedFrameIndices.size} Cups`
						: __({ key: 'hud.actions.duplicate' }),
					icon: '📋',
					action: () => {
						// Logic for multi-duplicate if needed
						services.project.duplicateFrame(index);
					}
				},
				{
					label: isMulti
						? `Spill ${project.selectedFrameIndices.size} Cups`
						: __({ key: 'hud.actions.delete' }),
					icon: '🗑️',
					danger: true,
					disabled: project.frames.length <= project.selectedFrameIndices.size,
					action: () => {
						const indices = Array.from(project.selectedFrameIndices).sort((a, b) => b - a);
						indices.forEach((idx) => services.project.removeFrame(idx));
						project.selectedFrameIndices = new Set([project.activeFrameIndex]);
					}
				}
			]
		};
	}

	function handleLayerContextMenu(e: MouseEvent, index: number) {
		const frame = editor.project.activeFrame;
		e.preventDefault();

		if (!frame.selectedLayerIndices.has(index)) {
			frame.selectedLayerIndices = new Set([index]);
			frame.activeLayerIndex = index;
		}

		const isMulti = frame.selectedLayerIndices.size > 1;
		const layer = frame.layers[index];

		editor.studio.contextMenu = {
			x: e.clientX,
			y: e.clientY,
			items: [
				{
					label: isMulti ? 'Group Selected' : 'Group',
					icon: '📁',
					action: () => {
						const group = services.project.addGroup();
						if (isMulti) {
							const selected = Array.from(frame.selectedLayerIndices);
							selected.forEach((idx) => {
								const l = frame.layers[idx];
								if (l !== group) l.parentId = group.id;
							});
						} else {
							layer.parentId = group.id;
						}
					}
				},
				{
					label: isMulti
						? `Duplicate ${frame.selectedLayerIndices.size} Infusions`
						: __({ key: 'hud.actions.duplicate' }),
					icon: '📋',
					disabled: isMulti, // Keep it simple for now
					action: () => services.project.duplicateLayer(index)
				},
				{
					label: isMulti
						? 'Show/Hide Selected'
						: layer.isVisible
							? 'Hide Infusion'
							: 'Show Infusion',
					icon: layer.isVisible ? '🕶️' : '👁️',
					action: () => {
						const indices = Array.from(frame.selectedLayerIndices);
						const targetState = isMulti ? !layer.isVisible : !layer.isVisible;
						indices.forEach((idx) => (frame.layers[idx].isVisible = targetState));
						editor.canvas.triggerPulse();
					}
				},
				{
					label: isMulti
						? 'Seal/Unseal Selected'
						: layer.isLocked
							? 'Unlock Infusion'
							: 'Lock Infusion',
					icon: layer.isLocked ? '🔓' : '🔒',
					action: () => {
						const indices = Array.from(frame.selectedLayerIndices);
						indices.forEach((idx) => services.project.toggleLock(idx));
					}
				},
				{
					label: __({ key: 'hud.actions.delete' }),
					icon: '🗑️',
					danger: true,
					disabled: frame.layers.length <= frame.selectedLayerIndices.size,
					action: () => {
						const indices = Array.from(frame.selectedLayerIndices).sort((a, b) => b - a);
						indices.forEach((idx) => services.project.removeLayer(idx));
						frame.selectedLayerIndices = new Set([frame.activeLayerIndex]);
					}
				}
			]
		};
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
	<div
		class="custom-scrollbar flex-1 overflow-y-auto p-2"
		onclick={resetSelections}
		onkeydown={(e) => {
			if (e.key === 'Escape') resetSelections();
		}}
		role="presentation"
	>
		{#if editor.studio.projectActiveTab === 'frames'}
			<div class="flex flex-col gap-1" transition:fade={{ duration: 150 }} role="list">
				{#each editor.project.frames as frame, i}
					<div
						role="button"
						tabindex="0"
						draggable="true"
						onclick={(e) => e.stopPropagation()}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') selectFrame(i, e as any);
						}}
						ondragstart={() => handleDragStart(i)}
						ondragover={(e) => handleDragOver(e, i)}
						ondrop={(e) => handleDrop(e, i)}
						ondragend={handleDragEnd}
						oncontextmenu={(e) => handleFrameContextMenu(e, i)}
						class="group flex cursor-grab items-center justify-between rounded px-2 transition-all {editor.project.selectedFrameIndices.has(
							i
						)
							? 'bg-brand/10 text-brand ring-1 ring-brand/20'
							: 'hover:bg-charcoal/5'} {i === editor.project.activeFrameIndex
							? 'bg-brand/5 font-bold'
							: ''} {dropTargetIndex === i && draggedIndex !== i
							? 'shadow-[0_-2px_0_var(--color-brand)]'
							: ''} {draggedIndex === i ? 'opacity-40' : ''}"
						aria-current={i === editor.project.activeFrameIndex ? 'true' : undefined}
					>
						<button
							class="flex flex-1 items-center gap-3 overflow-hidden py-2 pl-1 text-left"
							onclick={(e) => selectFrame(i, e)}
							ondblclick={() => startRenaming(i, frame.name)}
						>
							<span class="font-mono text-[10px] opacity-30" aria-hidden="true">{i + 1}</span>
							{#if editingIndex === i && editor.studio.projectActiveTab === 'frames'}
								<input
									type="text"
									bind:value={tempName}
									class="w-full bg-brand/5 font-serif text-sm font-medium text-brand ring-1 ring-brand/30 outline-none"
									onblur={commitRename}
									onkeydown={(e) => {
										if (e.key === 'Enter') commitRename();
										if (e.key === 'Escape') editingIndex = null;
									}}
									use:focusInput
								/>
							{:else}
								<span class="truncate font-serif text-sm font-medium text-charcoal"
									>{frame.name}</span
								>
							{/if}
						</button>
						<div class="flex items-center gap-2">
							<button
								onclick={(e) => toggleProperties('frame', i, e)}
								class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
								title="Cup Properties"
							>
								{activePropertiesType === 'frame' && activePropertiesIndex === i ? '🔼' : '⚙️'}
							</button>
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

					<!-- Frame Properties Accordion -->
					{#if activePropertiesType === 'frame' && activePropertiesIndex === i}
						<PropertiesPanel target={frame} margin="24px" />
					{/if}
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
							role="button"
							tabindex="0"
							draggable="true"
							onclick={(e) => e.stopPropagation()}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') selectLayer(i, e as any);
							}}
							ondragstart={() => handleDragStart(i)}
							ondragover={(e) => handleDragOver(e, i)}
							ondrop={(e) => handleDrop(e, i)}
							ondragend={handleDragEnd}
							oncontextmenu={(e) => handleLayerContextMenu(e, i)}
							class="group flex cursor-grab items-center justify-between rounded px-2 transition-all {editor.project.activeFrame.selectedLayerIndices.has(
								i
							)
								? 'bg-brand/10 text-brand ring-1 ring-brand/20'
								: 'hover:bg-charcoal/5'} {i === editor.project.activeFrame.activeLayerIndex
								? 'bg-brand/5 font-bold'
								: ''} {dropTargetIndex === i && draggedIndex !== i
								? 'shadow-[0_-2px_0_var(--color-brand)]'
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
									onclick={(e) => selectLayer(i, e)}
									ondblclick={() => startRenaming(i, layer.name)}
								>
									{#if editingIndex === i && editor.studio.projectActiveTab === 'layers'}
										<input
											type="text"
											bind:value={tempName}
											class="w-full bg-brand/5 font-serif text-sm font-medium text-brand ring-1 ring-brand/30 outline-none"
											onblur={commitRename}
											onkeydown={(e) => {
												if (e.key === 'Enter') commitRename();
												if (e.key === 'Escape') editingIndex = null;
											}}
											use:focusInput
										/>
									{:else}
										{layer.name}
									{/if}
								</button>
							</div>
																					<div class="flex items-center gap-2">
																						<button
																							onclick={(e) => toggleProperties('layer', i, e)}
																							class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
																							title="Infusion Properties"
																						>
																							{activePropertiesType === 'layer' && activePropertiesIndex === i
																								? '🔼'
																								: '⚙️'}
																						</button>
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
							
																																	<!-- Layer Properties Accordion -->
																																	{#if activePropertiesType === 'layer' && activePropertiesIndex === i}
																																		<PropertiesPanel
																																			target={layer}
																																			margin={isChild ? '24px' : '12px'}
																																		/>
																																	{/if}
																																{/if}				{/each}
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
