# Technical Specifications: Rupa Pixel Editor (Editor)

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

Every interaction is mapped to a `ActionIntent` to ensure semantic consistency. Intents are triggered by the **Keyboard** (Keyboard chords) or the **ShuttlePoint** (Mouse/Pointer gestures).

### 2.1 Navigation & Positioning

- `MOVE_UP`, `MOVE_DOWN`, `MOVE_LEFT`, `MOVE_RIGHT`: Keyboard-driven step movement.
- `SET_POSITION`: ShuttlePoint-driven absolute positioning (Screen-to-Canvas mapping).
- `JUMP_HOME`: Reset position to center.

### 2.2 Action Intents

- `PAINT`: Apply color (Space/Enter/Click).
- `ERASE`: Remove color (Backspace/Delete/Right-click).
- `UNDO`, `REDO`: History traversal.
- `SOAK`: Flood fill.
- `RECOLOR`: Global color replacement.
- `SELECT_SAME`: Magic wand selection.

### 2.3 Flow Intents (Sustained Modifiers)

- `FLOW_PAINT`: Continuous drawing (Ctrl + Movement/Drag).
- `FLOW_ERASE`: Continuous erasing (Ctrl + Shift + Movement/Right-drag).
- `FLOW_SELECT`: Area selection (Shift + Movement/Drag).

### 2.4 UI Intents

- `OPEN_MENU`: Show Command Palette (Ctrl+K).
- `OPEN_PALETTE`: Show Color Picker (b).
- `OPEN_AUDIO`: Show Audio Settings (Ctrl+Shift+A).
- `OPEN_EXPORT`: Show Export Menu (Ctrl+E).
- `OPEN_MANUAL`: Show Barista Manual (F1).
- `OPEN_HELP`: Show Quick Guide (F2).

### 2.5 Convention: Reserved Shortcuts

To maintain cross-platform integrity, the following chord patterns are reserved for the OS/Browser and must not be mapped to studio intents:

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
  - **SVG:** Recursive rect-merging required to minimize path count.
  - **PNG:** Scaling must use nearest-neighbor interpolation (no blurring).
- **History:** Command Pattern stack depth of 500 actions.

## 5. Accessibility (A11y) Standards

- **Keyboard Sovereignty**: 100% of UI functionality must be accessible via Keyboard shortcuts.
- **Contrast**: Text and iconic elements must maintain a contrast ratio of 4.5:1 (WCAG AA) against the Paper background.
- **Screen Reading**:
  - The Canvas uses `role="grid"` with coordinate-based labels.
  - Interactive elements must have descriptive `aria-label` attributes using barista terminology.
- **Focus Indicators**: All focusable elements must display a `2px` solid Barista Magenta outline when active.

## 6. File Formats

- **Pattern Book (.rupa):** JSON-based schema storing:
  - Version metadata.
  - Canvas dimensions.
  - Palette array.
  - Flat pixel array.
  - Creation/Modification timestamps.
