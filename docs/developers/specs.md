# Technical Specifications: Rupa Pixel Editor (Atelier)

## 1. Grid Mechanics

- **Linen Size:** Default 32x32.
- **Coordinate System:**
  - **Internal:** Zero-indexed flat array (`y * width + x`).
  - **Display (HUD):** Center-relative (Cartesian).
    - For even dimensions, there is no zero-row/column (jumps from -1 to 1).
    - For odd dimensions, the center is (0,0).
- **Stitch Data:** Hex color strings (`ColorHex`).
- **Empty State:** Studio-specific cream `#eee8d5`.

## 2. Intent Schema

Every interaction is mapped to a `LoomIntent` to ensure semantic consistency. Intents are triggered by the **LoomPad** (Keyboard chords) or the **ShuttlePoint** (Mouse/Pointer gestures).

### 2.1 Navigation & Positioning

- `MOVE_UP`, `MOVE_DOWN`, `MOVE_LEFT`, `MOVE_RIGHT`: Keyboard-driven step movement.
- `SET_POSITION`: ShuttlePoint-driven absolute positioning (Screen-to-Linen mapping).
- `JUMP_HOME`: Reset position to center.

### 2.2 Action Intents

- `STITCH`: Apply dye (Space/Click).
- `UNSTITCH`: Remove dye (Backspace/Right-click).
- `UNDO`, `REDO`: History traversal.

### 2.3 Flow Intents (Sustained)

- `FLOW_THREAD`: Enable threading (Draw Flow - Ctrl/Drag).
- `FLOW_UNRAVEL`: Enable unravelling (Erase Flow - Ctrl+Shift/Right-drag).
- `FLOW_LOOM`: Enable looming (Selection - Shift/Drag).
- `FLOW_PICK`: Enable dye picking (Eyedropper).

### 2.4 UI Intents

- `OPEN_PALETTE`: Show Command Palette (Pattern Catalog).
- `OPEN_BASIN`: Show Color Picker (Natural Dye Basin).
- `OPEN_AUDIO`: Show Audio Settings (Audio Basin).
- `OPEN_CRATE`: Show Export Menu (Artifact Crate).
- `OPEN_CODEX`: Show User Guide (Artisan Codex).

### 2.5 Convention: Reserved Shortcuts

To maintain cross-platform integrity, the following chord patterns are reserved for the OS/Browser and must not be mapped to studio intents:

- `Ctrl+W` (Close), `Ctrl+Q` (Quit), `Ctrl+N` (New Window), `Ctrl+R` (Reload), `Ctrl+P` (Print), `F11` (Fullscreen), `F12` (DevTools).

## 3. Visual Identity & Design System

- **Core Aesthetic:** Cottagecore / Retro-Artisan.
- **Primary Brand Color:** Artisan Magenta `#D33682`.
- **Background:** Natural Paper texture with Solarized Base 3 (`#fdf6e3`).
- **Typography:**
  - **Brand/Headers:** Tiny5 (Pixel-art font).
  - **Serif/Display:** EB Garamond.
  - **Body/System:** Lora.
- **Rendering:** `image-rendering: pixelated` must be applied to all linen views to maintain sharpness.

## 4. Performance Requirements

- **Frame Budget:** < 16.6ms per frame (60 FPS) for all UI updates and movements.
- **Export Fidelity:**
  - **SVG:** Recursive rect-merging required to minimize path count.
  - **PNG:** Scaling must use nearest-neighbor interpolation (no blurring).
- **History:** Command Pattern stack depth of 500 actions.

## 5. File Formats

- **Pattern Book (.rupa):** JSON-based schema storing:
  - Version metadata.
  - Linen dimensions.
  - Palette array.
  - Flat stitch array.
  - Creation/Modification timestamps.
