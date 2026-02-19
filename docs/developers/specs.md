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
- `SET_POSITION`: Pointer-driven absolute positioning (Screen-to-Canvas mapping).
- `JUMP_HOME`: Reset position to center.
- `GOTO`: Jump to specific coordinate (**`Alt + J`**).
- `PAN_VIEWPORT`: Free-form canvas panning (**`Q`**).
- `ZOOM_IN`, `ZOOM_OUT`: Control viewport scale.
- `TOGGLE_MINIMAP`: Show/Hide the **Minimap** (Surveyor's Glass).

### 2.2 Painting & Etching (Drawing Tools)

- `PAINT`: Apply color (Space/Enter/Click).
- `ERASE`: Remove color (Backspace/Delete/Right-click).
- `BRUSH_SIZE_INC`, `BRUSH_SIZE_DEC`: Adjust brush diameter (**`[`** and **`]`**).
- `TOGGLE_BRUSH_SHAPE`: Switch between Square and Circle vessels (**`Alt + B`**).
- `TOGGLE_AIRBRUSH`: Enable 'The Mist' spray mode (**`Alt + A`**).
- `CYCLE_SYMMETRY`: Toggle Horizontal, Vertical, and Quadrant symmetry (**`S`**).
- `TOGGLE_TILING`: Enable seamless coordinate wrapping (**`T`**).
- `TOGGLE_PIXEL_PERFECT`: Automated line cleaning (**`Shift + P`**).
- `SHADE_LIGHTEN`, `SHADE_DARKEN`, `SHADE_DITHER`: Real-time color modification modifiers (**`L`**, **`D`**, **`X`**).
- `TOGGLE_ALPHA_LOCK`, `TOGGLE_COLOR_LOCK`: Pixel protection modes (**`A`**, **`Shift + A`**).
- `BIND_VERTEX`, `SEAL_BINDING`: Polygon construction steps.

### 2.3 Manipulation & Magic

- `UNDO`, `REDO`: History traversal.
- `FLOOD_FILL`: Connected color fill.
- `RECOLOR`: Global color replacement.
- `SELECT_SAME`: Magic wand selection.
- `TOOL_GRADIENT`: Linear ombre pouring.
- `TOOL_RECTANGLE`, `TOOL_ELLIPSE`, `TOOL_POLYGON`: Geometric shape vessels.
- `TOOL_TRANSFORM`: Nudge and reposition selected pixels.
- `TOOL_SELECT`: Area focus tool (**`Shift + S`**).
- `SYRUP_FLOW`: Selection propagation across frames (HUD Action).

### 2.4 Project & Layering (Order Management)

- `NEW_ITEM`: Contextual creation of Frames or Infusions.
- `DUPLICATE_ITEM`: Clone active selection or layer.
- `DELETE_ITEM`: Remove active selection or layer.
- `MOVE_ITEM_UP`, `MOVE_ITEM_DOWN`: Reorder Infusions (Layers) in the stack.
- `MERGE_LAYERS`: Flatten an Infusion into the one below it.
- `TOGGLE_LAYER_VISIBILITY`, `TOGGLE_LAYER_LOCK`: Manage Infusion properties.

### 2.5 UI & Environment Intents

- `OPEN_MENU`: Show Command Palette (Ctrl+K).
- `OPEN_PALETTE`: Show Color Picker (b).
- `OPEN_AUDIO`: Show Audio Settings (Ctrl+Shift+A).
- `OPEN_EXPORT`: Show Export Menu (Ctrl+E).
- `OPEN_MANUAL`: Show Barista Manual (F1).
- `OPEN_HELP`: Show Quick Guide (F2).
- `TOGGLE_GHOST_LAYERS`: Onion Skinning toggle.
- `TOGGLE_UNDERLAY`: Reference image visibility toggle.

### 2.6 Convention: Reserved Shortcuts

To maintain cross-platform integrity, the following chord patterns are reserved for the OS/Browser:

- `Ctrl+W` (Close), `Ctrl+Q` (Quit), `Ctrl+N` (New Window), `Ctrl+R` (Reload), `Ctrl+P` (Print), `F11` (Fullscreen), `F12` (DevTools).

## 3. Visual Identity & Design System

- **Core Aesthetic:** Cottagecore / Retro-Barista.
- **Primary Brand Color:** Barista Magenta `#D33682`.
- **Background:** Natural Paper texture with Solarized Base 3 (`#fdf6e3`).
- **Typography:**
  - **Brand/Headers:** Tiny5 (Pixel-art font).
  - **Serif/Display:** EB Garamond.
  - **Body/System:** Lora.
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

## 6. File Formats

- **Recipe Book (.rupa):** JSON-based schema storing:
  - Version metadata.
  - Canvas dimensions.
  - Palette array.
  - Hierarchical Frame/Layer data.
  - Creation/Modification timestamps.
