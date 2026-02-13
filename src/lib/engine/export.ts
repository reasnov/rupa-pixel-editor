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
	 * Renders the pixel data to a data URL using HTML5 Canvas.
	 * Supports 'image/png', 'image/jpeg', and 'image/webp'.
	 */
	static async toRaster(
		width: number,
		height: number,
		data: (string | null)[],
		scale: number,
		format: 'png' | 'jpg' | 'webp' = 'png',
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

		// Handle Background
		if (bgColor !== 'transparent') {
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, finalWidth, finalHeight);
		} else if (format === 'jpg') {
			// JPG doesn't support transparency, default to white
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, finalWidth, finalHeight);
		}

		data.forEach((color, i) => {
			if (color === null) return;
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

		const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
		return canvas.toDataURL(mimeType, 0.9); // 0.9 quality for lossy formats
	}

	/**
	 * Generates an Animated SVG using CSS keyframes.
	 */
	static toAnimatedSVG(
		width: number,
		height: number,
		frames: (string | null)[][],
		fps: number,
		bgColor: string | 'transparent' = 'transparent'
	): string {
		const duration = (frames.length / fps).toFixed(2);
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`;

		if (bgColor !== 'transparent') {
			svg += `<rect width="${width}" height="${height}" fill="${bgColor}" />`;
		}

		// Each frame becomes a group that is toggled via CSS animation
		frames.forEach((data, i) => {
			const delay = (i / fps).toFixed(2);
			svg += `<g class="frame" style="animation: fade ${duration}s step-end infinite; animation-delay: ${delay}s; opacity: ${i === 0 ? 1 : 0}">`;

			// Render individual frame data (optimized via rect merging if needed, but simple for now)
			data.forEach((color, idx) => {
				if (color === null) return;
				const x = idx % width;
				const y = Math.floor(idx / width);
				svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`;
			});

			svg += `</g>`;
		});

		svg += `<style>
            @keyframes fade {
                0%, ${100 / frames.length}% { opacity: 1; }
                ${100 / frames.length + 0.01}%, 100% { opacity: 0; }
            }
            .frame { pointer-events: none; }
        </style>`;

		svg += '</svg>';
		return svg;
	}

	/**
	 * Renders a sequence of frames to a WebM video using MediaRecorder.
	 */
	static async toWebM(
		width: number,
		height: number,
		frames: (string | null)[][],
		scale: number,
		fps: number,
		bgColor: string | 'transparent' = 'transparent'
	): Promise<Blob> {
		const canvas = document.createElement('canvas');
		const finalWidth = Math.round(width * scale);
		const finalHeight = Math.round(height * scale);
		canvas.width = finalWidth;
		canvas.height = finalHeight;
		const ctx = canvas.getContext('2d')!;
		ctx.imageSmoothingEnabled = false;

		const stream = canvas.captureStream(fps);
		const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
		const chunks: Blob[] = [];

		recorder.ondataavailable = (e) => chunks.push(e.data);

		return new Promise((resolve) => {
			recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
			recorder.start();

			let currentFrame = 0;
			const renderNext = () => {
				if (currentFrame >= frames.length) {
					recorder.stop();
					return;
				}

				// Draw background
				if (bgColor !== 'transparent') {
					ctx.fillStyle = bgColor;
					ctx.fillRect(0, 0, finalWidth, finalHeight);
				} else {
					ctx.clearRect(0, 0, finalWidth, finalHeight);
				}

				// Draw frame
				frames[currentFrame].forEach((color, i) => {
					if (color === null) return;
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

				currentFrame++;
				setTimeout(renderNext, 1000 / fps);
			};

			renderNext();
		});
	}
}
