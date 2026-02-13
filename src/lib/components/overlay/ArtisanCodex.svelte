<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import Modal from '../ui/Modal.svelte';

	let { onClose = () => (atelier.studio.showArtisanCodex = false) } = $props<{
		onClose: () => void;
	}>();
</script>

<Modal
	title="The Artisan's Codex"
	subtitle="Volume I: The Sacred Weave"
	icon="📜"
	{onClose}
	width="850px"
>
	<div class="flex flex-col gap-12">
		<!-- The Story -->
		<section class="flex flex-col gap-6">
			<div class="flex items-center gap-4 border-b border-black/5 pb-4">
				<span class="text-3xl">🕯️</span>
				<h3 class="font-tiny5 text-3xl tracking-tighter text-brand uppercase">
					The Philosophy of Form
				</h3>
			</div>

			<div class="space-y-4 font-serif text-base leading-relaxed opacity-70">
				<p>
					In the beginning, there was only the <strong>Linen</strong>—a vast, untouched cream void.
					Then came the <strong>Needle</strong>, guided by the artisan's intent, bringing the first
					spark of color to the fiber.
				</p>
				<p>
					Rupa is not merely an editor; it is a sanctuary where digital threads are woven into
					motifs. We believe that every pixel is a <strong>Stitch</strong>, a deliberate act of
					creation that requires focus, rhythm, and a peaceful heart.
				</p>
				<p class="text-brand/60 italic">
					"We do not paint pixels; we weave light into the fabric of time."
				</p>
			</div>
		</section>

		<!-- The Three Pillars -->
		<div class="grid grid-cols-3 gap-6">
			<div
				class="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60"
			>
				<div class="text-2xl">🪡</div>
				<h4 class="font-tiny5 text-lg tracking-tight text-brand uppercase">The Needle</h4>
				<p class="font-serif text-[11px] leading-relaxed opacity-60">
					Your focal point. Controlled by the <strong>Arrow Keys</strong>, it moves with the
					precision of a master weaver.
				</p>
			</div>

			<div
				class="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60"
			>
				<div class="text-2xl">🏺</div>
				<h4 class="font-tiny5 text-lg tracking-tight text-brand uppercase">The Dyes</h4>
				<p class="font-serif text-[11px] leading-relaxed opacity-60">
					Pigments of life. Apply them with <strong>Space</strong>. Use the
					<strong>Number Keys</strong> to switch between resonant tones.
				</p>
			</div>

			<div
				class="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60"
			>
				<div class="text-2xl">🛡️</div>
				<h4 class="font-tiny5 text-lg tracking-tight text-brand uppercase">The Veils</h4>
				<p class="font-serif text-[11px] leading-relaxed opacity-60">
					Layers of depth. Manage them via the <strong>Folio Sidebar</strong>. Each veil adds a new
					dimension to your motif.
				</p>
			</div>
		</div>

		<!-- Sacred Techniques -->
		<section class="flex flex-col gap-8 rounded-3xl bg-brand/5 p-10 ring-1 ring-brand/10">
			<h3 class="font-tiny5 text-2xl tracking-tighter text-brand uppercase">
				Sacred Weaving Techniques
			</h3>

			<div class="grid grid-cols-2 gap-x-12 gap-y-8">
				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
					>
						🧵
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-black tracking-widest uppercase opacity-80"
							>Threading</span
						>
						<p class="font-serif text-[11px] leading-relaxed opacity-60">
							Hold <strong>Ctrl</strong> to pull a continuous line of dye. Flow with the rhythm of the
							grid.
						</p>
					</div>
				</div>

				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
					>
						🪄
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-black tracking-widest uppercase opacity-80"
							>Spirit Pick</span
						>
						<p class="font-serif text-[11px] leading-relaxed opacity-60">
							Press <strong>W</strong> to resonate with connected colors. A magical way to select complex
							motifs.
						</p>
					</div>
				</div>

				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
					>
						⏳
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-black tracking-widest uppercase opacity-80"
							>The Spindle</span
						>
						<p class="font-serif text-[11px] leading-relaxed opacity-60">
							The axis of time. Create frames to see your work in motion. Press <strong>P</strong> to
							feel the pulse.
						</p>
					</div>
				</div>

				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
					>
						🎹
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-black tracking-widest uppercase opacity-80"
							>Resonance</span
						>
						<p class="font-serif text-[11px] leading-relaxed opacity-60">
							Listen. The studio breathes with you. Music will emerge once your focus reaches its
							peak.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Call to Action -->
		<footer class="flex flex-col items-center gap-6 border-t border-black/5 pt-10 text-center">
			<div class="flex flex-col items-center gap-2">
				<p class="font-serif text-sm italic opacity-50">
					"May your needle be swift and your patterns ever-peaceful."
				</p>
				<span class="font-tiny5 text-[10px] tracking-[0.3em] uppercase opacity-30"
					>The Rupa Guild</span
				>
			</div>
			<div class="flex items-center gap-4">
				<button
					class="artisan-secondary-btn px-10 py-4"
					onclick={() => {
						onClose();
						atelier.studio.showArtisanGuide = true;
					}}
				>
					View All Shortcuts
				</button>
				<button class="artisan-primary-btn px-16 py-4 text-xl" onclick={onClose}>
					Enter the Atelier
				</button>
			</div>
		</footer>
	</div>
</Modal>
