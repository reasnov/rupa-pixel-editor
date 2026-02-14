<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
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
			if (atelier.studio.folioActiveTab === 'veils') {
				shuttle.folio.reorderVeil(draggedIndex, toIndex);
			} else {
				shuttle.folio.reorderFrame(draggedIndex, toIndex);
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
	class="flex w-full flex-col overflow-hidden rounded-xl border border-black/5 bg-canvas-bg/80 shadow-lg backdrop-blur-md"
	role="region"
	aria-label="Folio Ledger"
>
	<!-- Tab Switcher -->
	<div class="flex border-b border-black/5 bg-black/5 p-1" role="tablist">
		<button
			onclick={() => (atelier.studio.folioActiveTab = 'frames')}
			role="tab"
			aria-selected={atelier.studio.folioActiveTab === 'frames'}
			title={__({ key: 'shortcuts.labels.TAB_FRAMES' }) + ' (Alt+1)'}
			class="flex flex-1 items-center justify-center gap-2 py-2 text-[10px] font-bold tracking-widest uppercase transition-all {atelier
				.studio.folioActiveTab === 'frames'
				? 'rounded-xl bg-white text-brand shadow-sm'
				: 'opacity-40 hover:opacity-60'}"
		>
			<span aria-hidden="true">🖼️</span>
			{__({ key: 'hud.ledger.frames' })}
		</button>
		<button
			onclick={() => (atelier.studio.folioActiveTab = 'veils')}
			role="tab"
			aria-selected={atelier.studio.folioActiveTab === 'veils'}
			title={__({ key: 'shortcuts.labels.TAB_VEILS' }) + ' (Alt+2)'}
			class="flex flex-1 items-center justify-center gap-2 py-2 text-[10px] font-bold tracking-widest uppercase transition-all {atelier
				.studio.folioActiveTab === 'veils'
				? 'rounded-xl bg-white text-brand shadow-sm'
				: 'opacity-40 hover:opacity-60'}"
		>
			<span aria-hidden="true">🧵</span>
			{__({ key: 'hud.ledger.veils' })}
		</button>
	</div>

	<!-- Content -->
	<div class="custom-scrollbar max-h-[30vh] overflow-y-auto p-3">
		{#if atelier.studio.folioActiveTab === 'frames'}
			<div class="flex flex-col gap-1" transition:fade={{ duration: 150 }} role="list">
				{#each atelier.project.frames as frame, i}
					<div
						role="listitem"
						draggable="true"
						ondragstart={() => handleDragStart(i)}
						ondragover={(e) => handleDragOver(e, i)}
						ondrop={(e) => handleDrop(e, i)}
						ondragend={handleDragEnd}
						class="group flex cursor-grab items-center justify-between rounded-xl px-2 transition-all {i ===
						atelier.project.activeFrameIndex
							? 'bg-brand/10 text-brand ring-1 ring-brand/20'
							: 'hover:bg-black/5'} {dropTargetIndex === i && draggedIndex !== i
							? 'border-t-2 border-brand'
							: ''} {draggedIndex === i ? 'opacity-40' : ''}"
						aria-current={i === atelier.project.activeFrameIndex ? 'true' : undefined}
					>
						<button
							class="flex flex-1 items-center gap-3 overflow-hidden py-3 pl-2 text-left"
							onclick={() => (atelier.project.activeFrameIndex = i)}
						>
							<span class="text-xs opacity-40" aria-hidden="true">{i + 1}</span>
							<span class="truncate font-serif text-sm font-medium text-studio-text"
								>{frame.name}</span
							>
						</button>
						<div class="flex items-center gap-2 pr-2">
							<button
								onclick={(e) => {
									e.stopPropagation();
									shuttle.folio.duplicateFrame(i);
								}}
								class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
								title={__({ key: 'hud.actions.duplicate' }) + ' (Ctrl+D)'}
							>
								<span aria-hidden="true">📋</span>
							</button>
							{#if atelier.project.frames.length > 1}
								<button
									onclick={(e) => {
										e.stopPropagation();
										shuttle.folio.removeFrame(i);
									}}
									class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
									title={__({ key: 'hud.actions.delete' }) + ' (Alt+D)'}
								>
									<span aria-hidden="true">🗑️</span>
								</button>
							{/if}
							{#if i === atelier.project.activeFrameIndex}
								<div class="h-1.5 w-1.5 rounded-xl bg-brand" aria-hidden="true"></div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col gap-1" transition:fade={{ duration: 150 }} role="list">
				{#each atelier.project.activeFrame.veils as veil, i}
					<div
						role="listitem"
						draggable="true"
						ondragstart={() => handleDragStart(i)}
						ondragover={(e) => handleDragOver(e, i)}
						ondrop={(e) => handleDrop(e, i)}
						ondragend={handleDragEnd}
						class="group flex cursor-grab items-center justify-between rounded-xl px-2 transition-all {i ===
						atelier.project.activeFrame.activeVeilIndex
							? 'bg-brand/10 text-brand ring-1 ring-brand/20'
							: 'hover:bg-black/5'} {dropTargetIndex === i && draggedIndex !== i
							? 'border-t-2 border-brand'
							: ''} {draggedIndex === i ? 'opacity-40' : ''}"
						aria-current={i === atelier.project.activeFrame.activeVeilIndex ? 'true' : undefined}
					>
						<div class="flex flex-1 items-center gap-3 overflow-hidden">
							<button
								onclick={(e) => {
									e.stopPropagation();
									shuttle.folio.toggleVisibility(i);
								}}
								class="ml-2 text-xs transition-opacity {veil.isVisible
									? 'opacity-100'
									: 'opacity-20'}"
								title={__({ key: 'hud.ledger.visibility' })}
							>
								<span aria-hidden="true">{veil.isVisible ? '👁️' : '🕶️'}</span>
							</button>
							<button
								class="flex-1 truncate py-3 text-left font-serif text-sm font-medium text-studio-text {veil.isVisible
									? ''
									: 'opacity-40'}"
								onclick={() => (atelier.project.activeFrame.activeVeilIndex = i)}
							>
								{veil.name}
							</button>
						</div>
						<div class="flex items-center gap-2 pr-2">
							<button
								onclick={(e) => {
									e.stopPropagation();
									shuttle.folio.toggleLock(i);
								}}
								class="text-[10px] transition-opacity {veil.isLocked
									? 'opacity-100'
									: 'opacity-20'}"
								title={__({ key: 'hud.ledger.lock' })}
							>
								<span aria-hidden="true">{veil.isLocked ? '🔒' : '🔓'}</span>
							</button>
							<button
								onclick={(e) => {
									e.stopPropagation();
									shuttle.folio.duplicateVeil(i);
								}}
								class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
								title={__({ key: 'hud.actions.duplicate' }) + ' (Ctrl+D)'}
							>
								<span aria-hidden="true">📋</span>
							</button>
							{#if atelier.project.activeFrame.veils.length > 1}
								<button
									onclick={(e) => {
										e.stopPropagation();
										shuttle.folio.removeVeil(i);
									}}
									class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
									title={__({ key: 'hud.actions.delete' }) + ' (Alt+D)'}
								>
									<span aria-hidden="true">🗑️</span>
								</button>
							{/if}
							{#if i === atelier.project.activeFrame.activeVeilIndex}
								<div class="h-1.5 w-1.5 rounded-xl bg-brand" aria-hidden="true"></div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Footer Info -->
	<div class="flex items-center justify-between bg-black/5 px-5 py-2">
		<button
			onclick={() => {
				if (atelier.studio.folioActiveTab === 'frames') shuttle.folio.addFrame();
				else shuttle.folio.addVeil();
			}}
			class="flex items-center gap-1 font-serif text-[8px] font-bold tracking-[0.2em] text-studio-text/30 uppercase hover:text-studio-text/60"
		>
			<span aria-hidden="true">＋</span>
			{atelier.studio.folioActiveTab === 'frames'
				? __({ key: 'hud.actions.add_frame' })
				: __({ key: 'hud.actions.add_veil' })}
		</button>
		<span class="font-serif text-[8px] font-bold tracking-[0.2em] text-studio-text/30 uppercase">
			{atelier.studio.folioActiveTab === 'frames'
				? atelier.project.frames.length + ' ' + __({ key: 'hud.ledger.frames' })
				: atelier.project.activeFrame.veils.length + ' ' + __({ key: 'hud.ledger.veils' })}
		</span>
	</div>
</div>
