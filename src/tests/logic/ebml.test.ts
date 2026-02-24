import { describe, it, expect } from 'vitest';
import { EbmlLogic } from '../../lib/logic/ebml.js';

describe('EbmlLogic', () => {
	const mockBuffer = new Uint8Array([
		0x18,
		0x53,
		0x80,
		0x67, // Segment
		0x00,
		0x00,
		0x00,
		0x20, // Size
		0x15,
		0x49,
		0xa9,
		0x66, // Info
		0x00,
		0x00,
		0x00,
		0x10, // Size
		0x1f,
		0x43,
		0xb6,
		0x75, // Cluster
		0x00,
		0x00,
		0x00,
		0x05, // Size
		0xaa,
		0xbb,
		0xcc,
		0xdd,
		0xee
	]);

	describe('injectMetadata', () => {
		it('should insert duration before the first cluster', async () => {
			const blob = new Blob([mockBuffer], { type: 'video/webm' });
			const durationMs = 1234.56;

			const patchedBlob = await EbmlLogic.injectMetadata(blob, durationMs);
			const patchedBuffer = await patchedBlob.arrayBuffer();
			const uint8 = new Uint8Array(patchedBuffer);

			// Find duration tag 0x4489
			const tagIdx = Array.from(uint8).findIndex((b, i) => b === 0x44 && uint8[i + 1] === 0x89);
			expect(tagIdx).not.toBe(-1);

			const view = new DataView(patchedBuffer);
			expect(view.getFloat64(tagIdx + 3, false)).toBe(durationMs);
		});

		it('should return original blob if tags are missing', async () => {
			const badBuffer = new Uint8Array([0, 1, 2]);
			const blob = new Blob([badBuffer], { type: 'video/webm' });
			const result = await EbmlLogic.injectMetadata(blob, 1000);
			const resultBuffer = await result.arrayBuffer();
			expect(new Uint8Array(resultBuffer)).toEqual(badBuffer);
		});
	});

	describe('fixDuration', () => {
		it('should update existing duration if present', async () => {
			const withDuration = new Uint8Array([
				0x18,
				0x53,
				0x80,
				0x67, // Segment
				0x15,
				0x49,
				0xa9,
				0x66, // Info
				0x44,
				0x89,
				0x88, // Duration Tag + Size(8)
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0 // Empty Float64
			]);
			const blob = new Blob([withDuration], { type: 'video/webm' });
			const durationMs = 5000;

			const patched = await EbmlLogic.fixDuration(blob, durationMs);
			const buffer = await patched.arrayBuffer();
			const view = new DataView(buffer);
			expect(view.getFloat64(11, false)).toBe(durationMs);
		});

		it('should return original if Segment is missing', async () => {
			const blob = new Blob([new Uint8Array([1, 2, 3])]);
			const result = await EbmlLogic.fixDuration(blob, 1000);
			const buffer = await result.arrayBuffer();
			expect(new Uint8Array(buffer).length).toBe(3);
		});

		it('should return original if Info is missing inside Segment', async () => {
			const noInfo = new Uint8Array([0x18, 0x53, 0x80, 0x67, 0, 0, 0, 0]);
			const blob = new Blob([noInfo]);
			const result = await EbmlLogic.fixDuration(blob, 1000);
			const buffer = await result.arrayBuffer();
			expect(new Uint8Array(buffer)).toEqual(noInfo);
		});
	});
});
