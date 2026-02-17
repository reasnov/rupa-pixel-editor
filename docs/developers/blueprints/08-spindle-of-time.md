# Blueprint 08: The Timeline of Time (Kinetic Mode Engine)

## 1. Executive Summary

This blueprint defines the **Kinetic Mode** (Motion/Video Editing), transforming the Project into a temporal sequence. It introduces timeline orchestration, onion skinning, and motion-based export formats.

---

## 2. Terminology & Metaphors

| Technical Term     | Barista Term      | Philosophy                                          |
| :----------------- | :---------------- | :-------------------------------------------------- |
| **Motion Mode**    | **Kinetic Mode**  | The weave in motion; breathing life into the pattern. |
| **Timeline**       | **The Timeline**   | The axis around which the thread of time is wound.  |
| **Playback**       | **The Pulse**     | The studio's heartbeat governing movement.          |
| **Onion Skinning** | **Ghost Threads** | Traces of patterns from the past and future.          |

---

## 3. Kinetic Mode Mechanics (Temporal)

### 3.1 The Timeline (Timeline Orchestrator)

- **Visuals**: A horizontal ledger of **Frames**.
- **Orchestration**: Assigning `duration` (in milliseconds) to each frame.
- **Pulse Control**: Play/Pause (`P`), Loop, and Weave Pace (FPS).

### 3.2 Ghost Threads (Onion Skinning)

- Visualizing frame `n-1` and `n+1` with low density (opacity) to guide the barista's hand.

### 3.3 Artifact Creation (Motion Export)

In **Kinetic Mode**, the studio exports the living weave:

- **Animated Vector**: **SVG** (utilizing SMIL or CSS animations for lightweight motion).
- **Video**: **MP4** (Universal), **WebM** (Optimized for the web).
- **Raster Animation**: **GIF** (Classic Pixel Art format), **Sprite Sheet** (PNG Atlas).

---

## 4. Implementation Goals (v0.6.0+)

1. Construct **The Timeline** UI panel with horizontal scrolling.
2. Implement composite rendering for **Ghost Threads** in the Canvas.
3. Integrate an animation-capable export engine (GIF and WebM focus).
