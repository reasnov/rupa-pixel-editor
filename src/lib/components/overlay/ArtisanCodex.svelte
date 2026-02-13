<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import Modal from '../ui/Modal.svelte';

	let { onClose = () => (atelier.showArtisanCodex = false) } = $props<{ onClose: () => void }>();
</script>

<Modal
	title="The Artisan's Codex"
	subtitle="The Sacred Scroll of Digital Weaving"
	icon="📜"
	{onClose}
	width="800px"
>
	<div class="flex flex-col gap-10">
		<!-- Introduction -->
		<section class="flex flex-col gap-4">
			<h3 class="font-tiny5 text-2xl text-brand">The Path of Rupa</h3>
			<p class="font-serif text-lg leading-relaxed italic opacity-70">
				"Every stitch is a decision, every motif a story."
			</p>
			<p class="font-serif text-sm leading-relaxed opacity-60">
				Welcome, Artisan. Rupa is a meditative space for pixel craftsmanship. Unlike traditional
				editors, Rupa is designed to be played like an instrument, where your fingers dance across
				the keys to weave digital linen into intricate patterns.
			</p>
		</section>

		<!-- Core Metaphors -->
		<div class="grid grid-cols-2 gap-8">
			<div class="rounded-2xl border border-black/5 bg-black/5 p-6">
				<h4 class="font-tiny5 mb-3 text-lg text-brand">The Linen & Needle</h4>
				<p class="font-serif text-xs leading-relaxed opacity-60">
					The <strong>Linen</strong> is your canvas—a digital fabric awaiting your touch. The
					<strong>Needle</strong> is your focus, the precise point where dye meets fiber. Move the needle
					with rhythmic grace using your arrow keys.
				</p>
			</div>
			<div class="rounded-2xl border border-black/5 bg-black/5 p-6">
				<h4 class="font-tiny5 mb-3 text-lg text-brand">Dyes & Stitches</h4>
				<p class="font-serif text-xs leading-relaxed opacity-60">
					A <strong>Stitch</strong> is a single unit of color. Apply <strong>Dyes</strong> using the Space
					bar. Select your threads using the number keys (1-0), each resonating with its own musical note.
				</p>
			</div>
		</div>

		<!-- Advanced Techniques -->
		<section class="flex flex-col gap-6">
			<h3 class="font-tiny5 text-2xl text-brand">Advanced Weaving</h3>

			<div class="flex flex-col gap-4">
				<div class="flex gap-6">
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-xl"
					>
						🧵
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-bold uppercase opacity-80"
							>Continuous Threading</span
						>
						<p class="font-serif text-xs leading-relaxed opacity-60">
							Hold <strong>Control</strong> while moving to pull a continuous line of dye. Combine
							with <strong>Shift</strong> to unravel (erase) as you move.
						</p>
					</div>
				</div>

				<div class="flex gap-6">
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-xl"
					>
						🕸️
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-bold uppercase opacity-80"
							>The Active Loom (Selection)</span
						>
						<p class="font-serif text-xs leading-relaxed opacity-60">
							Hold <strong>Shift</strong> to define an area. Once loomed, you can fill the region
							with Space, or use <strong>Ctrl+C/X/V</strong> to capture and place swatches of your work.
						</p>
					</div>
				</div>

				<div class="flex gap-6">
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-xl"
					>
						🎹
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-bold uppercase opacity-80"
							>Atmosphere Protocol</span
						>
						<p class="font-serif text-xs leading-relaxed opacity-60">
							The studio rewards focus. Silence reigns for the first 30 minutes, after which the
							Piano begins to weave its melody, reaching full resonance after an hour of creation.
						</p>
					</div>
				</div>
			</div>
		</section>

		<footer class="flex flex-col items-center gap-4 border-t border-black/5 pt-8 text-center">
			<p class="font-serif text-xs italic opacity-40">
				"May your stitches be true and your colors ever-vivid."
			</p>
			<div class="flex items-center gap-4">
				<button
					class="artisan-secondary-btn px-8"
					onclick={() => {
						onClose();
						atelier.showArtisanGuide = true;
					}}>View Quick Shortcuts</button
				>
				<button class="artisan-primary-btn px-12" onclick={onClose}>Begin the Weave</button>
			</div>
		</footer>
	</div>
</Modal>
