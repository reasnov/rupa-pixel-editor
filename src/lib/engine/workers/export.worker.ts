/**
 * Export Worker: Dedicated thread for compute-heavy export tasks.
 */

self.onmessage = async (e: MessageEvent) => {
	const { type, payload } = e.data;

	if (type === 'TRACE_CLUSTERS') {
		const { width, data } = payload;
		const clustersByColor = new Map<string, Set<number>>();

		for (let i = 0; i < data.length; i++) {
			const val = data[i];
			if (val === 0) continue;
			const r = val & 0xff;
			const g = (val >> 8) & 0xff;
			const b = (val >> 16) & 0xff;
			const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

			if (!clustersByColor.has(hex)) clustersByColor.set(hex, new Set());
			clustersByColor.get(hex)!.add(i);
		}

		const result: any[] = [];
		const colors = Array.from(clustersByColor.keys());

		for (let i = 0; i < colors.length; i++) {
			const color = colors[i];
			const indices = clustersByColor.get(color)!;
			const pathData = traceCluster(indices, width);
			result.push({ color, pathData });

			self.postMessage({ type: 'PROGRESS', payload: (i + 1) / colors.length });
		}

		self.postMessage({ type: 'DONE', payload: result });
	} else if (type === 'QUANTIZE_FRAME') {
		const { imageData } = payload;
		const result = quantizeFrame(imageData);
		self.postMessage({ type: 'DONE', payload: result });
	}
};

/**
 * Ported quantizeFrame for the worker.
 */
function quantizeFrame(data: any) {
	const paletteMap = new Map<string, number>();
	const palette: number[] = [];
	const indexedPixels: number[] = new Array(data.length / 4);

	for (let i = 0; i < data.length; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		const a = data[i + 3];

		if (a < 128) {
			const key = '0,0,0,0';
			if (!paletteMap.has(key)) {
				paletteMap.set(key, palette.length);
				palette.push(0);
			}
			indexedPixels[i / 4] = paletteMap.get(key)!;
			continue;
		}

		const colorInt = (r << 16) | (g << 8) | b;
		const key = `${r},${g},${b}`;

		if (!paletteMap.has(key)) {
			if (palette.length >= 256) {
				indexedPixels[i / 4] = 0;
				continue;
			}
			paletteMap.set(key, palette.length);
			palette.push(colorInt);
		}

		indexedPixels[i / 4] = paletteMap.get(key)!;
	}

	while (palette.length < 2 || (palette.length & (palette.length - 1)) !== 0) {
		palette.push(0);
	}

	return { indexedPixels, palette };
}

/**
 * Ported traceCluster algorithm for the worker.
 */
function traceCluster(indices: Set<number>, width: number) {
	const edges = new Set<string>();

	for (const idx of indices) {
		const x = idx % width;
		const y = Math.floor(idx / width);

		const neighbors = [
			{ x: x, y: y - 1, id: 'top' },
			{ x: x + 1, y: y, id: 'right' },
			{ x: x, y: y + 1, id: 'bottom' },
			{ x: x - 1, y: y, id: 'left' }
		];

		neighbors.forEach((n) => {
			const nIdx = n.y * width + n.x;
			const isBoundary = n.x < 0 || n.x >= width || n.y < 0 || !indices.has(nIdx);

			if (isBoundary) {
				let edge;
				if (n.id === 'top') edge = `${x},${y}-${x + 1},${y}`;
				else if (n.id === 'right') edge = `${x + 1},${y}-${x + 1},${y + 1}`;
				else if (n.id === 'bottom') edge = `${x + 1},${y + 1}-${x},${y + 1}`;
				else edge = `${x},${y + 1}-${x},${y}`;
				edges.add(edge);
			}
		});
	}

	const pathParts: string[] = [];
	while (edges.size > 0) {
		const it = edges.values().next();
		if (it.done) break;
		const startEdge = it.value as string;

		edges.delete(startEdge);
		const [start, end] = startEdge.split('-');
		let current = end;
		let path = `M ${start.replace(',', ' ')} L ${end.replace(',', ' ')}`;

		let found = true;
		while (found) {
			found = false;
			for (const edge of edges) {
				if (edge.startsWith(current + '-')) {
					const [_, nextEnd] = edge.split('-');
					path += ` L ${nextEnd.replace(',', ' ')}`;
					current = nextEnd;
					edges.delete(edge);
					found = true;
					break;
				}
			}
		}
		path += ' Z';
		pathParts.push(path);
	}

	return pathParts.join(' ');
}
