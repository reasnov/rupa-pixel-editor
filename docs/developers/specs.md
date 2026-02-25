# Technical Specifications: Rupa Pixel Editor

## 1. Grid Mechanics

- **Canvas Size:** Default 32x32.
- **Coordinate System:**
  - **Internal:** Zero-indexed flat array (`y * width + x`).
  - **Display (HUD):** Center-relative (Cartesian).
    - For even dimensions, there is no zero-row/column (jumps from -1 to 1).
    - For odd dimensions, the center is (0,0).
- **Pixel Data:** Hex color strings (`ColorHex`).
- **Empty State:** Studio-specific cream `#eee8d5`.

## 2. Intent Schema

Every interaction is mapped to a `ActionIntent` to ensure semantic consistency. Intents are triggered by the **Keyboard** or the **Pointer Engine**.

### 2.1 Navigation & Viewport

- `MOVE_UP`, `MOVE_DOWN`, `MOVE_LEFT`, `MOVE_RIGHT`: Keyboard-driven step movement.
- `SET_POSITION`: Pointer-driven absolute positioning.
- `JUMP_HOME`: Reset position to center (**`Ctrl + H`**).
- `GOTO`: Jump to specific coordinate (**`Alt + J`**).
- `PAN_VIEWPORT`: Free-form canvas panning (**`Q`**).
- `ZOOM_IN`, `ZOOM_OUT`: Control viewport scale (**`+`** and **`-`**).
- `TOGGLE_MINIMAP`: Show/Hide the **Minimap** (**`Ctrl + M`**).

### 2.2 Painting & Etching (Drawing Tools)

- `PAINT`: Apply color (Space/Enter/Click).
- `ERASE`: Remove color (Backspace/Delete/Right-click or **`E`**).
- `TOOL_BRUSH`: Activate Brush tool (**`B`**).
- `BRUSH_SIZE_INC`, `BRUSH_SIZE_DEC`: Adjust brush diameter (**`[`** and **`]`**).
- `TOGGLE_BRUSH_SHAPE`: Switch between Square and Circle vessels (**`Alt + B`**).
- `TOGGLE_AIRBRUSH`: Enable 'The Mist' spray mode (**`Alt + A`**).
- `CYCLE_SYMMETRY`: Toggle Horizontal, Vertical, and Quadrant symmetry (**`V`**).
- `TOGGLE_TILING`: Enable seamless coordinate wrapping (**`T`**).
- `TOGGLE_PIXEL_PERFECT`: Automated line cleaning (**`Shift + P`**).
- `SHADE_LIGHTEN`, `SHADE_DARKEN`, `SHADE_DITHER`: Real-time color modification (**`U`**, **`D`**, **`X`**).
- `TOGGLE_ALPHA_LOCK`, `TOGGLE_COLOR_LOCK`: Pixel protection modes (**`A`**, **`Shift + A`**).
- `BIND_VERTEX`, `SEAL_BINDING`: Polygon construction steps.

### 2.3 Manipulation & Magic

- `UNDO`, `REDO`: History traversal (**`Ctrl + Z`**, **`Ctrl + Y`**).
- `FLOOD_FILL`: Connected color fill (**`F`**).
- `RECOLOR`: Global color replacement (**`Alt + R`**).
- `SELECT_ALL`: Two-step selection (Layer -> Frame) (**`Ctrl + A`**).
- `SELECT_SAME`: Magic Wand selection (**`W`**). Supports **Smart Hole-Filling** on repeat click.
- `TOOL_RECT_SELECT`: Rectangle selection tool (**`S`**).
- `TOOL_LASSO_SELECT`: Freehand lasso selection tool (**`L`**).
- `TOOL_POLY_SELECT`: Polygon selection tool (**`Alt + L`**).
- `TOGGLE_DITHER_BLEND`: Professional dithered brush blending (**`Alt + G`**).
- `TOOL_TRANSFORM`: Nudge and reposition selected pixels (**`M`**).
- `COPY`, `CUT`, `PASTE`: Standard clipboard operations.

### 2.4 Project & Layering (Order Management)

