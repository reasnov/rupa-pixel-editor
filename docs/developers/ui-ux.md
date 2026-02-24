# UI/UX Guidelines: Japanese Roadside Cafe x Retro 8-bit

This document defines the principles for creating a meditative, rural, and aesthetic experience within the **Rupa Pixel Editor** (Editor). The identity is a deliberate intersection of a **Roadside Japanese Cafe** and a **Retro 8-bit Aesthetic**—where tranquil nature meets the charming limitations of vintage digital craft.

---

## 1. The Lore: The Roadside Sanctuary

_"By a quiet country road, where the forest meets the village, stands a humble wooden cafe. Inside, the air smells of old paper and fresh tea. A vintage computer hums in the corner, its glowing screen showing patterns of leaves and stone. This is the Artisan's Sanctuary—a place where every pixel is a deliberate stitch in the fabric of a rural story."_

Every interaction in Rupa should feel like a moment of low-fi mindfulness in this sanctuary.

---

## 2. Core Philosophy: The Lo-Fi Atelier

Rupa is a space for "Digital Ruralism." The UI balances organic warmth with mechanical precision.

- **8-bit Tactility**: Feedback should feel physical. Elements should "click" into place with a 2px offset on active states. Transitions use `steps(2)` or sharp cubic-beziers.
- **Structural Calmness**: A balanced layout reminiscent of a clean cafe counter.
- **Bi-Lateral Workspace**: Tools and project structure are split to optimize focus:
  - **Left (The Serving Table)**: Project hierarchy (**Frames** & **Layers**) and **Primary Vessels** (Core drawing & selection tools).
  - **Right (Artisan's Atelier)**: Artistic refinement (**Color**, **History**) and **Secondary Vessels** (Modifiers & Seals).
- **Atmospheric Layering**: The UI is wrapped in a "CRT Glow" containing scanlines and a subtle vignette to simulate vintage hardware.

---

## 3. Visual Identity: Evergreen-Retro

### 3.1 Typography Protocol

| Font Family         | Role                                           | Casing           |
| :------------------ | :--------------------------------------------- | :--------------- |
| **Zen Maru Gothic** | Headings, Serif-labels, UI Meta-text           | Mixed / Sentence |
| **Courier Prime**   | Primary UI text, technical data                | Sentence         |
| **Tiny5**           | Brand identity, primary buttons, pixel numbers | Uppercase        |

### 3.2 The Dual-Sanctuary Palette

Integrated from `src/lib/data/palettes.json` and defined as CSS variables. The system supports dynamic switching between **Evergreen-Retro** (Light) and **Midnight Sanctuary** (Dark) while maintaining **WCAG AA** contrast.

#### **Nature Group (Foundation)**

| Component       | Light Mode (Evergreen)   | Dark Mode (Midnight)      | Technical Role            |
| :-------------- | :----------------------- | :------------------------ | :------------------------ |
| **Canvas Base** | `#fdf6e3` (Washi White)  | `#121412` (Night Washi)   | Main Background           |
| **Primary Ink** | `#344e41` (Evergreen)    | `#e0e5e0` (Morning Mist)  | Text & Primary Icons      |
| **Panel Base**  | `#d1e0d0` (Bamboo Shoot) | `#1e241e` (Shadow Bamboo) | HUD Backgrounds           |
| **Grid/Lines**  | `#dad7cd` (Stone Path)   | `#2a302a` (Night Pebble)  | Borders & Layout Divisors |
| **HUD Shadow**  | `#3a5a40` (Deep Forest)  | `#0a0c0a` (Deepest Void)  | Depth & Contrast          |

#### **Craft Group (Accent & Wood)**

| Component         | Light Mode (Evergreen)   | Dark Mode (Midnight)        | Technical Role              |
| :---------------- | :----------------------- | :-------------------------- | :-------------------------- |
| **Brand Accent**  | `#b58900` (Lantern Gold) | `#ffc107` (Glowing Lantern) | Active States & Focus       |
| **Danger/Action** | `#cb4b16` (Rust Clay)    | `#ff5722` (Ember Flare)     | Destructive Intents         |
| **Outer Border**  | `#b08968` (Aged Oak)     | `#3e2c26` (Charred Oak)     | Main Frame & Wood Accent    |
| **Structural**    | `#7f5539` (Dark Walnut)  | `#261a1a` (Ebony Walnut)    | Buttons & Heavy Outlines    |
| **Hover State**   | `#f4f1bb` (Rice Straw)   | `#2d332d` (Moonlit Straw)   | Subtle Interaction Feedback |

### 3.3 Functional CSS Aliases

Always use functional aliases in components to ensure automatic theme adaptation:

- `--color-canvas-bg`: Maps to Washi White / Night Washi.
- `--color-panel-bg`: Translucent HUD overlay.
- `--color-ui-accent`: Brand highlight (Gold).
- `--color-text-main`: Primary content color.

---

## 4. Atmospheric Overlays (VFX)

To ensure **GitHub Pages** compatibility and performance, all textures must be generated via **SVG Filters** or stored locally.

- **The Grain**: A recursive fractal noise filter applied to the AppShell. In **Midnight Mode**, the opacity is reduced to `0.015` to maintain subtle texture without visual noise.
- **The CRT Flow**: Scanlines and flicker. In **Midnight Mode**, the scanline color shifts to a faint dark-green tint.
- **Natural Phenomena**:
  - **Pixel Steam**: Randomized CSS animations for "brewing" states.
  - **8-bit Rain**: Kinetic particles used during "Clear Canvas" or meditative moments. In Dark mode, rain particles use `#e0e5e0` with low opacity.

---

## 5. Auditory Environment: The 8-bit Nature Protocol

Sound is the "Soul" of the cafe. It anchors the user in the retro-rural state.

- **Retro-Natural SFX**:
  - _Apply_: A fast triangle-wave "tink" (Ceramic chime).
  - _Sweep_: Filtered white noise (Bamboo broom).
  - _Flip_: Soft parchment rustle (Paper sound).
- **Generative 8-bit Melodies**: The **Ambient Engine** produces real-time melodies using Pentatonic scales, mirroring a village piano.

---

## 6. Interaction Design: Hybrid Crafting

- **Keyboard-First**: 100% sovereignty. Every action must be reachable via a keyboard chord and registered in the **Command Palette**.
- **Tactile Hover**: Hovering over interactive elements must trigger a scale or translation change to simulate "touching" a physical object.
- **The Cursor (Furin)**: The cursor uses an inversion-petal design that changes scale based on the brush size, providing immediate visual feedback of the active tool's reach.

---

## 7. Accessibility (A11y)

- **Contrast**: Maintain a minimum 4.5:1 contrast ratio for all text against Washi White.
- **Focus Sovereignty**: Use a solid 2px focus ring (`Lantern Gold`) for all navigable elements.
- **Technical Metadata**: Provide ARIA descriptions using both technical and lore terms (e.g., `aria-label="New Frame (New Serving)"`).

---

## 8. Internationalization (i18n): Global Village

- **No Hardcoded Strings**: All UI text must be keys from `src/lib/lang/`.
- **Unit Standardization**: Use `FormatLogic` for units (`px`, `fps`, `%`) to ensure localized numbering and consistent technical labeling.
