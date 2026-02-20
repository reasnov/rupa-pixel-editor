# Blueprint 09: Advanced Drawing & Precision Tools (The Master Etcher)

## 1. Executive Summary

Blueprint 09 defines the "Master Etcher's Kit"—a suite of professional-grade tools designed for industrial-speed creation within the **Keyboard-First, Mouse-Friendly** paradigm. Every advanced tool is mapped to a semantic **ActionIntent**, allowing baristas to toggle symmetry, adjust brush dynamics, and apply shading without ever lifting their hands from the home row.

---

## 2. Mirror Symmetry (Reflective Brewing)

Symmetry is treated as a "Stance" that modifies the outcome of the `PAINT` and `ERASE` intents.

### 2.1 Keyboard Orchestration

- **Intent:** `CYCLE_SYMMETRY`
- **Primary Shortcut:** `S` (Cycles: Off -> Horizontal -> Vertical -> Quadrant)
- **Visual Feedback:** The **TechLedger** (Status Bar) displays the active axis icon.
- **Precision:** When moving the cursor with **Arrow Keys**, the reflected "ghost pixels" are calculated and rendered in real-time.

---

## 3. The Grinder (Dynamic Brush Engine)

The brush is no longer a static pixel but a dynamic "Kernel" that follows the cursor's focus.

### 3.1 Keyboard Orchestration

- **Size Adjustment:** `[` (Decrease), `]` (Increase).
- **Shape Toggle:** `Alt + B` (Cycles: Square -> Circle).
- **Conflict Resolution:** To accommodate the new Brush Size shortcuts, **Layer Reordering** is migrated from `[`/`]` to `Alt + [`/`Alt + ]` (See Section 9: Shortcut Migration).

### 3.2 Technical Logic

- **Module:** `BrushLogic.getKernel(size, shape)`
- **Optimization:** Kernels are pre-calculated and cached to ensure zero-latency movement.

---

## 4. The Roast (Shading & Toning Mode)

Shading is implemented as a **Toggle Stance**, allowing baristas to focus on the stroke without holding modifiers.

### 4.1 Orchestration

- **Lighten (Highlight):** Toggle `L`.
- **Darken (Shadow):** Toggle `D`.
- **Dither (Texture):** Toggle `X`.
- **Behavior:** Toggling one shading mode automatically deactivates other active shading modes to ensure flavor purity.
- **Architectural Note:** The `isShading...` states are managed in `StudioState` as reactive runes.

---

## 5. The Seal (Alpha & Color Lock)

Protection mechanisms to maintain the purity of complex compositions.

### 5.1 Orchestration

- **Alpha Lock Toggle:** `A` (Only affects non-transparent pixels).
- **Color Lock Toggle:** `Shift + A` (Only affects pixels matching the color under the cursor at the start of the stroke).
- **Visual Indicator:** The **Cursor** displays a "Locked" icon (Small padlock) when active.

---

## 6. Infinite Pour (Seamless Tiling)

A global environment modification for pattern creation.

### 6.1 Orchestration

- **Toggle Tiling:** `T`
- **Interaction:** When the cursor moves past `width - 1`, it wraps to `0`.
- **Preview Stance:** Press `Shift + T` to toggle a 3x3 "Tiled Mirror" of the canvas.
- **Optimization:** The preview utilizes CSS `background-repeat: repeat` on the canvas container to avoid redundant draw calls for the 8 surrounding clones.

---

## 7. Architectural Requirements (v0.8.0)

### 7.1 State Layer

`StudioState` must manage the following runes to ensure UI reactivity:

- `brushSize`, `brushShape`, `symmetryMode`, `alphaLocked`, `tilingEnabled`.

### 7.2 Service Layer (DrawService Orchestration)

The drawing pipeline must process intents in this order:

1. **Intake:** Receive base coordinate (Keyboard or Mouse).
2. **Expansion:** Apply **Brush Kernel**.
3. **Reflection:** Apply **Symmetry** to the kernel.
4. **Wrapping:** Apply **Modulo** if Tiling is active.
5. **Filtration:** Remove points blocked by **Alpha/Color Lock** or **Selection Mask**.
6. **Application:** Apply color/shading and commit to `history`.

---

## 8. Shortcut Migration Map (The Great Re-Binding)

To maintain consistency and professional standards, the following mappings are finalized for v0.8.0:

| Feature             | New Intent          | Primary Key | Migration From    |
| :------------------ | :------------------ | :---------- | :---------------- |
| **Brush Size -**    | `BRUSH_SIZE_DEC`    | `[`         | `MOVE_LAYER_UP`   |
| **Brush Size +**    | `BRUSH_SIZE_INC`    | `]`         | `MOVE_LAYER_DOWN` |
| **Move Layer Up**   | `MOVE_LAYER_UP`     | `Alt + [`   | `[`               |
| **Move Layer Down** | `MOVE_LAYER_DOWN`   | `Alt + ]`   | `]`               |
| **Symmetry Cycle**  | `CYCLE_SYMMETRY`    | `s`         | -                 |
| **Tiling Toggle**   | `TOGGLE_TILING`     | `t`         | -                 |
| **Alpha Lock**      | `TOGGLE_ALPHA_LOCK` | `a`         | -                 |
| **Color Lock**      | `TOGGLE_COLOR_LOCK` | `Shift + a` | -                 |
| **Highlight**       | `SHADE_LIGHTEN`     | `l`         | -                 |
| **Shadow**          | `SHADE_DARKEN`      | `d`         | -                 |
| **Dither**          | `SHADE_DITHER`      | `x`         | -                 |

