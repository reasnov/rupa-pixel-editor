# UI/UX Guidelines: The Barista's Sanctuary

This document defines the principles for creating a meditative, cozy, and game-like experience within the **Rupa Pixel Editor** (Editor). Every interface element and interaction must contribute to the feeling of a peaceful sanctuary for digital baristas.

---

## 1. Core Philosophy: Meditative Craft

Rupa is not just a tool; it is a space for mindfulness. The UI should encourage a slow, intentional pace of creation.

- **Non-Aggressive Feedback**: Avoid harsh alerts or flashing red errors. Use soft chimes, paper rustles, and gentle magenta glows.
- **Structural Calmness**: Maintain a clean, balanced layout. High information density should be tucked away in sidebars (Ledgers) or overlays (Basins) to keep the central Canvas focused.
- **Intentionality**: Every "pixel" (pixel) should feel like a deliberate act of craft, mirroring the rhythm of knitting or brewing.

---

## 2. The Game-Like Experience (Gamification of Craft)

Interaction in Rupa should feel less like operating software and more like playing a cozy simulation game (e.g., _Stardew Valley_ or _Townscaper_).

- **The Playhead as an Avatar**: Treat the **Cursor** not just as a cursor, but as the barista's representative on the canvas. It should have weight and personality through smooth transitions.
- **Physicality**: Elements should feel "tangible." Modals (Basins) should feel like scrolls or drawers opening. Frames should feel like pages of a physical sketchbook being turned.
- **Rewarding Actions**: Applying a color should produce a satisfying tactile sound. Completing a frame or an artifact should feel like a small victory.
- **Exploration**: Use "Easter Eggs" in the Pattern Catalog and hidden keyboard shortcuts to encourage baristas to discover the studio's depth.

---

## 3. Visual Identity: Cottagecore & Solarized Warmth

The aesthetic is "Analog-Digital"—a digital grid with the warmth of natural materials.

- **The Palette**: Strictly adhere to the **Solarized** base colors with **Barista Magenta** as the primary focus.
  - _Background_: Natural Paper (`#fdf6e3`).
  - _Borders_: Studio Cream / Grid Wood (`#eee8d5`).
  - _Acent_: Botanical Pink / Magenta (`#d33682`).
- **Textures**: Use subtle paper grains and soft shadows to give depth. Avoid flat, "clinical" tech designs.
- **Typography**:
  - **Tiny5**: For headers and brand identity (Pixel-art spirit).
  - **EB Garamond**: For display and serif elegance (Old-world craft).
  - **Lora**: For system labels and body text (Readability and warmth).

---

## 4. Auditory Environment: The Atmosphere Protocol

Sound is 50% of the Rupa experience. It anchors the barista in the meditative state.

- **Generative Soundscapes**: The **Ambient Engine** produces real-time piano melodies that evolve with the user's activity.
- **Tactile SFX**:
  - _Pixel_: A soft wooden "clack."
  - _Unpixel_: A paper-like "rub."
  - _Move_: A light "tap" or "slide."
- **Silence as a Feature**: Respect the silence. SFX should be subdued and never overwhelm the generative music.

---

## 5. Interaction Design: Hybrid Brewing

Rupa follows a **"Keyboard-First, Mouse-Friendly"** model. This hybrid approach balances the precision of keyboard-row navigation with the organic flow of mouse-guided drawing.

- **The Keyboard (Keyboard)**: Provides the structural "Metronome." Perfect for geometric patterns, precise navigational jumps, and bulk project manipulations.
- **The Mouse (ShuttlePoint)**: Provides **"Fluid Pixeling."** Enables baristas to draw freehand curves and organic patterns that would be physically exhausting via keyboard.
- **Seamless Hand-off**: The Cursor follows both inputs instantly. An barista can move with arrow keys and immediately start a freehand line with the mouse without changing modes.
- **Context Sovereignty**: UI overlays (Basins) respond to both keyboard shortcuts and mouse clicks, ensuring no barista is forced into a single input method.

---

## 6. UX Checklist for Developers

When adding a new feature, ask:

1. Is it reachable via a keyboard chord?
2. Is it intuitive via mouse pointer (**ShuttlePoint**)?
3. Does it have a tactile sound or visual glow?
4. Does it fit within the Solarized/Cottagecore aesthetic?
5. Does it make the user feel more relaxed or more stressed? (Goal: Relaxed).
6. Does it feel like a "tool" or a "toy"? (Goal: A professional tool that feels like a toy).

---

## 7. Accessibility (A11y): The Inclusive Studio

Accessibility in Rupa is not just about compliance, but about ensuring the "Sanctuary" is open to everyone.

- **The Keyboard as an Assistive Tool**: Since Rupa is keyboard-first, most accessibility for motor-impaired users is built into the **Keyboard**. Ensure all chords are remappable and logical.
- **Semantic ARIA with Craft Terminology**:
  - Use `aria-label` to describe actions in the barista metaphor (e.g., `aria-label="Soak the canvas with color"` instead of `aria-label="Flood fill"`).
  - The **Canvas** must be treated as a `role="grid"` or `role="img"` with an alt-description of the pattern being woven.
- **Focus Management**: The **Cursor** acts as the primary focus anchor. When moving between panels (Ledgers), the focus should be clearly visible with a soft magenta outline.
- **Color Contrast**: All text must meet WCAG AA standards against the Paper (`#fdf6e3`) background. Use Barista Magenta for high-contrast highlights.

---

## 8. Internationalization (i18n): Global Craft

Rupa uses **i18next** to translate the "language of craft" for a global audience.

- **Source of Truth**: All strings must live in `src/lib/lang/en/` (as the initial standard).
- **Barista-Centric Keys**: Use semantic keys that reflect the studio's lore.
  - _Bad_: `ui.button.save`, `ui.modal.header`
  - _Good_: `hud.actions.preserve_weave`, `hud.basin.color_title`
- **Interpolation**: Use i18next's interpolation for dynamic stats (e.g., `{{count}} pixels applied`).
- **Implementation Rule**: Never hardcode text in Svelte components. Use the `$t` (translate) function provided by the i18n store.
