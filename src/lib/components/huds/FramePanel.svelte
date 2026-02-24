<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import { services } from '../../engine/services.js';
	import { sfx } from '../../engine/audio.js';
	import { fade } from 'svelte/transition';
	import PropertiesPanel from './layers/PropertiesPanel.svelte';
	import Button from '../elements/Button.svelte';
	import Tabs from '../elements/Tabs.svelte';
	import FrameItem from './layers/FrameItem.svelte';
	import LayerItem from './layers/LayerItem.svelte';

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
		sfx.playPaperFlip();
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
						? __('workspace:hud.context_menu.duplicate_frames', {
								replace: { count: project.selectedFrameIndices.size }
							})
						: __('workspace:hud.actions.duplicate'),
					icon: '📋',
					action: () => {
						services.project.duplicateFrame(index);
					}
				},
				...(isMulti
					? [
							{
								label: __('actions:merge_frames'),
								icon: '🍵',
								action: () => services.project.mergeFrames()
							}
						]
					: []),
				{
					label: __('workspace:hud.context_menu.add_flavor_tag'),
					icon: '🏷️',
					action: () => {
						const name = prompt('Tag Name:', 'New Sequence');
						if (name) {
							const indices = Array.from(project.selectedFrameIndices).sort((a, b) => a - b);
							services.project.addTag(name, indices[0], indices[indices.length - 1]);
						}
					}
				},
				{
					label: isMulti
						? __('workspace:hud.context_menu.delete_frames', {
								replace: { count: project.selectedFrameIndices.size }
							})
						: __('actions:delete_frame'),
					icon: '🗑️',
					danger: true,
					disabled: project.frames.length <= project.selectedFrameIndices.size,
					action: () => {
						const indices = Array.from(project.selectedFrameIndices).sort((a, b) => a - b);
						indices.reverse().forEach((idx) => services.project.removeFrame(idx));
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
					label: isMulti
						? __('workspace:hud.context_menu.group_selected')
						: __('workspace:hud.context_menu.group'),
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
						? __('workspace:hud.context_menu.duplicate_layers', {
								replace: { count: frame.selectedLayerIndices.size }
							})
						: __('workspace:hud.actions.duplicate'),
					icon: '📋',
					disabled: isMulti,
					action: () => services.project.duplicateLayer(index)
				},
				{
					label: isMulti ? __('actions:merge_selected_layers') : __('actions:merge_layers'),
					icon: '🎨',
					disabled: !isMulti && index === 0,
					action: () => {
						if (isMulti) services.project.mergeSelectedLayers();
						else services.project.mergeLayerDown();
					}
				},
				{
					label: isMulti
						? __('workspace:hud.context_menu.show_infusion')
						: layer.isVisible
							? __('workspace:hud.context_menu.hide_infusion')
							: __('workspace:hud.context_menu.show_infusion'),
					icon: layer.isVisible ? '🕶️' : '👁️',
					action: () => {
						const indices = Array.from(frame.selectedLayerIndices);
						const targetState = !layer.isVisible;
						indices.forEach((idx) => (frame.layers[idx].isVisible = targetState));
						editor.canvas.incrementVersion();
					}
				},
				{
					label: isMulti
						? __('workspace:hud.context_menu.lock_infusion')
						: layer.isLocked
							? __('workspace:hud.context_menu.unlock_infusion')
							: __('workspace:hud.context_menu.lock_infusion'),
					icon: layer.isLocked ? '🔓' : '🔒',
					action: () => {
						const indices = Array.from(frame.selectedLayerIndices);
						indices.forEach((idx) => services.project.toggleLock(idx));
					}
				},
				{
					label: __('actions:delete_layer'),
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

	const explorerTabs = [
		{ id: 'frames', label: 'workspace:hud.project_panel.frames' },
		{ id: 'layers', label: 'workspace:hud.project_panel.layers' }
	];
</script>

<div
	class="flex h-full w-full flex-col overflow-hidden bg-transparent"
	role="region"
	aria-label="Project Explorer"
>
	<Tabs
		tabs={explorerTabs}
		bind:activeTab={editor.studio.projectActiveTab}
		ariaLabel="ui:labels.project_tabs"
		onchange={() => {
			sfx.playPaperFlip();
		}}
	/>

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
					<FrameItem
						{frame}
						index={i}
						isSelected={editor.project.selectedFrameIndices.has(i)}
						isActive={i === editor.project.activeFrameIndex}
						isEditing={editingIndex === i}
						isDropTarget={dropTargetIndex === i && draggedIndex !== i}
						isDragged={draggedIndex === i}
						bind:tempName
						{activePropertiesType}
						{activePropertiesIndex}
						onSelect={selectFrame}
						onToggleProperties={(idx, e) => toggleProperties('frame', idx, e)}
						onStartRename={startRenaming}
						onCommitRename={commitRename}
						onCancelRename={() => (editingIndex = null)}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onDragEnd={handleDragEnd}
						oncontextmenu={(e) => handleFrameContextMenu(e, i)}
					/>

					{#if activePropertiesType === 'frame' && activePropertiesIndex === i}
						<PropertiesPanel target={frame} />
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
						<LayerItem
							{layer}
							index={i}
							isSelected={editor.project.activeFrame.selectedLayerIndices.has(i)}
							isActive={i === editor.project.activeFrame.activeLayerIndex}
							isEditing={editingIndex === i}
							isDropTarget={dropTargetIndex === i && draggedIndex !== i}
							isDragged={draggedIndex === i}
							bind:tempName
							{activePropertiesType}
							{activePropertiesIndex}
							onSelect={selectLayer}
							onToggleProperties={(idx, e) => toggleProperties('layer', idx, e)}
							onStartRename={startRenaming}
							onCommitRename={commitRename}
							onCancelRename={() => (editingIndex = null)}
							onDragStart={handleDragStart}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
							onDragEnd={handleDragEnd}
							oncontextmenu={(e) => handleLayerContextMenu(e, i)}
						/>

						{#if activePropertiesType === 'layer' && activePropertiesIndex === i}
							<PropertiesPanel target={layer} />
						{/if}
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	<!-- Simplified Footer -->
	<div
		class="flex items-center justify-between border-t border-text-main/5 bg-text-main/5 px-4 py-2"
	>
		<div class="flex items-center gap-3">
			<Button
				variant="ghost"
				size="sm"
				onclick={() => {
					if (editor.studio.projectActiveTab === 'frames') services.project.addFrame();
					else services.project.addLayer();
				}}
				ariaLabel={editor.studio.projectActiveTab === 'frames'
					? 'actions:new_frame'
					: 'actions:new_layer'}
				class="!p-0 text-[9px] font-bold tracking-[0.1em] text-text-main/40 uppercase hover:text-text-main/80"
			>
				<span aria-hidden="true">＋</span>
				{editor.studio.projectActiveTab === 'frames'
					? __('actions:new_frame')
					: __('actions:new_layer')}
			</Button>

			{#if editor.studio.projectActiveTab === 'layers'}
				<Button
					variant="ghost"
					size="sm"
					onclick={() => services.project.addGroup()}
					ariaLabel="actions:new_layer_group"
					class="!p-0 text-[9px] font-bold tracking-[0.1em] text-text-main/40 uppercase hover:text-text-main/80"
				>
					<span aria-hidden="true">📁</span>
					{__('actions:new_layer_group')}
				</Button>
			{/if}
		</div>
		<span class="font-mono text-[8px] font-bold text-text-main/20 uppercase">
			{editor.studio.projectActiveTab === 'frames'
				? editor.project.frames.length
				: editor.project.activeFrame.layers.length}
		</span>
	</div>
</div>
