# UI/UX Guidelines: Japanese Roadside Cafe x Retro 8-bit

This document defines the principles for creating a meditative, rural, and aesthetic experience within the **Rupa Pixel Editor** (Editor). The identity is a deliberate intersection of a **Roadside Japanese Cafe** and a **Retro 8-bit Aesthetic**—where tranquil nature meets the charming limitations of vintage digital craft.

---

## 1. The Lore: The Roadside Sanctuary

_"By a quiet country road, where the forest meets the village, stands a humble wooden cafe. Inside, the air smells of old paper and fresh tea. A vintage computer hums in the corner, its glowing screen showing patterns of leaves and stone. This is the Artisan's Sanctuary—a place where every pixel is a deliberate stitch in the fabric of a rural story."_

Every interaction in Rupa should feel like a moment of low-fi mindfulness in this sanctuary.

---

## 2. Core Philosophy: The Lo-Fi Atelier

Rupa is a space for "Digital Ruralism." The UI balances organic warmth with mechanical precision.

- **8-bit Tactility**: Feedback should feel physical. Elements should "click" into place. Transitions should be sharp but smooth, like a well-oiled mechanical keyboard.
- **Structural Calmness**: A balanced layout reminiscent of a clean cafe counter.
- **Bi-Lateral Workspace**: Tools and project structure are split to optimize focus:
  - **Left (The Serving Table)**: Project hierarchy (**Frames** & **Layers**) and **Primary Vessels** (Core drawing & selection tools).
  - **Right (Artisan's Atelier)**: Artistic refinement (**Color**, **History**) and **Secondary Vessels** (Modifiers & Seals).
- **The Glow of the CRT**: Use subtle glows (like the Lantern Gold) to simulate the warmth of old monitors and cafe lanterns against the cool forest backdrop.

---

## 3. Visual Identity: Evergreen-Retro

The aesthetic is "Evergreen-Retro"—the freshness of a village morning mixed with the sharp clarity of pixel art.

### 3.1 The 20-Color Sanctuary Palette

| Group      | No  | Name              | Hex       | Role                       |
| ---------- | --- | ----------------- | --------- | -------------------------- |
| **Nature** | 1   | **Washi White**   | `#fdf6e3` | Background (Paper)         |
|            | 2   | **Rice Straw**    | `#f4f1bb` | Light Accent               |
|            | 3   | **Bamboo Shoot**  | `#d1e0d0` | Soft UI                    |
|            | 4   | **Sage Leaf**     | `#a3b18a` | Secondary Green            |
|            | 5   | **Fern Green**    | `#588157` | Primary Green              |
|            | 6   | **Deep Forest**   | `#3a5a40` | Deep Contrast              |
|            | 7   | **Evergreen**     | `#344e41` | Text / Ink                 |
|            | 8   | **Stone Path**    | `#dad7cd` | Borders / Grid             |
|            | 9   | **Mist Gray**     | `#8d99ae` | Cool Ambient               |
|            | 10  | **Night Indigo**  | `#2b2d42` | Deep Shadow                |
| **Craft**  | 11  | **Lantern Gold**  | `#b58900` | **Primary Accent (Brand)** |
|            | 12  | **Rust Clay**     | `#cb4b16` | Action / Alert             |
|            | 13  | **Sakura Pink**   | `#e5989b` | Decorative                 |
|            | 14  | **Ume Plum**      | `#6d597a` | Retro Accent               |
|            | 15  | **Aged Oak**      | `#b08968` | UI Panel                   |
|            | 16  | **Dark Walnut**   | `#7f5539` | Structure                  |
|            | 17  | **Morning Amber** | `#d4a373` | Warm Wood                  |
|            | 18  | **Matcha Dust**   | `#ccd5ae` | Olive Accent               |
|            | 19  | **River Stone**   | `#6b705c` | Muted Border               |
|            | 20  | **Forest Shadow** | `#333d29` | Deepest Neutral            |

---

## 4. Auditory Environment: The 8-bit Nature Protocol

Sound is the "Soul" of the cafe. It anchors the user in the retro-rural state.

- **Retro-Natural SFX**:
  - _Apply_: A fast triangle-wave "tink" (Ceramic/Wind chime).
  - _Sweep_: Filtered white noise (Bamboo broom on stone).
  - _Step_: Low-freq triangle "thump" (Step on tatami).
- **Generative 8-bit Melodies**: The **Ambient Engine** produces real-time melodies using warm triangle and square waves, mirroring the sounds of a village piano or a vintage synthesizer.

---

## 5. Interaction Design: Hybrid Crafting

Rupa balances the precision of the **Keyboard** (The Metronome) with the organic flow of the **Mouse** (The Artisan's Brush).

- **The Keyboard (The Structure)**: 100% sovereignty. Every action is a rhythmic chord.
- **The Mouse (The Spirit)**: Provides **"Fluid Moss-Painting."** Enables freehand curves as if painting on a mossy stone.
- **CRT Feel**: Hover states and active indicators use the "Lantern Gold" glow to guide the artisan's eye.

---

## 6. UX Checklist for the Rural Artisan

When adding a new feature, ask:

1. Does it feel like an object you would find in a rural Japanese cafe?
2. Is it reachable via a keyboard chord?
3. Does it have a tactile 8-bit sound or a soft, mossy glow?
4. Does it balance the "Coolness" of green with the "Warmth" of gold?
5. Does it make the user feel like they are weaving a story in a quiet village?

---

## 7. Accessibility (A11y): The Inclusive Sanctuary

- **High Contrast 8-bit**: Text must be readable and sharp. Focus indicators use a solid 2px Forest Green or Lantern Gold outline.
- **Rural ARIA**: Use `aria-label` with the cafe metaphor (e.g., `aria-label="Send hantaran tray"` for export).
- **Color Contrast**: All text must meet WCAG AA standards against the Washi (`#fdf6e3`) background.

---

## 8. Internationalization (i18n): Global Village

- **Artisan-Centric Keys**: Use semantic keys that reflect the cafe lore.
  - _Good_: `hud.actions.pour_pigment`, `hud.basin.washi_settings`, `hud.ledger.chronicle_log`.
- **Lore Integration**: Ensure translations capture the "Cool & Warm" tone of the Japanese roadside sanctuary.
