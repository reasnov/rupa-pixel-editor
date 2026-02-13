<script lang="ts">
	import { atelier } from '../../state/atelier.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import icon from '../../assets/rupa-icon.png';

	let visible = $state(true);

	onMount(() => {
		const timer = setTimeout(() => {
			visible = false;
			setTimeout(() => {
				atelier.isAppReady = true;
				atelier.showArtisanCodex = true;
			}, 800);
		}, 2000);
		return () => clearTimeout(timer);
	});
</script>

{#if visible}
	<div
		out:fade={{ duration: 800 }}
		class="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#fdf6e3]"
		style="background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png');"
	>
		<div class="flex flex-col items-center gap-2">
			<div class="mb-6 flex animate-bounce items-center justify-center">
				<img src={icon} alt="Rupa Icon" class="h-24 w-auto drop-shadow-md" />
			</div>
			<h1 class="font-tiny5 text-6xl text-brand drop-shadow-sm">Rupa</h1>
			<p class="font-serif text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">
				The Weaver's Studio
			</p>
		</div>

		<div class="absolute bottom-16 flex flex-col items-center gap-4">
			<div class="h-0.5 w-48 overflow-hidden rounded-xl bg-black/5">
				<div class="h-full animate-[loading_2s_ease-in-out_infinite] bg-brand/60"></div>
			</div>
			<div class="flex flex-col items-center gap-1">
				<span class="font-serif text-[10px] italic opacity-40">Preparing the digital linen...</span>
				<span class="font-mono text-[9px] font-bold tracking-widest uppercase opacity-20"
					>Version {atelier.version}</span
				>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes loading {
		0% {
			width: 0%;
			transform: translateX(-100%);
		}
		50% {
			width: 50%;
			transform: translateX(50%);
		}
		100% {
			width: 0%;
			transform: translateX(200%);
		}
	}
</style>
