import { Path } from '../logic/path.js';
import { ColorLogic } from '../logic/color.js';

export class ExportEngine {
	/**
	 * Generates an optimized SVG string.
	 * If includeBorders is true, it draws individual rects with strokes instead of merged paths.
	 */
	static toSVG(
		width: number,
		height: number,
		data: Uint32Array,
		bgColor: string | 'transparent' = 'transparent',
		includeBorders = false
	): string {
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`;

		if (bgColor !== 'transparent') {
			svg += `<rect width="${width}" height="${height}" fill="${bgColor}" />`;
		}

		if (includeBorders) {
			// Draw individual pixels with borders
			data.forEach((val, i) => {
				if (val === 0) return;
				const color = ColorLogic.uint32ToHex(val);
				const x = i % width;
				const y = Math.floor(i / width);
				svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="0.05" />`;
			});
		} else {
			// Draw optimized clusters
			const clustersByColor: Map<string, Set<number>> = new Map();
			for (let i = 0; i < data.length; i++) {
				const val = data[i];
				if (val === 0) continue;
				const color = ColorLogic.uint32ToHex(val)!;
				if (!clustersByColor.has(color)) clustersByColor.set(color, new Set());
				clustersByColor.get(color)!.add(i);
			}

			clustersByColor.forEach((indices, color) => {
				const pathData = Path.traceCluster(indices, width);
				if (pathData) {
					svg += `<path d="${pathData}" fill="${color}" />`;
				}
			});
		}

		svg += '</svg>';
		return svg;
	}

	/**
	 * Renders the pixel data to a data URL.
	 */
	static async toRaster(
		width: number,
		height: number,
		data: Uint32Array,
		scale: number,
		format: 'png' | 'jpg' | 'webp' = 'png',
		bgColor: string | 'transparent' = 'transparent',
		includeBorders = false
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
		} else if (format === 'jpg') {
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, finalWidth, finalHeight);
		}

		data.forEach((val, i) => {
			if (val === 0) return;
			const color = ColorLogic.uint32ToHex(val)!;
			const x = i % width;
			const y = Math.floor(i / width);
			const px = Math.floor(x * scale);
			const py = Math.floor(y * scale);
			const pw = Math.ceil(scale);
			const ph = Math.ceil(scale);

			ctx.fillStyle = color;
			ctx.fillRect(px, py, pw, ph);

			if (includeBorders) {
				ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
				ctx.lineWidth = 1;
				ctx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
			}
		});

		const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
		return canvas.toDataURL(mimeType, 0.9);
	}

	/**
	 * Generates an Animated SVG.
	 */
	static toAnimatedSVG(
		width: number,
		height: number,
		framesData: Uint32Array[],
		frameDurations: number[],
		bgColor: string | 'transparent' = 'transparent',
		includeBorders = false
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
			svg += `<g class="${animName}" style="opacity: 0; visibility: hidden; display: none; animation: ${animName} ${totalDurationSec}s step-end infinite;">`;

			if (includeBorders) {
				data.forEach((val, idx) => {
					if (val === 0) return;
					const color = ColorLogic.uint32ToHex(val);
					const x = idx % width;
					const y = Math.floor(idx / width);
					svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="0.05" />`;
				});
			} else {
				const clustersByColor: Map<string, Set<number>> = new Map();
				for (let idx = 0; idx < data.length; idx++) {
					const val = data[idx];
					if (val === 0) continue;
					const color = ColorLogic.uint32ToHex(val)!;
					if (!clustersByColor.has(color)) clustersByColor.set(color, new Set());
					clustersByColor.get(color)!.add(idx);
				}

				clustersByColor.forEach((indices, color) => {
					const pathData = Path.traceCluster(indices, width);
					if (pathData) {
						svg += `<path d="${pathData}" fill="${color}" />`;
					}
				});
			}

			svg += `</g>`;
			svg += `<style>
                @keyframes ${animName} {
                    0%, ${startPct}% { opacity: 0; visibility: hidden; display: none; }
                    ${startPct}%, ${endPct}% { opacity: 1; visibility: visible; display: block; }
                    ${endPct}%, 100% { opacity: 0; visibility: hidden; display: none; }
                }
            </style>`;

			elapsedMs += durationMs;
		});

		svg += '</svg>';
		return svg;
	}

	/**
	 * Renders a sequence of frames to a video Blob.
	 * Phase 1 of The Chronos Protocol: Deterministic Frame Assembly.
	 */
	static async toVideo(
		width: number,
		height: number,
		framesData: Uint32Array[],
		frameDurations: number[],
		scale: number,
		format: 'webm' | 'mp4' = 'webm',
		bgColor: string | 'transparent' = 'transparent',
		includeBorders = false
	): Promise<Blob> {
		const canvas = document.createElement('canvas');
		const finalWidth = Math.round(width * scale);
		const finalHeight = Math.round(height * scale);
		canvas.width = finalWidth;
		canvas.height = finalHeight;

		// Visible Buffer Strategy: Briefly attach to DOM to prevent throttling
		canvas.style.position = 'fixed';
		canvas.style.left = '-10000px';
		canvas.style.top = '-10000px';
		document.body.appendChild(canvas);

		const ctx = canvas.getContext('2d', { alpha: false })!;
		ctx.imageSmoothingEnabled = false;

		const mimeType =
			format === 'mp4' && MediaRecorder.isTypeSupported('video/mp4;codecs=h264')
				? 'video/mp4;codecs=h264'
				: 'video/webm;codecs=vp8';

		// Chronos Protocol: captureStream(0) for manual frame requests
		const stream = (canvas as any).captureStream(0);
		const track = stream.getVideoTracks()[0];
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
				document.body.removeChild(canvas);
				const blob = new Blob(chunks, { type: mimeType });
				resolve(blob);
			};
			recorder.onerror = (err) => {
				document.body.removeChild(canvas);
				reject(err);
			};

			recorder.start();

			const drawFrame = (frameIndex: number) => {
				ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
				ctx.fillRect(0, 0, finalWidth, finalHeight);

				const data = framesData[frameIndex];
				for (let j = 0; j < data.length; j++) {
					const val = data[j];
					if (val === 0) continue;
					const color = ColorLogic.uint32ToHex(val)!;
					const x = j % width;
					const y = Math.floor(j / width);
					const px = Math.floor(x * scale);
					const py = Math.floor(y * scale);
					const pw = Math.ceil(scale);
					const ph = Math.ceil(scale);

					ctx.fillStyle = color;
					ctx.fillRect(px, py, pw, ph);

					if (includeBorders) {
						ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
						ctx.lineWidth = 1;
						ctx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
					}
				}
				// Force GPU Flush
				ctx.getImageData(0, 0, 1, 1);
			};

			(async () => {
				// Warm-up delay
				await new Promise((r) => setTimeout(r, 200));

				for (let i = 0; i < framesData.length; i++) {
					drawFrame(i);
					// Explicitly request the frame
					if (track && (track as any).requestFrame) {
						(track as any).requestFrame();
					}
					// Wait for the duration of the frame
					await new Promise((r) => setTimeout(r, frameDurations[i]));
				}

				// Finalization buffer
				await new Promise((r) => setTimeout(r, 500));
				recorder.stop();
				stream.getTracks().forEach((t: any) => t.stop());
			})();
		});
	}

	/**
	 * Generates a GIF.
	 * Phase 2 of The Chronos Protocol: Accumulated Error Correction.
	 */
	static async toGIF(
		width: number,
		height: number,
		framesData: Uint32Array[],
		frameDurations: number[],
		scale: number,
		bgColor: string | 'transparent' = 'transparent',
		includeBorders = false
	): Promise<Blob> {
		const { GifWriter } = await import('./omggif.js');

		const finalWidth = Math.round(width * scale);
		const finalHeight = Math.round(height * scale);
		const canvas = document.createElement('canvas');
		canvas.width = finalWidth;
		canvas.height = finalHeight;
		const ctx = canvas.getContext('2d', { alpha: true })!;
		ctx.imageSmoothingEnabled = false;

		const buffer = new Uint8Array(framesData.length * finalWidth * finalHeight * 2);
		const writer = new GifWriter(buffer, finalWidth, finalHeight, { loop: 0 });

		let timeDebt = 0;

		for (let i = 0; i < framesData.length; i++) {
			ctx.clearRect(0, 0, finalWidth, finalHeight);
			if (bgColor !== 'transparent') {
				ctx.fillStyle = bgColor;
				ctx.fillRect(0, 0, finalWidth, finalHeight);
			}

			const frameData = framesData[i];
			for (let j = 0; j < frameData.length; j++) {
				const val = frameData[j];
				if (val === 0) continue;
				const color = ColorLogic.uint32ToHex(val)!;
				const x = j % width;
				const y = Math.floor(j / width);
				const px = Math.floor(x * scale);
				const py = Math.floor(y * scale);
				const pw = Math.ceil(scale);
				const ph = Math.ceil(scale);

				ctx.fillStyle = color;
				ctx.fillRect(px, py, pw, ph);

				if (includeBorders) {
					ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
					ctx.lineWidth = 1;
					ctx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
				}
			}

			const imageData = ctx.getImageData(0, 0, finalWidth, finalHeight).data;
			const { indexedPixels, palette } = this.quantizeFrame(imageData);

			// Calculate delay with time debt correction
			const totalTargetMs = frameDurations[i] + timeDebt;
			const delayCentiSec = Math.max(1, Math.round(totalTargetMs / 10));
			timeDebt = totalTargetMs - delayCentiSec * 10;

			writer.addFrame(0, 0, finalWidth, finalHeight, indexedPixels, {
				palette: palette,
				delay: delayCentiSec
			});

			await new Promise((r) => setTimeout(r, 0));
		}

		const usedBuffer = buffer.slice(0, writer.end());
		return new Blob([usedBuffer], { type: 'image/gif' });
	}

	/**
	 * Simple color quantizer for GIF.
	 */
	private static quantizeFrame(data: Uint8ClampedArray): {
		indexedPixels: number[];
		palette: number[];
	} {
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
}
