# UI/UX Guidelines: The Artisan's Sanctuary

This document defines the principles for creating a meditative, cozy, and game-like experience within the **Rupa Pixel Editor** (Atelier). Every interface element and interaction must contribute to the feeling of a peaceful sanctuary for digital artisans.

---

## 1. Core Philosophy: Meditative Craft

Rupa is not just a tool; it is a space for mindfulness. The UI should encourage a slow, intentional pace of creation.

- **Non-Aggressive Feedback**: Avoid harsh alerts or flashing red errors. Use soft chimes, paper rustles, and gentle magenta glows.
- **Structural Calmness**: Maintain a clean, balanced layout. High information density should be tucked away in sidebars (Ledgers) or overlays (Basins) to keep the central Linen focused.
- **Intentionality**: Every "stitch" (pixel) should feel like a deliberate act of craft, mirroring the rhythm of knitting or weaving.

---

## 2. The Game-Like Experience (Gamification of Craft)

Interaction in Rupa should feel less like operating software and more like playing a cozy simulation game (e.g., _Stardew Valley_ or _Townscaper_).

- **The Playhead as an Avatar**: Treat the **Needle** not just as a cursor, but as the artisan's representative on the linen. It should have weight and personality through smooth transitions.
- **Physicality**: Elements should feel "tangible." Modals (Basins) should feel like scrolls or drawers opening. Frames should feel like pages of a physical sketchbook being turned.
- **Rewarding Actions**: Applying a dye should produce a satisfying tactile sound. Completing a frame or an artifact should feel like a small victory.
- **Exploration**: Use "Easter Eggs" in the Pattern Catalog and hidden keyboard shortcuts to encourage artisans to discover the studio's depth.

---

## 3. Visual Identity: Cottagecore & Solarized Warmth

The aesthetic is "Analog-Digital"—a digital grid with the warmth of natural materials.

- **The Palette**: Strictly adhere to the **Solarized** base colors with **Artisan Magenta** as the primary focus.
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

Sound is 50% of the Rupa experience. It anchors the artisan in the meditative state.

- **Generative Soundscapes**: The **Ambient Engine** produces real-time piano melodies that evolve with the user's activity.
- **Tactile SFX**:
  - _Stitch_: A soft wooden "clack."
  - _Unstitch_: A paper-like "rub."
  - _Move_: A light "tap" or "slide."
- **Silence as a Feature**: Respect the silence. SFX should be subdued and never overwhelm the generative music.

---

## 5. Interaction Design: Keyboard Weaving

Rupa is a "Keyboard-First" environment. The hands should rarely leave the home row, creating a flow state similar to playing a musical instrument.

- **LoomIntents**: All interactions are semantic. A "Shortcut" is actually a "Chord" played on the keyboard.
- **The Flow**: Holding modifiers (Ctrl/Shift) should trigger continuous "Threading" or "Looming," making the artisan feel like they are pulling thread across the fabric.
- **Camera Protocol**: The viewport should automatically track the Needle, ensuring the artisan never has to manually pan the view while in the "zone."

---

## 6. UX Checklist for Developers

When adding a new feature, ask:

1. Is it reachable via a keyboard chord?
2. Does it have a tactile sound or visual glow?
3. Does it fit within the Solarized/Cottagecore aesthetic?
4. Does it make the user feel more relaxed or more stressed? (Goal: Relaxed).
5. Does it feel like a "tool" or a "toy"? (Goal: A professional tool that feels like a toy).
