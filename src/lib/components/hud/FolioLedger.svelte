<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { fade } from 'svelte/transition';

	let activeTab = $state<'frames' | 'veils'>('veils');
</script>

<div
	class="flex w-64 flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-[#fdf6e3]/80 shadow-lg backdrop-blur-md"
>
	<!-- Tab Switcher -->
	<div class="flex border-b border-black/5 bg-black/5 p-1">
		<button
			onclick={() => (activeTab = 'frames')}
			class="flex flex-1 items-center justify-center gap-2 py-2 text-[10px] font-bold tracking-widest uppercase transition-all {activeTab ===
			'frames'
				? 'rounded-xl bg-white text-brand shadow-sm'
				: 'opacity-40 hover:opacity-60'}"
		>
			<span>🖼️</span> Frames
		</button>
		<button
			onclick={() => (activeTab = 'veils')}
			class="flex flex-1 items-center justify-center gap-2 py-2 text-[10px] font-bold tracking-widest uppercase transition-all {activeTab ===
			'veils'
				? 'rounded-xl bg-white text-brand shadow-sm'
				: 'opacity-40 hover:opacity-60'}"
		>
			<span>🧵</span> Veils
		</button>
	</div>

	<!-- Content -->
	<div class="custom-scrollbar max-h-[30vh] overflow-y-auto p-3">
		{#if activeTab === 'frames'}
			<div class="flex flex-col gap-1" transition:fade={{ duration: 150 }}>
				{#each atelier.project.frames as frame, i}
					<div
						role="button"
						tabindex="0"
						onclick={() => (atelier.project.activeFrameIndex = i)}
						onkeydown={(e) => e.key === 'Enter' && (atelier.project.activeFrameIndex = i)}
						class="group flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-all {i ===
						atelier.project.activeFrameIndex
							? 'bg-brand/10 text-brand ring-1 ring-brand/20'
							: 'hover:bg-black/5'}"
					>
						<div class="flex items-center gap-3 overflow-hidden">
							<span class="text-xs opacity-40">{i + 1}</span>
							<span class="truncate font-serif text-sm font-medium">{frame.name}</span>
						</div>
						{#if i === atelier.project.activeFrameIndex}
							<div class="h-1.5 w-1.5 rounded-full bg-brand"></div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col gap-1" transition:fade={{ duration: 150 }}>
				{#each atelier.project.activeFrame.veils as veil, i}
					<div
						role="button"
						tabindex="0"
						onclick={() => (atelier.project.activeFrame.activeVeilIndex = i)}
						onkeydown={(e) => e.key === 'Enter' && (atelier.project.activeFrame.activeVeilIndex = i)}
						class="group flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-all {i ===
						atelier.project.activeFrame.activeVeilIndex
							? 'bg-brand/10 text-brand ring-1 ring-brand/20'
							: 'hover:bg-black/5'}"
					>
						<div class="flex items-center gap-3 overflow-hidden">
							<button
								onclick={(e) => {
									e.stopPropagation();
									veil.isVisible = !veil.isVisible;
								}}
								class="text-xs transition-opacity {veil.isVisible ? 'opacity-100' : 'opacity-20'}"
							>
								{veil.isVisible ? '👁️' : '🕶️'}
							</button>
							<span class="truncate font-serif text-sm font-medium {veil.isVisible ? '' : 'opacity-40'}">{veil.name}</span>
						</div>
						<div class="flex items-center gap-2">
							<button
								onclick={(e) => {
									e.stopPropagation();
									veil.isLocked = !veil.isLocked;
								}}
								class="text-[10px] transition-opacity {veil.isLocked ? 'opacity-100' : 'opacity-20'}"
							>
								{veil.isLocked ? '🔒' : '🔓'}
							</button>
							{#if i === atelier.project.activeFrame.activeVeilIndex}
								<div class="h-1.5 w-1.5 rounded-full bg-brand"></div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Footer Info -->
	<div class="flex items-center justify-between bg-black/5 px-5 py-2">
		<span class="font-serif text-[8px] font-bold tracking-[0.2em] uppercase opacity-30">
			{activeTab === 'frames' ? atelier.project.frames.length + ' Frames' : atelier.project.activeFrame.veils.length + ' Veils'}
		</span>
		<span class="font-serif text-[8px] font-bold tracking-[0.2em] uppercase opacity-30">
			Alt+N to add
		</span>
	</div>
</div>
