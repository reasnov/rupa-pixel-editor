<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import onboarding from '../../config/onboarding.json' with { type: 'json' };
	import Modal from '../ui/Modal.svelte';

	let { onClose = () => (atelier.studio.showArtisanCodex = false) } = $props<{
		onClose: () => void;
	}>();

	const { codex } = onboarding;
</script>

<Modal title={codex.title} subtitle={codex.subtitle} icon="📜" {onClose} width="850px">
	<div class="flex flex-col gap-12">
		<!-- The Story -->
		<section class="flex flex-col gap-6">
			<div class="flex items-center gap-4 border-b border-black/5 pb-4">
				<span class="text-3xl">🕯️</span>
				<h3 class="font-tiny5 text-3xl tracking-tighter text-brand uppercase">
					{codex.philosophy.title}
				</h3>
			</div>

			<div class="space-y-4 font-serif text-base leading-relaxed opacity-70">
				{#each codex.philosophy.paragraphs as p, i}
					<p class={i === codex.philosophy.paragraphs.length - 1 ? 'text-brand/60 italic' : ''}>
						{@html p}
					</p>
				{/each}
			</div>
		</section>

		<!-- The Three Pillars -->
		<div class="grid grid-cols-3 gap-6">
			{#each codex.pillars as pillar}
				<div
					class="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60"
				>
					<div class="text-2xl">{pillar.icon}</div>
					<h4 class="font-tiny5 text-lg tracking-tight text-brand uppercase">{pillar.title}</h4>
					<p class="font-serif text-[11px] leading-relaxed opacity-60">
						{@html pillar.description}
					</p>
				</div>
			{/each}
		</div>

		<!-- Sacred Techniques -->
		<section class="flex flex-col gap-8 rounded-3xl bg-brand/5 p-10 ring-1 ring-brand/10">
			<h3 class="font-tiny5 text-2xl tracking-tighter text-brand uppercase">
				Sacred Weaving Techniques
			</h3>

			<div class="grid grid-cols-2 gap-x-12 gap-y-8">
				{#each codex.techniques as tech}
					<div class="flex gap-5">
						<div
							class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
						>
							{tech.icon}
						</div>
						<div class="flex flex-col gap-1">
							<span class="font-serif text-sm font-black tracking-widest uppercase opacity-80"
								>{tech.title}</span
							>
							<p class="font-serif text-[11px] leading-relaxed opacity-60">
								{@html tech.description}
							</p>
						</div>
					</div>
				{/each}
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
