export class ExportEngine {
	/**
	 * Generates an optimized SVG string using a Greedy Rect-Merging algorithm.
	 */
	static toSVG(
		width: number,
		height: number,
		data: (string | null)[],
		bgColor: string | 'transparent' = 'transparent'
	): string {
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`;

		// Fill background if not transparent
		if (bgColor !== 'transparent') {
			svg += `<rect width="${width}" height="${height}" fill="${bgColor}" />`;
		}

		const visited = new Array(data.length).fill(false);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const idx = y * width + x;
				const color = data[idx];

				// Now we only skip if the value is explicitly null (Empty)
				if (color === null || visited[idx]) continue;

				const cluster = this.findCluster(x, y, width, height, data, visited);
				const rects = this.greedyRectMerge(cluster, width);

				rects.forEach((r) => {
					svg += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${color}" />`;
				});
			}
		}

		svg += '</svg>';
		return svg;
	}

	private static findCluster(
		startX: number,
		startY: number,
		width: number,
		height: number,
		data: (string | null)[],
		visited: boolean[]
	): Set<number> {
		const color = data[startY * width + startX];
		const cluster = new Set<number>();
		const queue = [[startX, startY]];

		visited[startY * width + startX] = true;
		cluster.add(startY * width + startX);

		while (queue.length > 0) {
			const [x, y] = queue.shift()!;
			const neighbors = [
				[x + 1, y],
				[x - 1, y],
				[x, y + 1],
				[x, y - 1]
			];

			for (const [nx, ny] of neighbors) {
				if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
					const nIdx = ny * width + nx;
					if (!visited[nIdx] && data[nIdx] === color) {
						visited[nIdx] = true;
						cluster.add(nIdx);
						queue.push([nx, ny]);
					}
				}
			}
		}
		return cluster;
	}

	private static greedyRectMerge(
		cluster: Set<number>,
		totalWidth: number
	): Array<{ x: number; y: number; w: number; h: number }> {
		const rects = [];
		const localVisited = new Set<number>();
		const points = Array.from(cluster).sort((a, b) => a - b);

		for (const startIdx of points) {
			if (localVisited.has(startIdx)) continue;
			const startX = startIdx % totalWidth;
			const startY = Math.floor(startIdx / totalWidth);
			let w = 1;
			while (
				cluster.has(startY * totalWidth + (startX + w)) &&
				!localVisited.has(startY * totalWidth + (startX + w))
			) {
				w++;
			}
			let h = 1;
			let canExpandY = true;
			while (canExpandY) {
				const nextY = startY + h;
				for (let nextX = startX; nextX < startX + w; nextX++) {
					const nextIdx = nextY * totalWidth + nextX;
					if (!cluster.has(nextIdx) || localVisited.has(nextIdx)) {
						canExpandY = false;
						break;
					}
				}
				if (canExpandY) h++;
			}
			rects.push({ x: startX, y: startY, w, h });
			for (let ry = startY; ry < startY + h; ry++) {
				for (let rx = startX; rx < startX + w; rx++) {
					localVisited.add(ry * totalWidth + rx);
				}
			}
		}
		return rects;
	}

	/**
	 * Renders the pixel data to a data URL (PNG) using HTML5 Canvas.
	 */
	static async toPNG(
		width: number,
		height: number,
		data: (string | null)[],
		scale: number,
		bgColor: string | 'transparent' = 'transparent'
	): Promise<string> {
		const canvas = document.createElement('canvas');
		const finalWidth = Math.max(1, Math.round(width * scale));
		const finalHeight = Math.max(1, Math.round(height * scale));
		canvas.width = finalWidth;
		canvas.height = finalHeight;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Could not get canvas context');
		ctx.imageSmoothingEnabled = false;

		if (bgColor !== 'transparent') {
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, finalWidth, finalHeight);
		}

		data.forEach((color, i) => {
			if (color === null) return; // Skip empty (null)
			const x = i % width;
			const y = Math.floor(i / width);
			ctx.fillStyle = color;
			ctx.fillRect(
				Math.floor(x * scale),
				Math.floor(y * scale),
				Math.ceil(scale),
				Math.ceil(scale)
			);
		});
		return canvas.toDataURL('image/png');
	}
}
