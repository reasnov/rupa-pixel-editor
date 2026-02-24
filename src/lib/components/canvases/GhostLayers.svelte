<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import GhostFrame from './GhostFrame.svelte';

	interface Props {
		w: number;
		h: number;
	}

	let { w, h }: Props = $props();

	let ghosts = $derived.by(() => {
		if (!editor.showGhostLayers) return [];
		const activeIdx = editor.project.activeFrameIndex;
		const frames = editor.project.frames;
		const results = [];

		// Past Echoes (1 to 3 cups back)
		for (let i = 1; i <= 3; i++) {
			const idx = activeIdx - i;
			if (idx >= 0) {
				results.push({
					id: `past-${idx}`,
					pixels: frames[idx].compositePixels,
					opacity: 0.4 / i,
					tint: '#8d99ae'
				});
			}
		}

		// Future Echoes (1 to 3 cups forward)
		for (let i = 1; i <= 3; i++) {
			const idx = activeIdx + i;
			if (idx < frames.length) {
				results.push({
					id: `future-${idx}`,
					pixels: frames[idx].compositePixels,
					opacity: 0.4 / i,
					tint: '#a3b18a'
				});
			}
		}
		return results;
	});
</script>

{#if editor.showGhostLayers}
	{#each ghosts as ghost (ghost.id)}
		<GhostFrame
			pixels={ghost.pixels}
			width={w}
			height={h}
			opacity={ghost.opacity}
			tint={ghost.tint}
		/>
	{/each}
{/if}
