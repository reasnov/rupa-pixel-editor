# Blueprint 07: The Swift Weaver (Stitch Mode Refinement)

## 1. Executive Summary

This blueprint refines the **Stitch Mode** (Image/Static Editing) to minimize physical fatigue and maximize drawing speed. It introduces automated filling, global recoloring, and pixel-perfect selection logic.

---

## 2. Terminology & Core Modes

Rupa operates in two distinct operational states:

1. **Stitch Mode** (The Still Weave): Focused on pixel-perfect static images and motifs.
2. **Kinetic Mode** (The Moving Weave): Focused on the temporal sequence of frames and motion.

---

## 3. Stitch Mode Mechanics (Static)

### 3.1 Advanced Tools

| Technical Term | Artisan Term     | Action                                                                   |
| :------------- | :--------------- | :----------------------------------------------------------------------- |
| **Flood Fill** | **Dye Soak**     | `F` - Spread dye to connected fibers of the same tone.                   |
| **Recolor**    | **Fiber Bleach** | `Alt + R` - Instantly transmute every instance of a pigment in the veil. |
| **Magic Wand** | **Spirit Pick**  | `W` - Select a motif based on color resonance.                           |

### 3.2 Artifact Creation (Image Export)

In **Stitch Mode**, the studio exports permanent static artifacts:

- **Vector**: SVG (Scalable Vector Graphics).
- **Raster**: PNG (Lossless), JPG (Compressed), WEBP (Modern Web Standard).

---

## 4. Implementation Goals (v0.5.0)

1. Complete the transition of selection logic from "Rectangular" to "Motif-based" (Arbitrary Pixels).
2. Ensure all automation tools respect the **Active Loom** (Current Selection).
3. Implement WEBP and JPG support in the **Artifact Crate**.
