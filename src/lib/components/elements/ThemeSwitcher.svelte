<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { sfx } from '../../engine/audio.js';
	import Button from './Button.svelte';

	const studio = editor.studio;

	function handleToggle() {
		sfx.playCeramicSlide();
		studio.toggleTheme();
	}
</script>

<Button
	variant="ghost"
	size="sm"
	onclick={handleToggle}
	ariaLabel="ui:labels.switch_theme"
	class="relative h-8 w-8 !p-0"
>
	<div class="relative flex h-full w-full items-center justify-center overflow-hidden">
		<span
			class="text-lg transition-transform duration-500 {studio.theme === 'light'
				? 'translate-y-0'
				: 'translate-y-10'}"
		>
			☀️
		</span>
		<span
			class="absolute text-lg transition-transform duration-500 {studio.theme === 'dark'
				? 'translate-y-0'
				: '-translate-y-10'}"
		>
			🌙
		</span>
	</div>
</Button>
