# Technical Specifications: Rupa

## 1. Grid Mechanics
- **Linen Size:** Default 32x32.
- **Coordinate System:**
  - Internal: Zero-indexed flat array (`y * width + x`).
  - Display: Center-relative (Cartesian) with no zero-row for even dimensions.
- **Stitch Data:** Hex color strings. Empty cells use studio-specific cream `#eee8d5`.

## 2. LoomPad Intent Schema
Every interaction must be mapped to a `LoomIntent`.
- `MOVE_X`: Translation intents.
- `FLOW_X`: Momentary modifier states.
- `OPEN_X`: UI overlay transitions.

## 3. Visual Identity
- **Primary Color:** Artisan Magenta `#D33682`.
- **Background:** Natural Paper texture with Solarized Base 3.
- **Typography:** 
  - Brand: Tiny5 (Pixel font).
  - Serif: EB Garamond.
  - Body: Lora.

## 4. Performance Requirements
- **Input Latency:** Must be < 16ms (60fps) for smooth navigation.
- **SVG Export:** intelligent path-merging required to keep vector artifacts small.
- **History:** Command Pattern stack depth of 500.
