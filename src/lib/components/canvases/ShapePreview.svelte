<script lang="ts">
	import { editor } from '../../state/editor.svelte.js';
	import { fade } from 'svelte/transition';

	interface Props {
		w: number;
		h: number;
	}

	let { w, h }: Props = $props();
</script>

{#if editor.studio.activeTool !== 'BRUSH' && editor.studio.shapeAnchor}
	{@const anchor = editor.studio.shapeAnchor}
	{@const cursor = editor.cursor.pos}
	{@const x1 = Math.min(anchor.x, cursor.x)}
	{@const y1 = Math.min(anchor.y, cursor.y)}
	{@const x2 = Math.max(anchor.x, cursor.x)}
	{@const y2 = Math.max(anchor.y, cursor.y)}
	{@const rw = x2 - x1 + 1}
	{@const rh = y2 - y1 + 1}
	<svg
		class="pointer-events-none absolute inset-0 z-40 h-full w-full overflow-visible"
		viewBox="0 0 {w} {h}"
		preserveAspectRatio="none"
	>
		{#if editor.studio.activeTool === 'RECTANGLE'}
			<rect
				x={x1}
				y={y1}
				width={rw}
				height={rh}
				fill="none"
				stroke="var(--color-fern-green)"
				stroke-width="0.1"
				stroke-dasharray="0.2, 0.2"
				class="marching-ants"
			/>
		{:else if editor.studio.activeTool === 'ELLIPSE'}
			<ellipse
				cx={x1 + rw / 2}
				cy={y1 + rh / 2}
				rx={rw / 2}
				ry={rh / 2}
				fill="none"
				stroke="var(--color-fern-green)"
				stroke-width="0.1"
				stroke-dasharray="0.2, 0.2"
				class="marching-ants"
			/>
		{:else if editor.studio.activeTool === 'POLYGON'}
			{@const xc = (anchor.x + cursor.x) / 2}
			{@const yc = (anchor.y + cursor.y) / 2}
			{@const r = Math.max(Math.abs(cursor.x - anchor.x), Math.abs(cursor.y - anchor.y)) / 2}
			{@const sides = editor.studio.polygonSides}
			{@const indent = editor.studio.polygonIndentation}
			{@const polyPoints = Array.from({ length: indent > 0 ? sides * 2 : sides }).map((_, i) => {
				const angle = -Math.PI / 2 + (i * 2 * Math.PI) / (indent > 0 ? sides * 2 : sides);
				const currentR = indent > 0 ? (i % 2 === 0 ? r : r * (1 - indent / 100)) : r;
				return `${xc + 0.5 + Math.cos(angle) * currentR},${yc + 0.5 + Math.sin(angle) * currentR}`;
			})}
			<polyline
				points={polyPoints.join(' ')}
				fill="none"
				stroke="var(--color-fern-green)"
				stroke-width="0.1"
				stroke-dasharray="0.2, 0.2"
				class="marching-ants"
			/>
			<line
				x1={xc +
					0.5 +
					Math.cos(
						-Math.PI / 2 +
							(((indent > 0 ? sides * 2 : sides) - 1) * 2 * Math.PI) /
								(indent > 0 ? sides * 2 : sides)
					) *
						(indent > 0
							? ((indent > 0 ? sides * 2 : sides) - 1) % 2 === 0
								? r
								: r * (1 - indent / 100)
							: r)}
				y1={yc +
					0.5 +
					Math.sin(
						-Math.PI / 2 +
							(((indent > 0 ? sides * 2 : sides) - 1) * 2 * Math.PI) /
								(indent > 0 ? sides * 2 : sides)
					) *
						(indent > 0
							? ((indent > 0 ? sides * 2 : sides) - 1) % 2 === 0
								? r
								: r * (1 - indent / 100)
							: r)}
				x2={xc + 0.5 + Math.cos(-Math.PI / 2) * r}
				y2={yc + 0.5 + Math.sin(-Math.PI / 2) * r}
				stroke="var(--color-fern-green)"
				stroke-width="0.1"
				stroke-dasharray="0.2, 0.2"
				class="marching-ants"
			/>
		{/if}
	</svg>
{/if}

<style>
	.marching-ants {
		animation: ants 1s linear infinite;
	}

	@keyframes ants {
		from {
			stroke-dashoffset: 0.2;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
