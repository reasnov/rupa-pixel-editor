import { ColorLogic } from '../logic/color.js';
import ExportWorker from './workers/export.worker?worker';

export class ExportEngine {
	/**
	 * Runs cluster tracing in a background worker to prevent UI blocking.
	 */
	private static async runWorkerTask(
		type: string,
		payload: any,
		onProgress?: (p: number) => void
	): Promise<any> {
		return new Promise((resolve, reject) => {
			const worker = new ExportWorker();

			worker.onmessage = (e) => {
				const { type: resType, payload: resPayload } = e.data;
				if (resType === 'PROGRESS' && onProgress) {
					onProgress(resPayload);
				} else if (resType === 'DONE') {
					worker.terminate();
					resolve(resPayload);
				}
			};

			worker.onerror = (err) => {
				worker.terminate();
				reject(err);
			};

			worker.postMessage({ type, payload });
		});
	}

	/**
	 * Generates an optimized SVG string.
	 */
	static async toSVG(
		width: number,
		height: number,
		data: Uint32Array,
		bgColor: string | 'transparent' = 'transparent',
		includeBorders = false,
		onProgress?: (p: number) => void
	): Promise<string> {
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`;

		if (bgColor !== 'transparent') {
			svg += `<rect width="${width}" height="${height}" fill="${bgColor}" />`;
		}

		if (includeBorders) {
			data.forEach((val, i) => {
				if (val === 0) return;
				const color = ColorLogic.uint32ToHex(val);
				const x = i % width;
				const y = Math.floor(i / width);
				svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="0.05" />`;
			});
			if (onProgress) onProgress(1);
		} else {
			// Offload tracing to worker
			const clusters: Array<{ color: string; pathData: string }> = await this.runWorkerTask(
				'TRACE_CLUSTERS',
				{ width, data },
				onProgress
			);

			clusters.forEach(({ color, pathData }) => {
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
	static async toAnimatedSVG(
		width: number,
		height: number,
		framesData: Uint32Array[],
		frameDurations: number[],
		bgColor: string | 'transparent' = 'transparent',
		includeBorders = false,
		onProgress?: (p: number) => void
	): Promise<string> {
		const totalDurationMs = frameDurations.reduce((a, b) => a + b, 0);
		const totalDurationSec = (totalDurationMs / 1000).toFixed(3);

		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`;

		if (bgColor !== 'transparent') {
			svg += `<rect width="${width}" height="${height}" fill="${bgColor}" />`;
		}

		let elapsedMs = 0;
		for (let i = 0; i < framesData.length; i++) {
			const data = framesData[i];
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
				// Offload tracing to worker for each frame
				const clusters: Array<{ color: string; pathData: string }> = await this.runWorkerTask(
					'TRACE_CLUSTERS',
					{ width, data }
				);

				clusters.forEach(({ color, pathData }) => {
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
			if (onProgress) onProgress((i + 1) / framesData.length);
		}

		svg += '</svg>';
		return svg;
	}

	/**
	 * Renders a sequence of frames to a video Blob.
	 */
	static async toVideo(
		width: number,
		height: number,
		framesData: Uint32Array[],
		frameDurations: number[],
		scale: number,
		format: 'webm' | 'mp4' = 'webm',
		bgColor: string | 'transparent' = 'transparent',
		includeBorders = false,
		onProgress?: (p: number) => void
	): Promise<Blob> {
		const canvas = document.createElement('canvas');
		const finalWidth = Math.round(width * scale);
		const finalHeight = Math.round(height * scale);
		canvas.width = finalWidth;
		canvas.height = finalHeight;

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
			recorder.onstop = async () => {
				document.body.removeChild(canvas);
				const rawBlob = new Blob(chunks, { type: mimeType });

				try {
					const { EbmlLogic } = await import('../logic/ebml.js');
					const totalDuration = frameDurations.reduce((a, b) => a + b, 0);
					const fixedBlob = await EbmlLogic.injectMetadata(rawBlob, totalDuration);
					resolve(fixedBlob);
				} catch (e) {
					console.warn('Metadata injection failed:', e);
					resolve(rawBlob);
				}
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
				ctx.getImageData(0, 0, 1, 1);
			};

			(async () => {
				await new Promise((r) => setTimeout(r, 200));

				for (let i = 0; i < framesData.length; i++) {
					drawFrame(i);
					if (track && (track as any).requestFrame) {
						(track as any).requestFrame();
					}
					await new Promise((r) => setTimeout(r, frameDurations[i]));
					if (onProgress) onProgress((i + 1) / framesData.length);
				}

				await new Promise((r) => setTimeout(r, 500));
				recorder.stop();
				stream.getTracks().forEach((t: any) => t.stop());
			})();
		});
	}

	/**
	 * Generates a GIF.
	 */
	static async toGIF(
		width: number,
		height: number,
		framesData: Uint32Array[],
		frameDurations: number[],
		scale: number,
		bgColor: string | 'transparent' = 'transparent',
		includeBorders = false,
		onProgress?: (p: number) => void
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
		const writer = new (GifWriter as any)(buffer, finalWidth, finalHeight, { loop: 0 });

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
			const { indexedPixels, palette } = await this.runWorkerTask('QUANTIZE_FRAME', { imageData });

			const totalTargetMs = frameDurations[i] + timeDebt;
			const delayCentiSec = Math.max(1, Math.round(totalTargetMs / 10));
			timeDebt = totalTargetMs - delayCentiSec * 10;

			writer.addFrame(0, 0, finalWidth, finalHeight, indexedPixels, {
				palette: palette,
				delay: delayCentiSec
			});

			if (onProgress) onProgress((i + 1) / framesData.length);
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
