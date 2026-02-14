<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import Brand from './Brand.svelte';
	import { resonance } from '../../engine/resonance.svelte.js';
	import { onMount } from 'svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import icon from '../../assets/rupa-icon.png';

	let visible = $state(true);
	let progress = $state(0);
	let phaseIndex = $state(0);
	let isReadyToEnter = $state(false);

	// Get phases from i18n system
	// Note: __ returns a string, but i18next can return objects/arrays if requested.
	// For simplicity, we'll fetch them individually or use the JSON as a fallback structure.
	const phasesCount = 5;

	/**
	 * startStudio: Finalizes the loading sequence and enters the atelier.
	 */
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
		// We use a variable interval to simulate the organic nature of craft.
		const interval = setInterval(() => {
			if (progress < 100) {
				const jump = Math.random() * 15;
				progress = Math.min(100, progress + jump);

				// Update phase based on progress
				phaseIndex = Math.min(phasesCount - 1, Math.floor((progress / 100) * phasesCount));
			} else {
				clearInterval(interval);
				setTimeout(() => {
					isReadyToEnter = true;
					startStudio();
				}, 600);
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
		class="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-canvas-bg"
		style="background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png');"
		role="dialog"
		aria-modal="true"
		aria-busy={!isReadyToEnter}
		aria-label={__({ key: 'codex.title' })}
	>
		<!-- Background Glow -->
		<div
			class="absolute h-[500px] w-[500px] animate-pulse rounded-full bg-brand/5 blur-[120px]"
			aria-hidden="true"
		></div>

		<div class="relative flex flex-col items-center gap-2">
			<!-- Logo Animation -->
			<div
				in:scale={{ duration: 1500, start: 0.9, easing: quintOut }}
				class="mb-8 flex animate-bounce items-center justify-center"
			>
				<img
					src={icon}
					alt="Rupa Artisan Icon"
					class="h-32 w-auto drop-shadow-2xl transition-transform duration-[3s] ease-in-out"
					style="transform: scale({1 + Math.sin(Date.now() / 1000) * 0.05});"
				/>
			</div>

			<div in:fly={{ y: 20, duration: 1000, delay: 400 }}>
				<Brand size="lg" />
			</div>
		</div>

		<div class="absolute bottom-24 flex flex-col items-center gap-8">
			<!-- Loading Bar -->
			<div class="flex flex-col items-center gap-4">
				<div
					class="h-1.5 w-64 overflow-hidden rounded-full bg-studio-text/5 ring-1 ring-studio-text/10"
					role="progressbar"
					aria-valuenow={progress}
					aria-valuemin="0"
					aria-valuemax="100"
				>
					<div
						class="h-full bg-brand/60 transition-all duration-500 ease-out {isReadyToEnter
							? 'opacity-0'
							: ''}"
						style="width: {progress}%"
					></div>
				</div>
				<div class="flex flex-col items-center gap-1 text-center">
					<span class="h-4 font-serif text-[12px] text-studio-text/60 italic">
						{isReadyToEnter
							? __({ key: 'common:splash.welcome' })
							: __({ key: `common:splash.phases.${phaseIndex}` })}
					</span>
					<span
						class="font-mono text-[9px] font-bold tracking-widest text-studio-text/20 uppercase"
					>
						{__({ key: 'common:splash.version', replace: { version: atelier.version } })}
					</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
</style>
