<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import Brand from './Brand.svelte';
	import { feedback } from '../../engine/feedback.svelte.js';
	import { onMount } from 'svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import icon from '../../assets/rupa-icon.png';

	let visible = $state(true);
	let progress = $state(0);
	let phaseIndex = $state(0);
	let isReadyToEnter = $state(false);

	const PHASES_COUNT = 5;

	/**
	 * initializeWorkspace: Finalizes the loading sequence and enters the café.
	 */
	function initializeWorkspace() {
		feedback.emit('READY');
		visible = false;
		setTimeout(() => {
			editor.isAppReady = true;
			editor.showManual = true;
		}, 800);
	}

	onMount(() => {
		feedback.emit('STARTUP');

		// Simulated "Natural" Loading Sequence
		const interval = setInterval(() => {
			if (progress < 100) {
				const jump = Math.random() * 15;
				progress = Math.min(100, progress + jump);

				// Update phase based on progress
				phaseIndex = Math.min(PHASES_COUNT - 1, Math.floor((progress / 100) * PHASES_COUNT));
			} else {
				clearInterval(interval);
				setTimeout(() => {
					isReadyToEnter = true;
					initializeWorkspace();
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
		role="dialog"
		aria-modal="true"
		aria-busy={!isReadyToEnter}
		aria-label={__('manual:title')}
	>
		<!-- Grain Texture Filter (GitHub Pages Compatible) -->
		<svg
			class="pointer-events-none absolute inset-0 h-full w-full opacity-[var(--grain-opacity,0.03)]"
		>
			<filter id="grain">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.65"
					numOctaves="3"
					stitchTiles="stitch"
				/>
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#grain)" />
		</svg>

		<!-- Minimalist Neutral Glow -->
		<div
			class="bg-hud-shadow/5 absolute h-[500px] w-[500px] animate-pulse rounded-full blur-[120px]"
			aria-hidden="true"
		></div>

		<div class="relative flex flex-col items-center gap-2">
			<!-- Restored Bouncing Logo Animation -->
			<div
				in:scale={{ duration: 1500, start: 0.9, easing: quintOut }}
				class="mb-8 flex animate-bounce items-center justify-center"
			>
				<img
					src={icon}
					alt={__('common:app.name')}
					class="h-32 w-auto drop-shadow-2xl transition-transform duration-[3s] ease-in-out"
					style="transform: scale({1 + Math.sin(Date.now() / 1500) * 0.05});"
				/>
			</div>

			<div in:fly={{ y: 15, duration: 1000, delay: 400, easing: quintOut }}>
				<Brand size="lg" />
			</div>
		</div>

		<div class="absolute bottom-24 flex flex-col items-center gap-8">
			<!-- Professional Neutral Progress Bar -->
			<div class="flex flex-col items-center gap-4">
				<div
					class="bg-hud-shadow/5 ring-hud-shadow/10 h-1 w-48 overflow-hidden rounded-full ring-1"
					role="progressbar"
					aria-valuenow={progress}
					aria-valuemin="0"
					aria-valuemax="100"
				>
					<div
						class="h-full bg-fern-green/40 transition-all duration-500 ease-out {isReadyToEnter
							? 'bg-ui-accent/60'
							: ''}"
						style="width: {progress}%"
					></div>
				</div>
				<div class="flex flex-col items-center gap-1 text-center">
					<span class="h-4 font-serif text-[11px] tracking-wide text-text-main/80 italic">
						{isReadyToEnter ? __('splash:welcome') : __(`splash:phases.${phaseIndex}`)}
					</span>
					<span class="font-mono text-[8px] font-bold tracking-[0.3em] text-text-main/40 uppercase">
						{__('splash:version', { replace: { version: editor.version } })}
					</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
</style>
