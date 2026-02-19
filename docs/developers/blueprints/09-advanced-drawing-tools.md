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

Shading is implemented as a **Chorded Intent** using held-key modifiers.

### 4.1 Orchestration

- **Lighten (Highlight):** Hold `L` + Move/Click.
- **Darken (Shadow):** Hold `D` + Move/Click.
- **Dither (Texture):** Hold `X` + Move/Click.
- **Keyboard Engine Upgrade:** The `KeyboardEngine` must be expanded to expose reative `isLDown`, `isDDown`, and `isXDown` states, as these are not standard system modifiers.

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

| Feature              | New Intent          | Primary Key | Migration From    |
| :------------------- | :------------------ | :---------- | :---------------- |
| **Brush Size -**     | `BRUSH_SIZE_DEC`    | `[`         | `MOVE_LAYER_UP`   |
| **Brush Size +**     | `BRUSH_SIZE_INC`    | `]`         | `MOVE_LAYER_DOWN` |
| **Move Layer Up**    | `MOVE_LAYER_UP`     | `Alt + [`   | `[`               |
| **Move Layer Down**  | `MOVE_LAYER_DOWN`   | `Alt + ]`   | `]`               |
| **Symmetry Cycle**   | `CYCLE_SYMMETRY`    | `s`         | -                 |
| **Tiling Toggle**    | `TOGGLE_TILING`     | `t`         | -                 |
| **Alpha Lock**       | `TOGGLE_ALPHA_LOCK` | `a`         | -                 |
| **Color Lock**       | `TOGGLE_COLOR_LOCK` | `Shift + a` | -                 |
| **Highlight (Held)** | `SHADE_LIGHTEN`     | `l`         | -                 |
| **Shadow (Held)**    | `SHADE_DARKEN`      | `d`         | -                 |
| **Dither (Held)**    | `SHADE_DITHER`      | `x`         | -                 |

---

## 9. UX Performance Goals

- **Consistency:** Keyboard-driven `MOVE + PAINT` (holding `Ctrl + Arrows`) must feel as fluid as a Mouse drag.
- **Resonance:** Each advanced tool should have a distinct, subtle "paper-click" sound provided by the **FeedbackEngine**.
