<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { services } from '../../../engine/services.js';
	import type { LayerState } from '../../../state/layer.svelte.js';

	interface Props {
		layer: LayerState;
		index: number;
		isSelected: boolean;
		isActive: boolean;
		isEditing: boolean;
		isDropTarget: boolean;
		isDragged: boolean;
		tempName: string;
		activePropertiesType: 'layer' | 'frame' | null;
		activePropertiesIndex: number | null;
		onSelect: (index: number, event: MouseEvent) => void;
		onToggleProperties: (index: number, event: MouseEvent) => void;
		onStartRename: (index: number, name: string) => void;
		onCommitRename: () => void;
		onCancelRename: () => void;
		onDragStart: (index: number) => void;
		onDragOver: (e: DragEvent, index: number) => void;
		onDrop: (e: DragEvent, index: number) => void;
		onDragEnd: () => void;
		oncontextmenu: (e: MouseEvent) => void;
	}

	let {
		layer,
		index,
		isSelected,
		isActive,
		isEditing,
		isDropTarget,
		isDragged,
		tempName = $bindable(),
		activePropertiesType,
		activePropertiesIndex,
		onSelect,
		onToggleProperties,
		onStartRename,
		onCommitRename,
		onCancelRename,
		onDragStart,
		onDragOver,
		onDrop,
		onDragEnd,
		oncontextmenu
	}: Props = $props();

	let isChild = $derived(layer.parentId !== null);

	function focusInput(node: HTMLInputElement) {
		node.focus();
		node.select();
	}
</script>

<div
	role="button"
	tabindex="0"
	draggable="true"
	onclick={(e) => e.stopPropagation()}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') onSelect(index, e as any);
	}}
	ondragstart={() => onDragStart(index)}
	ondragover={(e) => onDragOver(e, index)}
	ondrop={(e) => onDrop(e, index)}
	ondragend={onDragEnd}
	{oncontextmenu}
	class="group flex cursor-grab items-center justify-between rounded px-2 transition-all {isSelected
		? 'bg-ui-accent/10 text-ui-accent ring-1 ring-ui-accent/20'
		: 'hover:bg-text-main/5'} {isActive ? 'bg-ui-accent/5 font-bold' : ''} {isDropTarget
		? 'shadow-[0_-2px_0_var(--color-ui-accent)]'
		: ''} {isDragged ? 'opacity-40' : ''}"
	style={isChild ? 'margin-left: 12px;' : ''}
	aria-current={isActive ? 'true' : undefined}
>
	<div class="flex flex-1 items-center gap-2 overflow-hidden">
		{#if layer.type === 'FOLDER'}
			<button
				onclick={(e) => {
					e.stopPropagation();
					layer.isCollapsed = !layer.isCollapsed;
				}}
				class="w-4 shrink-0 text-center text-[10px] opacity-40 hover:opacity-100"
			>
				{layer.isCollapsed ? '▶' : '▼'}
			</button>
		{:else}
			<div class="w-4 shrink-0"></div>
		{/if}
		<button
			onclick={(e) => {
				e.stopPropagation();
				services.project.toggleVisibility(index);
			}}
			class="text-xs transition-opacity {layer.isVisible ? 'opacity-100' : 'opacity-20'}"
			title={__('workspace:hud.project_panel.visibility')}
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
			class="flex-1 truncate py-2 text-left font-serif text-sm font-medium text-text-main {layer.isVisible
				? ''
				: 'opacity-40'}"
			onclick={(e) => onSelect(index, e)}
			ondblclick={() => onStartRename(index, layer.name)}
		>
			{#if isEditing}
				<input
					type="text"
					bind:value={tempName}
					class="w-full bg-ui-accent/5 font-serif text-sm font-medium text-ui-accent ring-1 ring-ui-accent/30 outline-none"
					onblur={onCommitRename}
					onkeydown={(e) => {
						e.stopPropagation();
						if (e.key === 'Enter') onCommitRename();
						if (e.key === 'Escape') onCancelRename();
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
			onclick={(e) => onToggleProperties(index, e)}
			class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-ui-accent"
			title={__('workspace:hud.project_panel.properties')}
		>
			{activePropertiesType === 'layer' && activePropertiesIndex === index ? '🔼' : '⚙️'}
		</button>
		<button
			onclick={(e) => {
				e.stopPropagation();
				services.project.toggleLock(index);
			}}
			class="text-[10px] transition-opacity {layer.isLocked ? 'opacity-100' : 'opacity-20'}"
			title={__('workspace:hud.project_panel.lock')}
		>
			{layer.isLocked ? '🔒' : '🔓'}
		</button>
		<button
			onclick={(e) => {
				e.stopPropagation();
				services.project.removeLayer(index);
			}}
			class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-ui-accent"
			title={__('workspace:hud.actions.delete')}
		>
			🗑️
		</button>
	</div>
</div>
