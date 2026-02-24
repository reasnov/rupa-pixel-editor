<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../../state/editor.svelte.js';
	import { services } from '../../../engine/services.js';
	import { sfx } from '../../../engine/audio.js';
	import type { FrameState } from '../../../state/frame.svelte.js';

	interface Props {
		frame: FrameState;
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
		frame,
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
	aria-current={isActive ? 'true' : undefined}
>
	<div class="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
		<span
			class="w-4 shrink-0 text-center font-mono text-[9px] font-bold opacity-20"
			aria-hidden="true">{index + 1}</span
		>
		<button
			onclick={(e) => {
				e.stopPropagation();
				services.project.toggleFrameVisibility(index);
			}}
			class="shrink-0 text-xs transition-opacity {frame.isVisible ? 'opacity-100' : 'opacity-20'}"
			title={frame.isVisible
				? __('workspace:hud.project_panel.active')
				: __('workspace:hud.project_panel.visibility')}
		>
			{frame.isVisible ? '👁️' : '🕶️'}
		</button>
		<button
			class="min-w-0 flex-1 truncate py-2 text-left font-serif text-sm font-medium text-text-main {frame.isVisible
				? ''
				: 'opacity-40'}"
			onclick={(e) => onSelect(index, e)}
			ondblclick={() => onStartRename(index, frame.name)}
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
				{frame.name}
			{/if}
		</button>
	</div>
	<div class="flex shrink-0 items-center gap-1.5 pl-2">
		<button
			onclick={(e) => onToggleProperties(index, e)}
			class="shrink-0 text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-ui-accent"
			title={__('workspace:hud.project_panel.properties')}
		>
			{activePropertiesType === 'frame' && activePropertiesIndex === index ? '🔼' : '⚙️'}
		</button>
		<button
			onclick={(e) => {
				e.stopPropagation();
				services.project.duplicateFrame(index);
			}}
			class="shrink-0 text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-ui-accent"
			title={__('workspace:hud.actions.duplicate')}
		>
			📋
		</button>
		{#if editor.project.frames.length > 1}
			<button
				onclick={(e) => {
					e.stopPropagation();
					services.project.removeFrame(index);
				}}
				class="shrink-0 text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-ui-accent"
				title={__('workspace:hud.actions.delete')}
			>
				🗑️
			</button>
		{/if}
	</div>
</div>
