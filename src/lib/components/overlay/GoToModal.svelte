<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import { shuttle } from '../../engine/shuttle.js';
	import Modal from '../ui/Modal.svelte';
	import { onMount } from 'svelte';

	let { onClose = () => (atelier.studio.showGoTo = false) } = $props<{ onClose: () => void }>();

	// We use Cartesian coordinates for input as they match the HUD
	let targetX = $state(atelier.displayCoords.x);
	let targetY = $state(atelier.displayCoords.y);

	function jump() {
		// Convert Cartesian back to Internal
		const midX = Math.floor(atelier.linen.width / 2);
		const midY = Math.floor(atelier.linen.height / 2);

		let internalX, internalY;

		// X Conversion
		if (atelier.linen.width % 2 === 0) {
			internalX = targetX < 0 ? targetX + midX : targetX + midX - 1;
		} else {
			internalX = targetX + midX;
		}

		// Y Conversion (Y is inverted in display)
		const dispY = -targetY;
		if (atelier.linen.height % 2 === 0) {
			internalY = dispY < 0 ? dispY + midY : dispY + midY - 1;
		} else {
			internalY = dispY + midY;
		}

		// Clamp to valid range
		const finalX = Math.max(0, Math.min(atelier.linen.width - 1, internalX));
		const finalY = Math.max(0, Math.min(atelier.linen.height - 1, internalY));

		atelier.needle.setPos(finalX, finalY);
		onClose();
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Enter') jump();
	}

	onMount(() => {
		document.getElementById('goto-x')?.focus();
	});
</script>

<Modal
	title="Go To Coordinate"
	subtitle="Direct Needle Placement"
	icon="📍"
	{onClose}
	width="400px"
>
	<div class="flex flex-col gap-8">
		<div class="flex flex-col gap-6 rounded-xl border border-black/5 bg-white/40 p-8">
			<div class="grid grid-cols-2 gap-8">
				<div class="flex flex-col gap-2">
					<label
						for="goto-x"
						class="font-serif text-[10px] font-bold tracking-widest uppercase opacity-40"
						>Cartesian X</label
					>
					<input
						id="goto-x"
						type="number"
						bind:value={targetX}
						onkeydown={handleKey}
						class="rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-xl focus:border-brand focus:outline-none"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label
						for="goto-y"
						class="font-serif text-[10px] font-bold tracking-widest uppercase opacity-40"
						>Cartesian Y</label
					>
					<input
						id="goto-y"
						type="number"
						bind:value={targetY}
						onkeydown={handleKey}
						class="rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-xl focus:border-brand focus:outline-none"
					/>
				</div>
			</div>
			<p class="font-serif text-[10px] leading-relaxed italic opacity-40">
				Current Position: {atelier.displayCoords.x}, {atelier.displayCoords.y}
			</p>
		</div>

		<button class="artisan-primary-btn w-full py-4 text-lg" onclick={jump}> Move Needle </button>
	</div>
</Modal>
