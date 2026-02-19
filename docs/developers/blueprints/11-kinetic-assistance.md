# Blueprint 11: Kinetic Assistance (The Brewing Flow)

## 1. Executive Summary

Animating pixel-by-pixel is a meditative but labor-intensive craft. This blueprint introduces **Kinetic Assistance** features designed to automate repetitive tasks while maintaining the artist's total control. By treating selections as "Syrup" that can flow across frames and layers as "Aroma" that can pulse, we introduce efficiency without sacrificing the "hand-drawn" soul of the Rupa Pixel Editor.

---

## 2. Core Concepts

### 2.1 The "Syrup Flow" (Selection Propagation)
Allows a barista to take a selected pattern and "pour" it across multiple cups (frames) with automated movement offsets.
- **Manual vs. Automated**: Instead of Copy-Paste-Nudge for 20 frames, the barista defines the "Pour Path" and the system populates the frames.

### 2.2 The "Crema Blend" (Linear Tweening)
Automated "in-betweening" for basic transformations.
- **Interpolation**: Calculates intermediate positions, rotations, or opacities between two keyframes.
- **Pixel Integrity**: Ensures that interpolated objects remain "pixel-perfect" by using nearest-neighbor rounding rather than sub-pixel smoothing.

### 2.3 The "Temporal Echo" (Advanced Onion Skinning)
Enhanced visual guidance that allows seeing multiple steps behind and ahead in the brewing process.

### 2.4 Advanced Animation Orchestration
- **The Drop Matrix (Timeline Matrix UI)**: A high-density grid where the Y-axis represents Infusions (Layers) and the X-axis represents Cups (Frames).
- **Frame Tagging (Menu Sections)**: Grouping frames into logical sequences (e.g., "Walk", "Attack").
- **Linked Cells (Steeped Layers)**: Synchronizing layer content across multiple frames for static elements.
- **Easing Functions (Brewing Curves)**: Non-linear interpolation (Ease-In/Out) for organic movement.
- **Batch Transformation (Bulk Stir)**: Transforming selected content across multiple frames simultaneously.

---

## 3. Technical Implementation

### 3.1 Module A: The Drop Matrix (UI Layer)
The `TimelineView` will be refactored into a **Matrix View**:
- **Grid Rendering**: Each cell `(layer, frame)` is rendered as a "Drop" (dot).
- **Visual Cues**: 
    - **Filled Drop**: Indicates the layer contains pixel data in that frame.
    - **Empty Ring**: Indicates an empty layer.
    - **Pour Line**: A horizontal connection between drops indicating **Linked Cells** (shared content).
- **Interaction**: Clicking a drop selects both the specific Layer and Frame simultaneously. Dragging a range of drops allows for batch manipulation.

### 3.2 Module B: Selection Propagation (Service Layer)
`SelectionService` will be expanded with the `propagate(options)` method:
- **Parameters**: `frameCount` (number of target frames), `deltaX`, `deltaY` (offset per frame).
- **Execution**: 
    1. Capture the current active selection (Source).
    2. Iterate through the next `N` frames.
    3. If a frame doesn't exist, create it (optional).
    4. Apply the selection to the target frame's active layer with the accumulated offset.
    5. Register a single `StructuralHistoryAction` for a "one-click undo" of the entire propagation.

### 3.2 Module B: The Tweening & Easing Engine (Logic Layer)
A new `KineticLogic` module will handle the math of movement:
- **`lerpPosition(start, end, progress, easingType)`**: Returns integer coordinates for pixel-grid alignment.
- **Easing Support**: Implementation of Penner's Easing Equations (Sine, Quad, Cubic, Bounce) to provide "Weight" to animations.
- **`calculateFrames(startFrame, endFrame)`**: Identifies the gap and suggests the number of in-betweens.

### 3.3 Module C: The Echo View (UI/Rendering Layer)
`Canvas.svelte` will utilize a new `GhostEngine` to render overlays:
- **Past Echoes**: Renders previous frames with a **Cerulean Blue** tint and decreasing alpha.
- **Future Echoes**: Renders upcoming frames with a **Botanical Green** tint.
- **Performance**: Uses a cached `OffscreenCanvas` for each ghost frame to prevent re-rendering the entire layer stack during playback.

### 3.4 Module D: Data Structures (State Layer)
- **`FrameTag`**: `{ id, name, color, from, to }` - Added to `ProjectState`.
- **`LayerLink`**: Boolean flag on `LayerState` to indicate if pixels should be shared across the timeline.

---

## 4. UI/UX Integration (HUD)

### 4.1 The "Pour Basin" (Propagation Menu)
A specialized overlay triggered from the Selection Menu:
- **Inputs**: Number of cups, Directional nudge (WASD/Arrows), and Preview button.
- **Visuals**: A dotted "phantom" path showing where the selection will end up.

### 4.2 The "Aroma Pulse" (Procedural Modifiers)
A properties toggle for **Infusions** (Layers):
- **Wiggle**: Random 1px jitters (ideal for fire/water).
- **Sway**: Sinusoidal horizontal movement (ideal for grass/hair).
- **Pulse**: Rhythmic opacity changes (ideal for glowing coals).

### 4.3 Timeline "Flavor Tags"
Visual color-coded bars above the timeline frames to indicate named sequences.

---

## 5. Success Criteria

1. **Productivity Gain**: Reducing the time to create a simple 10-frame walking cycle by at least 60%.
2. **Visual Fidelity**: No "blurring" during automated movement; objects must always snap to the pixel grid.
3. **Reversibility**: Every automated "Flow" must be undoable as a single action.
4. **Intuitive Metaphor**: Features must feel like "Brewing" and "Pouring" rather than "Mathematical Calculations."
