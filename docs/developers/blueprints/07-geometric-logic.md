---
Status: Finalized (v0.6.0)
---

# Blueprint 07: Geometric Logic

## 1. Executive Summary

This blueprint defines the transition from manual pixel placement to geometric-assisted creation in **Rupa Pixel Editor**. It focus on high-performance rendering and automated shape correction (Latte Correction).

---

## 2. Technical Engine (PixelEngine)

The logic is centralized in `src/lib/engine/pixel.ts` (PixelEngine), which coordinates with the `Logic Layer` (`src/lib/logic/`).

### 2.1 Assisted Drawing

| Feature | Description | Logic Location |
| :--- | :--- | :--- |
| **Shape Snapping** | Hold pointer to convert paths to perfect forms. | `PixelEngine.fitArc` |
| **Bresenham Line** | Pixel-perfect line interpolation. | `Geometry.getLinePoints` |
| **Smoothing** | Moving average for organic strokes. | `Path.smooth` |

---

## 3. Implementation Success

1.  **PixelEngine:** High-performance orchestrator for pixel math.
2.  **Logic Layer Separation:** Moved all math to side-effect-free classes (`Geometry`, `Path`).
3.  **UI Feedback:** Integrated real-time SVG previews for snapped shapes.
