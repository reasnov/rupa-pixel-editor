<script lang="ts">
	import { loompad } from '../../engine/loompad.svelte';
	import { stance } from '../../engine/stance.svelte';
	import { atelier } from '../../state/atelier.svelte';
	import { fade } from 'svelte/transition';
</script>

<div class="pointer-events-none fixed bottom-0 left-0 z-[1000] w-full">
	<div class="flex h-7 w-full items-center justify-between border-t border-brand/20 bg-white/90 px-6 shadow-2xl backdrop-blur-md">
		<div class="flex items-center gap-6">
			<!-- Section: Chord Ledger -->
			<div class="flex items-center gap-2">
				<span class="font-serif text-[8px] font-black tracking-widest uppercase text-brand/40 italic">Chord:</span>
				<div class="flex min-w-[120px] gap-1.5">
					{#if loompad.activeKeys.length > 0}
						{#each loompad.activeKeys as key}
							<span class="rounded bg-brand/10 px-1.5 py-0.5 font-mono text-[9px] font-black uppercase text-brand">
								{key === ' ' ? 'Space' : key}
							</span>
						{/each}
					{:else}
						<span class="font-mono text-[9px] opacity-20 italic">None</span>
					{/if}
				</div>
			</div>

			<div class="h-3 w-px bg-brand/10"></div>

			<!-- Section: Intent/Stance -->
			<div class="flex items-center gap-2">
				<span class="font-serif text-[8px] font-black tracking-widest uppercase text-brand/40 italic">Stance:</span>
				<span class="font-mono text-[9px] font-bold uppercase text-brand">
					{stance.current.type}
				</span>
			</div>
		</div>

		<!-- Section: Metadata & Safety -->
		<div class="flex items-center gap-4 opacity-40">
			{#if atelier.lastSaved}
				<div transition:fade class="flex items-center gap-1.5">
					<span class="text-[10px]">💾</span>
					<span class="font-mono text-[8px] font-bold uppercase tracking-tighter text-brand">
						Backed up: {atelier.lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
					</span>
				</div>
				<div class="h-3 w-px bg-brand/20"></div>
			{/if}

			<div class="flex gap-3 font-mono text-[8px] font-bold uppercase tracking-tighter">
				<span>Pos: {atelier.needlePos.x},{atelier.needlePos.y}</span>
				<span>Size: {atelier.linenWidth}x{atelier.linenHeight}</span>
				<span>Zoom: {Math.round(atelier.zoomLevel * 100)}%</span>
			</div>
			<div class="h-3 w-px bg-brand/20"></div>
			<span class="font-mono text-[9px] font-black tracking-widest uppercase text-brand/60">
				Technical Ledger
			</span>
		</div>
	</div>
</div>
