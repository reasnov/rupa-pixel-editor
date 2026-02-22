<script lang="ts">
	import { __ } from '$lib/state/i18n.svelte.js';
	import { editor } from '../../state/editor.svelte.js';
	import Modal from '../ui/Modal.svelte';

	let { onClose = () => (editor.showManual = false) } = $props<{
		onClose: () => void;
	}>();
</script>

<Modal
	title={__('manual:title')}
	subtitle={__('manual:subtitle')}
	icon="🍃"
	{onClose}
	width="850px"
>
	<div class="flex flex-col gap-12" role="document">
		<!-- Philosophy Section -->
		<section class="flex flex-col gap-6" aria-labelledby="philosophy-title">
			<div class="flex items-center gap-4 border-b border-evergreen/10 pb-4">
				<span class="text-3xl" aria-hidden="true">🌿</span>
				<h3
					id="philosophy-title"
					class="font-tiny5 text-3xl tracking-tighter text-fern-green uppercase"
				>
					{__('manual:philosophy.title')}
				</h3>
			</div>

			<div class="space-y-4 font-serif text-base leading-relaxed text-evergreen/80">
				<p>{__('manual:philosophy.p1')}</p>
				<p>{__('manual:philosophy.p2')}</p>
				<p class="text-lantern-gold italic">{__('manual:philosophy.p3')}</p>
			</div>
		</section>

		<!-- Core Pillars -->
		<div class="grid grid-cols-3 gap-6" role="list">
			<div
				class="flex flex-col gap-3 rounded-2xl border border-evergreen/5 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60"
				role="listitem"
			>
				<div class="text-2xl" aria-hidden="true">🖌️</div>
				<h4 class="font-tiny5 text-lg tracking-tight text-fern-green uppercase">
					{__('manual:pillars.cursor.title')}
				</h4>
				<p class="font-serif text-[12px] leading-relaxed text-evergreen/60">
					{__('manual:pillars.cursor.desc')}
				</p>
			</div>

			<div
				class="flex flex-col gap-3 rounded-2xl border border-evergreen/5 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60"
				role="listitem"
			>
				<div class="text-2xl" aria-hidden="true">🍵</div>
				<h4 class="font-tiny5 text-lg tracking-tight text-fern-green uppercase">
					{__('manual:pillars.colors.title')}
				</h4>
				<p class="font-serif text-[12px] leading-relaxed text-evergreen/60">
					{__('manual:pillars.colors.desc')}
				</p>
			</div>

			<div
				class="flex flex-col gap-3 rounded-2xl border border-evergreen/5 bg-white/40 p-6 shadow-sm transition-all hover:bg-white/60"
				role="listitem"
			>
				<div class="text-2xl" aria-hidden="true">📄</div>
				<h4 class="font-tiny5 text-lg tracking-tight text-fern-green uppercase">
					{__('manual:pillars.layers.title')}
				</h4>
				<p class="font-serif text-[12px] leading-relaxed text-evergreen/60">
					{__('manual:pillars.layers.desc')}
				</p>
			</div>
		</div>

		<!-- Skills & Techniques -->
		<section
			class="flex flex-col gap-8 rounded-3xl bg-fern-green/5 p-10 ring-1 ring-fern-green/10"
			aria-labelledby="techniques-title"
		>
			<h3
				id="techniques-title"
				class="font-tiny5 text-2xl tracking-tighter text-fern-green uppercase"
			>
				{__('manual:techniques.title')}
			</h3>

			<div class="grid grid-cols-2 gap-x-12 gap-y-8">
				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
						aria-hidden="true"
					>
						🎋
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-black tracking-widest text-evergreen/80 uppercase">
							{__('manual:techniques.continuous.title')}
						</span>
						<p class="font-serif text-[11px] leading-relaxed text-evergreen/60">
							{__('manual:techniques.continuous.desc')}
						</p>
					</div>
				</div>

				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
						aria-hidden="true"
					>
						✨
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-black tracking-widest text-evergreen/80 uppercase">
							{__('manual:techniques.magic_select.title')}
						</span>
						<p class="font-serif text-[11px] leading-relaxed text-evergreen/60">
							{__('manual:techniques.magic_select.desc')}
						</p>
					</div>
				</div>

				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
						aria-hidden="true"
					>
						🌀
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-black tracking-widest text-evergreen/80 uppercase">
							{__('manual:techniques.timeline.title')}
						</span>
						<p class="font-serif text-[11px] leading-relaxed text-evergreen/60">
							{__('manual:techniques.timeline.desc')}
						</p>
					</div>
				</div>

				<div class="flex gap-5">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
						aria-hidden="true"
					>
						🎐
					</div>
					<div class="flex flex-col gap-1">
						<span class="font-serif text-sm font-black tracking-widest text-evergreen/80 uppercase">
							{__('manual:techniques.audio.title')}
						</span>
						<p class="font-serif text-[11px] leading-relaxed text-evergreen/60">
							{__('manual:techniques.audio.desc')}
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Footer -->
		<footer class="flex flex-col items-center gap-6 border-t border-evergreen/10 pt-10 text-center">
			<div class="flex flex-col items-center gap-2">
				<p class="font-serif text-sm text-evergreen/50 italic">
					"{__('manual:footer.quote')}"
				</p>
				<span class="font-tiny5 text-[10px] tracking-[0.3em] text-evergreen/30 uppercase">
					{__('manual:footer.guild')}
				</span>
			</div>
			<div class="flex items-center gap-4">
				<button
					class="editor-secondary-btn px-10 py-4"
					onclick={() => {
						onClose();
						editor.showShortcuts = true;
					}}
				>
					{__('manual:footer.all_shortcuts')}
				</button>
				<button class="editor-primary-btn px-16 py-4 text-xl" onclick={onClose}>
					{__('manual:footer.enter')}
				</button>
			</div>
		</footer>
	</div>
</Modal>
