import { describe, it, expect } from 'vitest';
import { EbmlLogic } from '../../lib/logic/ebml.js';

describe('EbmlLogic', () => {
	it('injectMetadata should insert duration before the first cluster', async () => {
		// Mock WebM buffer
		// Segment (0x18538067)
		//   Info (0x1549A966)
		//   Cluster (0x1F43B675)
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
			0xee // Data
		]);

		const blob = new Blob([mockBuffer], { type: 'video/webm' });
		const durationMs = 1234.56;

		const patchedBlob = await EbmlLogic.injectMetadata(blob, durationMs);
		const patchedBuffer = await patchedBlob.arrayBuffer();
		const uint8 = new Uint8Array(patchedBuffer);

		// 1. Verify it's larger now (3 + 8 bytes for duration tag)
		expect(uint8.length).toBe(mockBuffer.length + 11);

		// 2. Find the duration tag (0x4489)
		const durationTagIndex = Array.from(uint8).findIndex(
			(b, i) => b === 0x44 && uint8[i + 1] === 0x89
		);
		expect(durationTagIndex).not.toBe(-1);

		// 3. Verify duration value (Float64 at durationTagIndex + 3)
		const view = new DataView(patchedBuffer);
		const foundDuration = view.getFloat64(durationTagIndex + 3, false);
		expect(foundDuration).toBe(durationMs);

		// 4. Verify Cluster tag still exists after duration
		const clusterIndex = Array.from(uint8).findIndex(
			(b, i) =>
				b === 0x1f && uint8[i + 1] === 0x43 && uint8[i + 2] === 0xb6 && uint8[i + 3] === 0x75
		);
		expect(clusterIndex).toBeGreaterThan(durationTagIndex);
	});

	it('injectMetadata should return original blob if tags are missing', async () => {
		const mockBuffer = new Uint8Array([0x00, 0x11, 0x22]);
		const blob = new Blob([mockBuffer], { type: 'video/webm' });
		const patchedBlob = await EbmlLogic.injectMetadata(blob, 5000);

		const patchedBuffer = await patchedBlob.arrayBuffer();
		expect(new Uint8Array(patchedBuffer)).toEqual(mockBuffer);
	});

	it('fixDuration should update existing duration if present', async () => {
		// Buffer with existing Duration tag (0x4489)
		const mockBuffer = new Uint8Array([
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
			0x00,
			0x00,
			0x00,
			0x00,
			0x00,
			0x00,
			0x00,
			0x00 // Empty value
		]);

		const blob = new Blob([mockBuffer], { type: 'video/webm' });
		const durationMs = 9999.9;

		const patchedBlob = await EbmlLogic.fixDuration(blob, durationMs);
		const patchedBuffer = await patchedBlob.arrayBuffer();
		const view = new DataView(patchedBuffer);

		const foundDuration = view.getFloat64(11, false);
		expect(foundDuration).toBe(durationMs);
	});
});
