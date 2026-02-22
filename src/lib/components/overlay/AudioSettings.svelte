<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { fade, scale } from 'svelte/transition';
	import { untrack } from 'svelte';
	import Modal from '../ui/Modal.svelte';

	let { onClose = () => (editor.showAudioSettings = false) } = $props<{
		onClose: () => void;
	}>();
</script>

<Modal
	title="Sanctuary Harmony"
	subtitle="Tuning the Rural Atmosphere"
	icon="🎐"
	{onClose}
	width="450px"
>
	<div class="flex flex-col gap-8">
		<!-- Master Mute Toggle -->
		<div
			class="flex items-center justify-between rounded-xl border border-evergreen/5 bg-white/40 p-6 shadow-sm"
		>
			<div class="flex flex-col">
				<span class="font-serif text-sm font-bold tracking-tight text-evergreen/60 uppercase"
					>Master Mute</span
				>
				<span class="font-serif text-[10px] text-evergreen/40">Silence all sanctuary resonance</span
				>
			</div>
			<button
				class="editor-secondary-btn !px-6 !py-2 {editor.isMuted
					? 'bg-lantern-gold text-white'
					: ''}"
				onclick={() => editor.toggleMute()}
			>
				{editor.isMuted ? '🔇 Muted' : '🎐 Active'}
			</button>
		</div>

		<!-- Volume Sliders -->
		<div class="flex flex-col gap-6 rounded-xl border border-evergreen/5 bg-white/40 p-8">
			<!-- SFX Volume -->
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<span
						class="font-serif text-[10px] font-bold tracking-[0.2em] text-evergreen/40 uppercase"
						>Nature & Craft SFX</span
					>
					<span class="font-mono text-xs font-bold text-evergreen/40"
						>{Math.round(editor.sfxVolume * 100)}%</span
					>
				</div>
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					bind:value={editor.sfxVolume}
					class="editor-range w-full"
				/>
			</div>

			<!-- BGM Volume -->
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<span
						class="font-serif text-[10px] font-bold tracking-[0.2em] text-evergreen/40 uppercase"
						>Village Melodies (BGM)</span
					>
					<span class="font-mono text-xs font-bold text-evergreen/40"
						>{Math.round(editor.bgmVolume * 100)}%</span
					>
				</div>
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					bind:value={editor.bgmVolume}
					class="editor-range w-full"
				/>
			</div>
		</div>

		<!-- Ambient Status Info -->
		<div class="rounded-xl bg-evergreen/5 p-6">
			<h3 class="font-tiny5 mb-2 text-lg text-lantern-gold">Atmosphere Flow</h3>
			<div class="flex flex-col gap-2 font-serif text-[11px] leading-relaxed text-evergreen/60">
				<div class="flex justify-between">
					<span>Session Duration:</span>
					<span class="font-mono">{editor.usageMinutes} minutes</span>
				</div>
				<p class="text-evergreen/50 italic">
					{#if editor.usageMinutes < 30}
						The sanctuary awaits in silence. Village melodies will begin to play after 30 minutes of
						focus.
					{:else}
						The village has begun its song. Melodies will reach full resonance at 60 minutes.
					{/if}
				</p>
			</div>
		</div>

		<button class="editor-primary-btn w-full py-4" onclick={onClose}>Apply Settings</button>
	</div>
</Modal>

<style>
	.editor-range {
		appearance: none;
		height: 4px;
		background: var(--color-stone-path);
		border-radius: 10px;
		outline: none;
	}

	.editor-range::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		background: var(--color-lantern-gold);
		border: 3px solid white;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		transition: transform 0.1s ease;
	}
</style>
