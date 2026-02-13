<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { resonance } from '../../engine/resonance.svelte.js';
	import onboarding from '../../config/onboarding.json' with { type: 'json' };
	import { onMount } from 'svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import icon from '../../assets/rupa-icon.png';

	let visible = $state(true);
	let progress = $state(0);
	let phaseIndex = $state(0);
	let isReadyToEnter = $state(false);

	const phases = onboarding.splash.phases;

	function startStudio() {
		resonance.emit('READY');
		visible = false;
		setTimeout(() => {
			atelier.isAppReady = true;
			atelier.showArtisanCodex = true;
		}, 800);
	}

	onMount(() => {
		resonance.emit('STARTUP');

		// Simulated "Artisanal" Loading Sequence
		const interval = setInterval(() => {
			if (progress < 100) {
				progress += Math.random() * 15;
				if (progress > 100) progress = 100;

				// Update phase based on progress
				phaseIndex = Math.min(phases.length - 1, Math.floor((progress / 100) * phases.length));
			} else {
				clearInterval(interval);
				setTimeout(() => {
					isReadyToEnter = true;
					startStudio(); // Auto-close when ready
				}, 500);
			}
		}, 400);

		return () => {
			clearInterval(interval);
		};
	});
</script>

{#if visible}
	<div
		out:fade={{ duration: 1000 }}
		class="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#fdf6e3]"
		style="background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png');"
	>
		<!-- Background Glow -->
		<div
			class="absolute h-[500px] w-[500px] animate-pulse rounded-full bg-brand/5 blur-[120px]"
		></div>

		<div class="relative flex flex-col items-center gap-2">
			<!-- Logo Animation -->
			<div
				in:scale={{ duration: 1500, start: 0.9, easing: quintOut }}
				class="mb-8 flex items-center justify-center"
			>
				<img
					src={icon}
					alt="Rupa Icon"
					class="h-32 w-auto drop-shadow-2xl transition-transform duration-[3s] ease-in-out"
					style="transform: scale({1 + Math.sin(Date.now() / 1000) * 0.05});"
				/>
			</div>

			<div in:fly={{ y: 20, duration: 1000, delay: 400 }}>
				<h1 class="font-tiny5 text-7xl text-brand drop-shadow-sm">Rupa</h1>
				<p
					class="text-center font-serif text-[11px] font-bold tracking-[0.5em] uppercase opacity-40"
				>
					The Weaver's Studio
				</p>
			</div>
		</div>

		<div class="absolute bottom-24 flex flex-col items-center gap-8">
			<!-- Loading Bar -->
			<div class="flex flex-col items-center gap-4">
				<div class="h-1 w-64 overflow-hidden rounded-full bg-black/5 ring-1 ring-black/5">
					<div
						class="h-full bg-brand/60 transition-all duration-500 ease-out {isReadyToEnter
							? 'opacity-0'
							: ''}"
						style="width: {progress}%"
					></div>
				</div>
				<div class="flex flex-col items-center gap-1">
					<span class="h-4 font-serif text-[11px] italic opacity-50"
						>{isReadyToEnter ? 'Welcome home, artisan.' : phases[phaseIndex]}</span
					>
					<span class="font-mono text-[9px] font-bold tracking-widest uppercase opacity-20"
						>Version {atelier.version}</span
					>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom animations if needed */
</style>
