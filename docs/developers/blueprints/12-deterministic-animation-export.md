# Blueprint 12: Deterministic Animation Export (The Chronos Protocol)

## 1. Executive Summary

This blueprint addresses critical failures in the **Export Engine** regarding time-based artifacts (Video and Animated GIF). The current "Real-Time Recording" approach results in jittery (choppy) animations, 00:00 duration videos, and unplayable files. We propose a shift to **Deterministic Frame Assembly**, ensuring every frame is captured with 100% precision, independent of system performance or browser scheduling.

---

## 2. Problem Analysis

### 2.1 The "Jitter" Problem (Choppy Animation)

Current exports rely on `setTimeout` for frame transitions. `setTimeout` is not a high-precision timer and is subject to event loop delays. When recording at 30fps (33.3ms intervals), a 2ms delay in the timer causes a frame-rate mismatch, perceived as a "stutter."

### 2.2 The "Empty Vessel" Problem (00:00 Duration)

`MediaRecorder` with `canvas.captureStream(30)` is a "passive" recorder. If the browser does not trigger a paint flush on the off-screen canvas (which happens often in Electron's background processes), the recorder receives no data. The resulting file contains headers but zero frame data.

### 2.3 The "Lost in Time" Problem (Unplayable Files)

Chromium's `MediaRecorder` does not write the duration metadata in the EBML (WebM) or MP4 header during live streaming. This makes the file "unseekable" and unplayable in many professional media players.

---

## 3. The Chronos Protocol: Proposed Solution

### 3.1 Deterministic Frame Assembly (Manual Triggering)

Instead of a live "recording of a performance," we will move to a "sequenced assembly":

1.  **Initialize Stream at 0 FPS**: Use `canvas.captureStream(0)`. This prevents the browser from automatically sampling frames.
2.  **Explicit Request**: For every frame in the project:
    - Render the frame to the `ExportCanvas`.
    - Force a context flush using `ctx.getImageData` (to ensure the GPU/Buffer is updated).
    - Manually call `videoTrack.requestFrame()`.
3.  **Frame Handshake**: Implement a micro-delay (1-2ms) or wait for a `requestAnimationFrame` to ensure the `MediaRecorder` has ingested the frame before moving to the next one.

### 3.2 Accumulated Error Correction (GIF Timing)

GIF frame delays are stored in centiseconds (10ms units).

- **Old Approach**: `Math.round(ms / 10)` creates significant drift.
- **New Approach**: Maintain a `timeDebt` variable. If a frame needs 15ms, we give it 10ms and carry over 5ms to the next frame. This ensures the total duration of the animation remains mathematically perfect.

### 3.3 The EBML Metadata Injector (Video Seekability)

For WebM exports, we will implement a post-processing step:

- After the `MediaRecorder` stops, parse the resulting `Blob`.
- Inject the total duration into the EBML metadata header.
- This ensures the video is immediately playable and seekable in all OS-level players.

### 3.4 The "Visible Buffer" Strategy

To prevent Chromium from optimizing away (throttling) the off-screen canvas:

- Briefly attach the `ExportCanvas` to a hidden (but active) `div` in the DOM during the export process.
- This ensures the browser treats the canvas as a "priority rendering surface," ensuring `captureStream` receives every pixel update.

---

## 4. Technical Implementation Plan

### 4.1 Phase 1: Engine Refactor

- Modify `ExportEngine.toVideo` to use manual frame requests.
- Replace `setTimeout` loops with a `for...of` loop using `await` for frame-ready signals.

### 4.2 Phase 2: Metadata Integration

- Integrate a lightweight EBML writer or manual duration injection logic.
- Verify video headers using `ffprobe` or a standard media player.

### 4.3 Phase 3: GIF Optimization

- Refactor `toGIF` to use the `timeDebt` accumulation logic.

---

## 5. Success Criteria

1.  **Video Playback**: Exported WebM/MP4 files must show correct duration (e.g., 00:05) and be playable in VLC and QuickTime.
2.  **Temporal Accuracy**: A 10-second animation at 10fps must result in exactly 100 frames with a total duration of 10,000ms (+/- 10ms).
3.  **Zero Dropped Frames**: No frame skips, even if the user's CPU is under heavy load during export.
