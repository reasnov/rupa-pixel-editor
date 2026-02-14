import { Path } from '../logic/path.js';

export class ExportEngine {
	/**
	 * Generates an optimized SVG string using a Path-Merging algorithm.
	 * This converts clusters of the same color into single <path> objects.
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

		const clustersByColor: Map<string, Set<number>> = new Map();

		for (let i = 0; i < data.length; i++) {
			const color = data[i];
			if (color === null) continue;
			if (!clustersByColor.has(color)) clustersByColor.set(color, new Set());
			clustersByColor.get(color)!.add(i);
		}

		clustersByColor.forEach((indices, color) => {
			const pathData = Path.traceCluster(indices, width);
			if (pathData) {
				svg += `<path d="${pathData}" fill="${color}" />`;
			}
		});

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
	 * Respects per-frame durations.
	 */
	static toAnimatedSVG(
		width: number,
		height: number,
		framesData: (string | null)[][],
		frameDurations: number[],
		bgColor: string | 'transparent' = 'transparent'
	): string {
		const totalDurationMs = frameDurations.reduce((a, b) => a + b, 0);
		const totalDurationSec = (totalDurationMs / 1000).toFixed(3);

		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`;

		if (bgColor !== 'transparent') {
			svg += `<rect width="${width}" height="${height}" fill="${bgColor}" />`;
		}

		let elapsedMs = 0;
		framesData.forEach((data, i) => {
			const startPct = ((elapsedMs / totalDurationMs) * 100).toFixed(3);
			const durationMs = frameDurations[i];
			const endPct = (((elapsedMs + durationMs) / totalDurationMs) * 100).toFixed(3);

			const animName = `rupa-frame-${i}`;
			svg += `<g class="${animName}" style="opacity: 0; visibility: hidden; animation: ${animName} ${totalDurationSec}s step-end infinite;">`;

			const clustersByColor: Map<string, Set<number>> = new Map();
			for (let idx = 0; idx < data.length; idx++) {
				const color = data[idx];
				if (color === null) continue;
				if (!clustersByColor.has(color)) clustersByColor.set(color, new Set());
				clustersByColor.get(color)!.add(idx);
			}

			clustersByColor.forEach((indices, color) => {
				const pathData = Path.traceCluster(indices, width);
				if (pathData) {
					svg += `<path d="${pathData}" fill="${color}" />`;
				}
			});

			svg += `</g>`;
			svg += `<style>
                @keyframes ${animName} {
                    0%, ${startPct}% { opacity: 0; visibility: hidden; }
                    ${startPct}%, ${endPct}% { opacity: 1; visibility: visible; }
                    ${endPct}%, 100% { opacity: 0; visibility: hidden; }
                }
            </style>`;

			elapsedMs += durationMs;
		});

		svg += '</svg>';
		return svg;
	}

	/**
	 * Renders a sequence of frames to a video Blob using MediaRecorder.
	 * Uses per-frame durations and ensures a valid video stream is produced.
	 */
	static async toVideo(
		width: number,
		height: number,
		framesData: (string | null)[][],
		frameDurations: number[],
		scale: number,
		format: 'webm' | 'mp4' = 'webm',
		bgColor: string | 'transparent' = 'transparent'
	): Promise<Blob> {
		const canvas = document.createElement('canvas');
		const finalWidth = Math.round(width * scale);
		const finalHeight = Math.round(height * scale);
		canvas.width = finalWidth;
		canvas.height = finalHeight;

		const ctx = canvas.getContext('2d', { alpha: false })!;
		ctx.imageSmoothingEnabled = false;

		// High-compatibility settings
		const mimeType =
			format === 'mp4' && MediaRecorder.isTypeSupported('video/mp4;codecs=h264')
				? 'video/mp4;codecs=h264'
				: 'video/webm;codecs=vp8'; // VP8 is the most widely supported WebM codec

		// Capture stream with a high enough FPS to ensure smooth playback
		// but we will control the drawing manually.
		const stream = canvas.captureStream(30);
		const recorder = new MediaRecorder(stream, {
			mimeType,
			videoBitsPerSecond: 8000000
		});

		const chunks: Blob[] = [];
		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) chunks.push(e.data);
		};

		return new Promise((resolve, reject) => {
			recorder.onstop = () => {
				const blob = new Blob(chunks, { type: mimeType });
				resolve(blob);
			};
			recorder.onerror = (err) => reject(err);

			recorder.start();

			// Pre-render first frame to "warm up" the stream
			const drawFrame = (frameIndex: number) => {
				ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
				ctx.fillRect(0, 0, finalWidth, finalHeight);

				const data = framesData[frameIndex];
				for (let j = 0; j < data.length; j++) {
					const color = data[j];
					if (color === null) continue;
					const x = j % width;
					const y = Math.floor(j / width);
					ctx.fillStyle = color;
					ctx.fillRect(
						Math.floor(x * scale),
						Math.floor(y * scale),
						Math.ceil(scale),
						Math.ceil(scale)
					);
				}
			};

			(async () => {
				// Wait for recorder to be active
				await new Promise((r) => setTimeout(r, 200));

				for (let i = 0; i < framesData.length; i++) {
					drawFrame(i);
					// Hold the frame for its specified duration
					await new Promise((r) => setTimeout(r, frameDurations[i]));
				}

				// Final padding to ensure the last frame is captured
				await new Promise((r) => setTimeout(r, 500));
				recorder.stop();
				stream.getTracks().forEach((t) => t.stop());
			})();
		});
	}

	/**
	 * Generates a GIF using the lightweight omggif library.
	 */
	static async toGIF(
		width: number,
		height: number,
		framesData: (string | null)[][],
		frameDurations: number[],
		scale: number,
		bgColor: string | 'transparent' = 'transparent'
	): Promise<Blob> {
		const { GifWriter } = await import('./omggif.js');

		const finalWidth = Math.round(width * scale);
		const finalHeight = Math.round(height * scale);
		const canvas = document.createElement('canvas');
		canvas.width = finalWidth;
		canvas.height = finalHeight;
		const ctx = canvas.getContext('2d', { alpha: true })!;
		ctx.imageSmoothingEnabled = false;

		// Initialize buffer (Max 1MB per frame roughly estimated)
		const buffer = new Uint8Array(framesData.length * finalWidth * finalHeight * 2);
		const writer = new GifWriter(buffer, finalWidth, finalHeight, { loop: 0 }); // Loop forever

		for (let i = 0; i < framesData.length; i++) {
			// 1. Render frame to canvas
			ctx.clearRect(0, 0, finalWidth, finalHeight);
			if (bgColor !== 'transparent') {
				ctx.fillStyle = bgColor;
				ctx.fillRect(0, 0, finalWidth, finalHeight);
			}

			const frameData = framesData[i];
			for (let j = 0; j < frameData.length; j++) {
				const color = frameData[j];
				if (color === null) continue;
				const x = j % width;
				const y = Math.floor(j / width);
				ctx.fillStyle = color;
				ctx.fillRect(
					Math.floor(x * scale),
					Math.floor(y * scale),
					Math.ceil(scale),
					Math.ceil(scale)
				);
			}

			// 2. Extract pixels and quantize
			const imageData = ctx.getImageData(0, 0, finalWidth, finalHeight).data;
			const { indexedPixels, palette } = this.quantizeFrame(imageData);

			// 3. Add to GIF (delay is in 10ms units)
			writer.addFrame(0, 0, finalWidth, finalHeight, indexedPixels, {
				palette: palette,
				delay: Math.round(frameDurations[i] / 10)
			});

			// Yield to UI thread
			await new Promise((r) => setTimeout(r, 0));
		}

		// Slice the buffer to the actual used size
		const usedBuffer = buffer.slice(0, writer.end());
		return new Blob([usedBuffer], { type: 'image/gif' });
	}

	/**
	 * Simple color quantizer for GIF.
	 * Maps RGBA pixels to a palette of up to 256 colors.
	 */
	private static quantizeFrame(data: Uint8ClampedArray): {
		indexedPixels: number[];
		palette: number[];
	} {
		const paletteMap = new Map<string, number>();
		const palette: number[] = [];
		const indexedPixels: number[] = new Array(data.length / 4);

		// Always add transparent/background color at index 0
		// We use 0 as the transparent index in this implementation if needed,
		// but omggif handles it via options. For now, strict colors.
		// A simple strategy: Build palette dynamically.

		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];
			const a = data[i + 3];

			// Simple alpha threshold
			if (a < 128) {
				// Transparent
				// We'll map transparency to index 0 (and ensure index 0 is reserved or handled)
				// For this simple implementation, let's treat transparency as a specific color key
				// or just map it to the background if no transparency support is requested.
				// Here we map to magenta (magic pink) for now or handled by disposal.
				// Let's assume solid background for this version to ensure stability.
				const key = '0,0,0,0'; // Transparent
				if (!paletteMap.has(key)) {
					paletteMap.set(key, palette.length);
					palette.push(0); // Placeholder
				}
				indexedPixels[i / 4] = paletteMap.get(key)!;
				continue;
			}

			const colorInt = (r << 16) | (g << 8) | b;
			const key = `${r},${g},${b}`;

			if (!paletteMap.has(key)) {
				// GIF limit
				if (palette.length >= 256) {
					// Simple fallback: map to index 0 (lossy)
					indexedPixels[i / 4] = 0;
					continue;
				}
				paletteMap.set(key, palette.length);
				palette.push(colorInt);
			}

			indexedPixels[i / 4] = paletteMap.get(key)!;
		}

		// Ensure palette is power of 2 size (required by GIF spec)
		while (palette.length < 2 || (palette.length & (palette.length - 1)) !== 0) {
			palette.push(0);
		}

		return { indexedPixels, palette };
	}
}
