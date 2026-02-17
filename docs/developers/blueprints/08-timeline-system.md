# Blueprint 08: Timeline System

## 1. Executive Summary

Blueprint 08 defines the animation system (The Flow), transforming the Project into a temporal sequence. It introduces timeline orchestration, onion skinning, and frame-based export.

---

## 2. Technical Components

- **Engine:** `AnimationEngine` in `src/lib/engine/animation.svelte.ts`.
- **Logic:** `AnimationLogic` in `src/lib/logic/animation.ts`.
- **State:** `FrameState.duration` property.

---

## 3. Core Mechanics

### 3.1 Playback (The Pulse)

- **Loop Logic:** Managed by `AnimationEngine.tick()`.
- **UI:** Horizontal track view in `TimelineView.svelte`.

### 3.2 Onion Skinning (Ghost Infusions)

- **Technical Detail:** Renders previous and next frames with reduced opacity on the Canvas.
- **Toggle:** Managed via `editor.studio.showGhostLayers`.

---

## 4. Animation Export

- **Formats:** Support for GIF, Animated SVG, and Video.
- **Service:** Handled by `ExportEngine` in `src/lib/engine/export.ts`.
