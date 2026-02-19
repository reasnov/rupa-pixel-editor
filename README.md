# Rupa Pixel Editor (Editor) ☕

**Rupa** is a professional-grade, meditative pixel art editor designed for digital baristas. It combines a keyboard-first workflow with a "Cottagecore" aesthetic, turning pixel art into a tactile craft of digital brewing.

[![Version](https://img.shields.io/badge/version-0.9.0-magenta.svg)](./docs/pubs/releases/v0.9.0.md)
[![Architecture](https://img.shields.io/badge/architecture-Modular%20Layered%20Monolith-teal.svg)](./docs/developers/architecture.md)
[![Framework](https://img.shields.io/badge/framework-Svelte%205-orange.svg)](https://svelte.dev)

---

## ✨ Features (v0.9.0: The Kinetic Flow)

- **The Drop Matrix**: Professional grid-based timeline for high-density animation management.
- **Syrup Flow (Propagation)**: Automated projection of selections across frames with linear offsets.
- **The Chronos Protocol**: 100% deterministic animation export for perfect Videos and GIFs.
- **The Temporal Echo**: Advanced multi-frame onion skinning with directional color tints.
- **Aroma Pulse**: Procedural layer modifiers (Wiggle, Sway) for effortless organic motion.
- **Steeped Layers**: Automatic cross-frame cell linking for synchronized static elements.
- **Master Etcher's Kit**: Professional tools including Mirror Symmetry, Dynamic Brush Sizes, and Shading.
- **Canvas-Powered Grid**: High-speed HTML5 Canvas rendering for limitless pixel creativity.
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

## 🐧 Linux Troubleshooting

If you encounter issues starting the application on Linux (e.g., "The SUID sandbox helper binary was found, but is not configured correctly"), you may need to enable unprivileged user namespaces or run with the sandbox disabled manually:

```bash
# Option A: Fix your system (Recommended)
sudo sysctl -w kernel.unprivileged_userns_clone=1

# Option B: Run with flags if Option A is not possible
# npm run electron:dev -- --no-sandbox
```

## 📖 Documentation

- [User Guide](./docs/USER_GUIDE.md)
- [Developer Specs](./docs/developers/specs.md)
- [Latest Release Notes](./docs/pubs/releases/v0.9.0.md)

---

_"We do not just paint pixels; we etch moments into the crema of time."_