---

## 9. Wave II: Purity & Structure (Advanced Additions)

As the studio evolves, Wave II focuses on structural integrity and tracing precision.

### 9.1 The Clean Pour (Pixel-Perfect Lines)

A specialized drawing algorithm that prevents "double-pixel" corners during freehand strokes.

- **Orchestration:** Toggle with **`P`**.
- **Logic:** `PixelLogic.pixelPerfectFilter()` removes redundant pixels from a stroke buffer where a 2x2 cluster would be formed.
- **Visual:** The TechLedger shows a "✨ PURE" indicator when active.

### 9.2 Geometric Vessels (Box & Round Pouring)

Keyboard-centric shape creation.

- **Orchestration:**
  - **Rectangle:** `Alt + R` (Enter to start, move Arrows, Enter to commit).
  - **Ellipse:** `Alt + C` (Enter to start, move Arrows, Enter to commit).
- **Stance:** The studio enters a "Geometric Stance" where the cursor shows a ghost outline of the shape before committing.

### 9.3 The Underlay (Reference Trace)

Support for background reference images to assist in tracing complex sketches.

- **Orchestration:** `Alt + U` to open the Underlay Crate (Upload).
- **Control:** `Ctrl + Alt + U` to toggle visibility; `Ctrl + Alt + Arrows` to nudge the underlay position.
- **Rendering:** The image is rendered with a variable "Vapor Opacity" (Default 20%) behind the grid.

---

## 10. Updated Shortcut Migration Map

| Feature             | New Intent             | Primary Key        | Group   |
| :------------------ | :--------------------- | :----------------- | :------ |
| **Pixel-Perfect**   | `TOGGLE_PIXEL_PERFECT` | `p`                | Etching |
| **Rectangle Tool**  | `TOOL_RECTANGLE`       | `Alt + r`          | Magic   |
| **Ellipse Tool**    | `TOOL_ELLIPSE`         | `Alt + c`          | Magic   |
| **Underlay Toggle** | `TOGGLE_UNDERLAY`      | `Ctrl + Alt + u`   | View    |
| **Underlay Crate**  | `OPEN_UNDERLAY_MENU`   | `Alt + u`          | Crates  |
| **Mute Audio**      | `TOGGLE_MUTE`          | `Ctrl + Shift + m` | System  |
| **Polygon Indent+** | `POLY_INDENT_INC`      | `Alt + Shift + ]`  | Etching |
| **Polygon Indent-** | `POLY_INDENT_DEC`      | `Alt + Shift + [`  | Etching |

---

## 11. Wave III: Texture & Flow (Professional Mastery)

Wave III introduces high-level manipulation and organic blending to the studio.

### 11.1 The Aroma Blend (Dither Blending)

Professional-grade color transitions integrated directly into the brush engine.

- **Orchestration:** `Alt + G` (Toggle Aroma Blend).
- **Mechanism:** Utilizes a **4x4 Bayer Matrix** for ordered dithering.
- **Control:** The **Frothiness (Hardness)** slider determines the density falloff towards the brush edges.
- **Fidelity:** Creates perfect checkerboard patterns at 50% density, ideal for pixel art shading that looks smooth when zoomed out.

### 11.2 Pattern Etching (Custom Stencils)

Use a copied selection as a brush tip for repeating complex motifs.

- **Orchestration:** `Ctrl + Alt + B` to "Load Swatch into Vessel."
- **Behavior:** The current clipboard data is used as the brush kernel, allowing for "stamp" style painting.

### 11.3 Kinetic Transformation (Focus Manipulation)

Move and scale selected pixels without using the clipboard.

- **Orchestration:** `M` (Move Mode) while selection is active.
- **Control:** Arrows to nudge selection; `Alt + Arrows` to stretch/scale.
- **Visual:** A Magenta transform box with handles appears around the selection.

---

## 12. Updated Shortcut Migration Map (Wave I - III)

| Feature             | New Intent             | Primary Key      | Group   |
| :------------------ | :--------------------- | :--------------- | :------ |
| **Pixel-Perfect**   | `TOGGLE_PIXEL_PERFECT` | `p`              | Etching |
| **Rectangle Tool**  | `TOOL_RECTANGLE`       | `Alt + r`        | Magic   |
| **Ellipse Tool**    | `TOOL_ELLIPSE`         | `Alt + c`        | Magic   |
| **Underlay Toggle** | `TOGGLE_UNDERLAY`      | `Ctrl + Alt + u` | View    |
| **Classic Blend**   | `TOGGLE_DITHER_BLEND`  | `Alt + g`        | Magic   |
| **Pattern Brush**   | `TOGGLE_PATTERN_BRUSH` | `Ctrl + Alt + b` | Etching |
| **Transform Mode**  | `TOOL_TRANSFORM`       | `m`              | Edit    |

---

## 13. UX Performance Goals

- **Gradient Throughput:** Interpolation must be calculated using a fast bitwise operation or a lookup table to ensure large fills don't block the UI thread.
- **Pattern Stability:** Pattern brushes with sizes > 32x32 must be automatically downscaled or warned to prevent memory spikes during high-speed painting.
