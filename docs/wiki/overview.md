# Project Overview: Rupa Pixel Editor

## 1. Vision & Identity
**Rupa Pixel Editor** is a professional-grade desktop application designed for creating pixel art through a strictly keyboard-centric interface. Inspired by the philosophy of **"Rupa"** (form or visual manifestation) and the traditional art of **"Sulam"** (Stitching), this application offers a methodical, precise, and meditative drawing experience.

Built with **Electron** and **Svelte 5**, Rupa positions the keyboard as the primary tool for grid navigation and color placement, ensuring every pixel is placed with intentionality and absolute coordinate accuracy.

---

## 2. Core Philosophy: "Digital Stitching"
Rupa moves away from conventional mouse-based interaction, treating the digital canvas as a piece of embroidery fabric:
*   **Methodical:** Every pixel is a deliberate "stitch," requiring a conscious keystroke rather than a fluid mouse swipe.
*   **Precision:** Eliminates the risk of "mouse slip" or hand jitters, providing a perfect 1:1 relationship between the user's intent and the grid.
*   **Rhythm:** Encourages a rhythmic workflow where the creator becomes attuned to the tactile feedback of the keyboard.

---

## 3. Key Features

### 3.1 Keyboard-Only Interface
*   **Grid Navigation:** Full control using `Arrow Keys` or `WASD`.
*   **Active Cell Focus:** A single, high-visibility "Active Cell" replaces the floating mouse cursor, keeping the user's focus locked on the drawing point.
*   **Action Mapping:** Dedicated keys for primary actions (e.g., `Space` to "stitch"/color, `X` to erase).

### 3.2 Stitch-Flow Mode
A signature feature for creating continuous lines and patterns:
*   **Pulling the Thread:** Hold a modifier key (e.g., `Shift` or `V`) to automatically color the path as the active cell moves.
*   **Fluid Composition:** Allows users to switch instantly between single-pixel precision and rapid line-work.

### 3.3 Advanced Palette Management
*   **Quick Swap:** Instantaneous palette switching using numeric keys or custom shortcuts.
*   **Persistence:** Local storage of custom palettes, ensuring they are available across different sessions without cloud dependency.

### 3.4 Professional Export Options
*   **SVG (Scalable Vector Graphics):** Generates mathematically perfect vector grids, ideal for high-resolution printing and infinite scaling.
*   **Raster (PNG/JPG):** High-fidelity rasterization via the HTML5 Canvas API for web and social media sharing.

---

## 4. Technical Architecture

### 4.1 Frontend (Svelte 5 & Runes)
The application leverages Svelte 5's fine-grained reactivity to handle dense grid data:
*   **`$state`:** Manages the core pixel array, ensuring that updates to individual cells do not trigger unnecessary global re-renders.
*   **`$derived`:** Computes UI states, such as the active cell's relative position, selection boundaries, and real-time image statistics.
*   **Zero-Latency Sync:** Optimized event loops to ensure every keystroke results in a visual update in under 16ms.

### 4.2 Desktop Integration (Electron)
*   **Native File System:** Direct access to the local hard drive for seamless Save/Load operations.
*   **Zero-Server Architecture:** 100% offline-first; no data ever leaves the user's machine, ensuring total privacy and performance.

### 4.3 State Logic
*   **Stack-Based Undo/Redo:** A lightweight, memory-efficient system that tracks every pixel modification for infinite history.
*   **Coordinate Engine:** A custom TypeScript core that handles canvas transformations, mirroring, and rotation without losing data integrity.

---

## 5. Target Audience
*   **Pixel Artists:** Looking for a more structured, coordinate-based workflow to enhance their precision.
*   **Power Users & Vim Enthusiasts:** Creators who prefer the "home row" efficiency and want to eliminate mouse-travel fatigue.
*   **Creative Hobbyists:** Individuals seeking a relaxing, "digital stitching" activity that values the meditative process as much as the final output.

---

## 6. UX Goals
*   **Tactile Feedback:** Optional audio-visual cues (e.g., mechanical click sounds) to reinforce the sensation of digital stitching.
*   **Minimalism:** A distraction-free UI that puts the focus entirely on the canvas and color.
*   **Accessibility:** A robust alternative for users who find pointing devices (mice/styli) difficult to operate but are proficient with a keyboard.
