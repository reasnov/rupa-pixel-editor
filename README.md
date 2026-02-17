# Rupa Pixel Editor (Editor) ☕

**Rupa** is a professional-grade, meditative pixel art editor designed for digital baristas. It combines a keyboard-first workflow with a "Cottagecore" aesthetic, turning pixel art into a tactile craft of digital brewing.

[![Version](https://img.shields.io/badge/version-0.6.1-magenta.svg)](./docs/pubs/releases/v0.6.1.md)
[![Architecture](https://img.shields.io/badge/architecture-Modular%20Layered%20Monolith-teal.svg)](./docs/developers/architecture.md)
[![Framework](https://img.shields.io/badge/framework-Svelte%205-orange.svg)](https://svelte.dev)

---

## ✨ Features (v0.6.1: The High-Performance Canvas)

- **Canvas-Powered Grid**: High-speed HTML5 Canvas rendering for limitless pixel creativity.
- **Quick Shape Correction**: Snap rough strokes into perfect lines, arcs, and circles with a 600ms hold.
- **Adaptive Pixel Ruler**: Intelligent coordinate labels and GPU-accelerated markers.
- **The Timeline (Kinetic Mode)**: Professional temporal sequence management for pixel animations.
- **Barista Ecosystem**: A sun-drenched sanctuary with generative piano soundscapes and tactile feedback.

## 🏗️ Architectural Sovereignty

Rupa follows a strict **5-Layer Modular Monolith** pattern:

1. **UI Layer**: Pure presentational Svelte components.
2. **State Layer**: Reactive source of truth using Svelte 5 Runes.
3. **Service Layer**: Business logic and state orchestration.
4. **Engine Layer**: Hardware bridges (Audio, Input normalization).
5. **Logic Layer**: Pure, stateless mathematical algorithms.

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- [Bun](https://bun.sh/) (recommended for speed)

### Installation

```bash
git clone https://github.com/reasnov/rupa-pixel-editor.git
cd rupa-pixel-editor
npm install
```

### Development

```bash
# Start Vite and Electron simultaneously
npm run dev:all
```

## 📖 Documentation

- [User Guide](./docs/USER_GUIDE.md)
- [Developer Specs](./docs/developers/specs.md)
- [Latest Release Notes](./docs/pubs/releases/v0.6.1.md)

---

_"We do not just paint pixels; we etch moments into the crema of time."_
