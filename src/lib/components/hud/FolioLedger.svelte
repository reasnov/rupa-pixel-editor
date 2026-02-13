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
	class="flex w-full flex-col overflow-hidden rounded-xl border border-black/5 bg-[#fdf6e3]/80 shadow-lg backdrop-blur-md"
>
	<!-- Tab Switcher -->
	<div class="flex border-b border-black/5 bg-black/5 p-1">
		<button
			onclick={() => (atelier.studio.folioActiveTab = 'frames')}
			class="flex flex-1 items-center justify-center gap-2 py-2 text-[10px] font-bold tracking-widest uppercase transition-all {atelier
				.studio.folioActiveTab === 'frames'
				? 'rounded-xl bg-white text-brand shadow-sm'
				: 'opacity-40 hover:opacity-60'}"
		>
			<span>🖼️</span> Frames
		</button>
		<button
			onclick={() => (atelier.studio.folioActiveTab = 'veils')}
			class="flex flex-1 items-center justify-center gap-2 py-2 text-[10px] font-bold tracking-widest uppercase transition-all {atelier
				.studio.folioActiveTab === 'veils'
				? 'rounded-xl bg-white text-brand shadow-sm'
				: 'opacity-40 hover:opacity-60'}"
		>
			<span>🧵</span> Veils
		</button>
	</div>

	<!-- Content -->
	<div class="custom-scrollbar max-h-[30vh] overflow-y-auto p-3">
		{#if atelier.studio.folioActiveTab === 'frames'}
			<div class="flex flex-col gap-1" transition:fade={{ duration: 150 }}>
				{#each atelier.project.frames as frame, i}
					<div
						role="button"
						tabindex="0"
						draggable="true"
						ondragstart={() => handleDragStart(i)}
						ondragover={(e) => handleDragOver(e, i)}
						ondrop={(e) => handleDrop(e, i)}
						ondragend={handleDragEnd}
						onclick={() => (atelier.project.activeFrameIndex = i)}
						onkeydown={(e) => e.key === 'Enter' && (atelier.project.activeFrameIndex = i)}
						class="group flex cursor-grab items-center justify-between rounded-xl px-4 py-3 transition-all {i ===
						atelier.project.activeFrameIndex
							? 'bg-brand/10 text-brand ring-1 ring-brand/20'
							: 'hover:bg-black/5'} {dropTargetIndex === i && draggedIndex !== i
							? 'border-t-2 border-brand'
							: ''} {draggedIndex === i ? 'opacity-40' : ''}"
					>
						<div class="flex items-center gap-3 overflow-hidden">
							<span class="text-xs opacity-40">{i + 1}</span>
							<span class="truncate font-serif text-sm font-medium">{frame.name}</span>
						</div>
						<div class="flex items-center gap-2">
							<button
								onclick={(e) => {
									e.stopPropagation();
									shuttle.folio.duplicateFrame(i);
								}}
								class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
								title="Duplicate Frame (Ctrl+D)"
							>
								📋
							</button>
							{#if atelier.project.frames.length > 1}
								<button
									onclick={(e) => {
										e.stopPropagation();
										shuttle.folio.removeFrame(i);
									}}
									class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
									title="Delete Frame (Alt+D)"
								>
									🗑️
								</button>
							{/if}
							{#if i === atelier.project.activeFrameIndex}
								<div class="h-1.5 w-1.5 rounded-xl bg-brand"></div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col gap-1" transition:fade={{ duration: 150 }}>
				{#each atelier.project.activeFrame.veils as veil, i}
					<div
						role="button"
						tabindex="0"
						draggable="true"
						ondragstart={() => handleDragStart(i)}
						ondragover={(e) => handleDragOver(e, i)}
						ondrop={(e) => handleDrop(e, i)}
						ondragend={handleDragEnd}
						onclick={() => (atelier.project.activeFrame.activeVeilIndex = i)}
						onkeydown={(e) =>
							e.key === 'Enter' && (atelier.project.activeFrame.activeVeilIndex = i)}
						class="group flex cursor-grab items-center justify-between rounded-xl px-4 py-3 transition-all {i ===
						atelier.project.activeFrame.activeVeilIndex
							? 'bg-brand/10 text-brand ring-1 ring-brand/20'
							: 'hover:bg-black/5'} {dropTargetIndex === i && draggedIndex !== i
							? 'border-t-2 border-brand'
							: ''} {draggedIndex === i ? 'opacity-40' : ''}"
					>
						<div class="flex items-center gap-3 overflow-hidden">
							<button
								onclick={(e) => {
									e.stopPropagation();
									shuttle.folio.toggleVisibility(i);
								}}
								class="text-xs transition-opacity {veil.isVisible ? 'opacity-100' : 'opacity-20'}"
							>
								{veil.isVisible ? '👁️' : '🕶️'}
							</button>
							<span
								class="truncate font-serif text-sm font-medium {veil.isVisible ? '' : 'opacity-40'}"
								>{veil.name}</span
							>
						</div>
						<div class="flex items-center gap-2">
							<button
								onclick={(e) => {
									e.stopPropagation();
									shuttle.folio.toggleLock(i);
								}}
								class="text-[10px] transition-opacity {veil.isLocked
									? 'opacity-100'
									: 'opacity-20'}"
							>
								{veil.isLocked ? '🔒' : '🔓'}
							</button>
							<button
								onclick={(e) => {
									e.stopPropagation();
									shuttle.folio.duplicateVeil(i);
								}}
								class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
								title="Duplicate Veil (Ctrl+D)"
							>
								📋
							</button>
							{#if atelier.project.activeFrame.veils.length > 1}
								<button
									onclick={(e) => {
										e.stopPropagation();
										shuttle.folio.removeVeil(i);
									}}
									class="text-[10px] opacity-0 transition-opacity group-hover:opacity-40 hover:text-brand"
									title="Delete Veil (Alt+D)"
								>
									🗑️
								</button>
							{/if}
							{#if i === atelier.project.activeFrame.activeVeilIndex}
								<div class="h-1.5 w-1.5 rounded-xl bg-brand"></div>
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
			class="flex items-center gap-1 font-serif text-[8px] font-bold tracking-[0.2em] uppercase opacity-30 hover:opacity-60"
		>
			<span>＋</span> Add {atelier.studio.folioActiveTab === 'frames' ? 'Frame' : 'Veil'}
		</button>
		<span class="font-serif text-[8px] font-bold tracking-[0.2em] uppercase opacity-30">
			{atelier.studio.folioActiveTab === 'frames'
				? atelier.project.frames.length + ' Frames'
				: atelier.project.activeFrame.veils.length + ' Veils'}
		</span>
	</div>
</div>
