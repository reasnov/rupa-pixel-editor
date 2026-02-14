<script lang="ts">
	import { atelier } from '../../state/atelier.svelte.js';
	import Modal from '../ui/Modal.svelte';

	let { onClose = () => (atelier.studio.showArtisanCodex = false) } = $props<{
		onClose: () => void;
	}>();
</script>

<Modal
	title={__({ key: 'codex.title' })}
	subtitle={__({ key: 'codex.subtitle' })}
	icon="📜"
	{onClose}
	width="850px"
>
	<div class="flex flex-col gap-12" role="document">
		<!-- The Story -->
		<section class="flex flex-col gap-6" aria-labelledby="philosophy-title">
			<div class="flex items-center gap-4 border-b border-black/5 pb-4">
				<span class="text-3xl" aria-hidden="true">🕯️</span>
				<h3 id="philosophy-title" class="font-tiny5 text-3xl tracking-tighter text-brand uppercase">
					{__({ key: 'codex.philosophy.title' })}
				</h3>
			</div>

			<div class="space-y-4 font-serif text-base leading-relaxed text-studio-text/80">
				<p>{__({ key: 'codex.philosophy.p1' })}</p>
				<p>{__({ key: 'codex.philosophy.p2' })}</p>
				<p class="text-brand/60 italic">{__({ key: 'codex.philosophy.p3' })}</p>
			</div>
		</section>

		<!-- The Three Pillars -->
		<div class="grid grid-cols-3 gap-6" role="list">
			<div
				class="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60"
				role="listitem"
			>
				<div class="text-2xl" aria-hidden="true">🪡</div>
				<h4 class="font-tiny5 text-lg tracking-tight text-brand uppercase">
					{__({ key: 'codex.pillars.needle.title' })}
				</h4>
				<p class="font-serif text-[12px] leading-relaxed text-studio-text/60">
					{__({ key: 'codex.pillars.needle.desc' })}
				</p>
			</div>

			<div
				class="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60"
				role="listitem"
			>
				<div class="text-2xl" aria-hidden="true">🏺</div>
				<h4 class="font-tiny5 text-lg tracking-tight text-brand uppercase">
					{__({ key: 'codex.pillars.dyes.title' })}
				</h4>
				<p class="font-serif text-[12px] leading-relaxed text-studio-text/60">
					{__({ key: 'codex.pillars.dyes.desc' })}
				</p>
			</div>

			<div
				class="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60"
				role="listitem"
			>
				<div class="text-2xl" aria-hidden="true">🛡️</div>
				<h4 class="font-tiny5 text-lg tracking-tight text-brand uppercase">
					{__({ key: 'codex.pillars.veils.title' })}
				</h4>
				<p class="font-serif text-[12px] leading-relaxed text-studio-text/60">
					{__({ key: 'codex.pillars.veils.desc' })}
				</p>
			</div>
		</div>

		<!-- Sacred Techniques -->
		<section
			class="flex flex-col gap-8 rounded-3xl bg-brand/5 p-10 ring-1 ring-brand/10"
			aria-labelledby="techniques-title"
		>
			<h3 id="techniques-title" class="font-tiny5 text-2xl tracking-tighter text-brand uppercase">
				{__({ key: 'codex.techniques.title' })}
			</h3>

			<div class="grid grid-cols-2 gap-x-12 gap-y-8">
				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
						aria-hidden="true"
					>
						🧵
					</div>
					<div class="flex flex-col gap-1">
						<span
							class="font-serif text-sm font-black tracking-widest text-studio-text/80 uppercase"
						>
							{__({ key: 'codex.techniques.threading.title' })}
						</span>
						<p class="font-serif text-[11px] leading-relaxed text-studio-text/60">
							{__({ key: 'codex.techniques.threading.desc' })}
						</p>
					</div>
				</div>

				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
						aria-hidden="true"
					>
						🪄
					</div>
					<div class="flex flex-col gap-1">
						<span
							class="font-serif text-sm font-black tracking-widest text-studio-text/80 uppercase"
						>
							{__({ key: 'codex.techniques.spirit_pick.title' })}
						</span>
						<p class="font-serif text-[11px] leading-relaxed text-studio-text/60">
							{__({ key: 'codex.techniques.spirit_pick.desc' })}
						</p>
					</div>
				</div>

				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
						aria-hidden="true"
					>
						⏳
					</div>
					<div class="flex flex-col gap-1">
						<span
							class="font-serif text-sm font-black tracking-widest text-studio-text/80 uppercase"
						>
							{__({ key: 'codex.techniques.spindle.title' })}
						</span>
						<p class="font-serif text-[11px] leading-relaxed text-studio-text/60">
							{__({ key: 'codex.techniques.spindle.desc' })}
						</p>
					</div>
				</div>

				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
						aria-hidden="true"
					>
						🎹
					</div>
					<div class="flex flex-col gap-1">
						<span
							class="font-serif text-sm font-black tracking-widest text-studio-text/80 uppercase"
						>
							{__({ key: 'codex.techniques.resonance.title' })}
						</span>
						<p class="font-serif text-[11px] leading-relaxed text-studio-text/60">
							{__({ key: 'codex.techniques.resonance.desc' })}
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Call to Action -->
		<footer class="flex flex-col items-center gap-6 border-t border-black/5 pt-10 text-center">
			<div class="flex flex-col items-center gap-2">
				<p class="font-serif text-sm text-studio-text/50 italic">
					"{__({ key: 'codex.footer.quote' })}"
				</p>
				<span class="font-tiny5 text-[10px] tracking-[0.3em] text-studio-text/30 uppercase">
					{__({ key: 'codex.footer.guild' })}
				</span>
			</div>
			<div class="flex items-center gap-4">
				<button
					class="artisan-secondary-btn px-10 py-4"
					onclick={() => {
						onClose();
						atelier.studio.showArtisanGuide = true;
					}}
				>
					{__({ key: 'codex.footer.all_shortcuts' })}
				</button>
				<button class="artisan-primary-btn px-16 py-4 text-xl" onclick={onClose}>
					{__({ key: 'codex.footer.enter' })}
				</button>
			</div>
		</footer>
	</div>
</Modal>
