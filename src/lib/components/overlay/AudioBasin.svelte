<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { fade, scale } from 'svelte/transition';
	import { untrack } from 'svelte';
	import Modal from '../ui/Modal.svelte';

	let { onClose = () => (atelier.studio.showAudioBasin = false) } = $props<{
		onClose: () => void;
	}>();
</script>

<Modal title="Audio Basin" subtitle="Harmony & Atmosphere Tuning" icon="🔊" {onClose} width="450px">
	<div class="flex flex-col gap-8">
		<!-- Master Mute Toggle -->
		<div
			class="flex items-center justify-between rounded-xl border border-black/5 bg-white/40 p-6 shadow-sm"
		>
			<div class="flex flex-col">
				<span class="font-serif text-sm font-bold tracking-tight uppercase opacity-60"
					>Master Mute</span
				>
				<span class="font-serif text-[10px] opacity-40">Silence all studio resonance</span>
			</div>
			<button
				class="artisan-secondary-btn !px-6 !py-2 {atelier.isMuted ? 'bg-brand text-white' : ''}"
				onclick={() => atelier.toggleMute()}
			>
				{atelier.isMuted ? '🔇 Muted' : '🔊 Active'}
			</button>
		</div>

		<!-- Volume Sliders -->
		<div class="flex flex-col gap-6 rounded-xl border border-black/5 bg-white/40 p-8">
			<!-- SFX Volume -->
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<span class="font-serif text-[10px] font-bold tracking-[0.2em] uppercase opacity-40"
						>Stitch Resonance (SFX)</span
					>
					<span class="font-mono text-xs font-bold opacity-40"
						>{Math.round(atelier.sfxVolume * 100)}%</span
					>
				</div>
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					bind:value={atelier.sfxVolume}
					class="artisan-range w-full"
				/>
			</div>

			<!-- BGM Volume -->
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<span class="font-serif text-[10px] font-bold tracking-[0.2em] uppercase opacity-40"
						>Ambient Piano (BGM)</span
					>
					<span class="font-mono text-xs font-bold opacity-40"
						>{Math.round(atelier.bgmVolume * 100)}%</span
					>
				</div>
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					bind:value={atelier.bgmVolume}
					class="artisan-range w-full"
				/>
			</div>
		</div>

		<!-- Ambient Status Info -->
		<div class="rounded-xl bg-black/5 p-6">
			<h3 class="font-tiny5 mb-2 text-lg text-brand">Atmosphere Protocol</h3>
			<div class="flex flex-col gap-2 font-serif text-[11px] leading-relaxed opacity-60">
				<div class="flex justify-between">
					<span>Session Duration:</span>
					<span class="font-mono">{atelier.usageMinutes} minutes</span>
				</div>
				<p class="italic">
					{#if atelier.usageMinutes < 30}
						The piano awaits in silence. It will begin to weave its melody after 30 minutes of
						artisanry.
					{:else}
						The piano has begun its weave. Volume will reach full depth at 60 minutes.
					{/if}
				</p>
			</div>
		</div>

		<button class="artisan-primary-btn w-full py-4" onclick={onClose}>Seal Settings</button>
	</div>
</Modal>

<style>
	.artisan-range {
		appearance: none;
		height: 4px;
		background: #eee8d5;
		border-radius: 10px;
		outline: none;
	}

	.artisan-range::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		background: #d33682;
		border: 3px solid white;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		transition: transform 0.1s ease;
	}

	.artisan-range::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}
</style>