- `NEW_ITEM`: Contextual creation of Frames or Infusions.
- `DUPLICATE_ITEM`: Clone active selection or layer.
- `DELETE_ITEM`: Remove active selection or layer.
- `MOVE_ITEM_UP`, `MOVE_ITEM_DOWN`: Reorder Infusions (Layers) in the stack.
- `MERGE_LAYERS`: Flatten an Infusion into the one below it.
- `TOGGLE_LAYER_VISIBILITY`, `TOGGLE_LAYER_LOCK`: Manage Infusion properties.
- `TOGGLE_FRAME_VISIBILITY`: Manage frame inclusion in playback/export.

### 2.5 UI & Environment Intents

- `OPEN_MENU`: Show Command Palette (**`Ctrl + K`**).
- `OPEN_PALETTE`: Show Color Picker (**`C`**).
- `OPEN_AUDIO`: Show Audio Settings (**`Ctrl + Shift + A`**).
- `OPEN_EXPORT`: Show Export Menu (**`Ctrl + E`**).
- `OPEN_MANUAL`: Show Barista Manual (**`F1`**).
- `OPEN_HELP`: Show Quick Guide (**`F2`**).
- `TOGGLE_GHOST_LAYERS`: Onion Skinning toggle (**`Alt + O`**).
- `TOGGLE_UNDERLAY`: Reference image visibility toggle.

### 2.6 Convention: Reserved Shortcuts

To maintain cross-platform integrity, the following chord patterns are reserved for the OS/Browser:

- `Ctrl+W` (Close), `Ctrl+Q` (Quit), `Ctrl+N` (New Window), `Ctrl+R` (Reload), `Ctrl+P` (Print), `F11` (Fullscreen), `F12` (DevTools).

## 3. Visual Identity & Design System

- **Core Aesthetic:** Retro-Aesthetic / Japanese Roadside Cafe.
- **Primary Accent Color:** Lantern Gold `#b58900` (Light) / `#ffc107` (Dark).
- **Background:** Functional Canvas Background (`#fdf6e3` Light / `#121412` Dark).
- **Typography:**
  - **Brand/Headers:** Tiny5 (Pixel-art font).
  - **Serif/Display:** Zen Maru Gothic.
  - **Body/Technical:** Courier Prime (Monospace).
- **Rendering:** `image-rendering: pixelated` must be applied to all canvas views to maintain sharpness.

## 4. Performance Requirements

- **Frame Budget:** < 16.6ms per frame (60 FPS) for all UI updates and movements.
- **Export Fidelity:**
  - **SVG:** Optimized path-merging required to minimize path count.
  - **PNG:** Scaling must use nearest-neighbor interpolation (no blurring).
- **History:** Command Pattern stack depth of 500 actions.

## 5. Accessibility (A11y) Standards

- **Keyboard Sovereignty**: 100% of UI functionality must be accessible via Keyboard shortcuts.
- **Contrast**: Text and iconic elements must maintain a contrast ratio of 4.5:1 (WCAG AA).
- **Screen Reading**:
  - The Canvas uses `role="grid"` with coordinate-based labels.
  - Interactive elements must have descriptive `aria-label` attributes.
- **Focus Indicators**: All focusable elements must display a `2px` solid Barista Magenta outline when active.

## 7. Technical Governance & Compliance (3S)

To ensure high standards of quality and resilience, all technical implementations must pass the **3S Gate**:

- **Secure (S1)**:
  - All imported project data (.rupa, .gpl, PNG, SVG) must be validated against a schema before processing.
  - External file access is strictly managed via Electron's **Main-Renderer IPC bridge**, enforcing isolation.
  - Sanitize all UI-rendered user input to prevent XSS.
- **Sustain (S2)**:
  - **English-Only** documentation and code for global maintainability.
  - Strict adherence to the **Japanese Roadside Cafe** aesthetic to maintain cognitive and visual harmony.
  - Mandatory unit test coverage for the **Logic Layer** to prevent regression.
- **Scalable (S3)**:
  - Selection system uses a **Bitmask Buffer** (`Uint8Array`) to maintain $O(1)$ performance even on large canvases.
  - SVG exports must use **path-merging algorithms** to keep file sizes small for complex pixel patterns.
  - Support for up to 500 undo/redo actions without excessive memory overhead.

---

## 8. Final Reminder: ISO-IEC-12207 Compliance

Every technical addition must align with the **Modular Layered Monolith** pattern and preserve the **Barista's Rhythm** (responsiveness and tactile feedback).
