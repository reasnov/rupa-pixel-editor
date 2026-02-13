# Rupa Pixel Editor (Atelier)

<p align="center">
  <img src="static/rupa-logo.png" alt="Rupa Logo" width="400">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.5.0--alpha-d33682?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-859900?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Svelte-5-ff3e00?style=flat-square&logo=svelte" alt="Svelte 5">
  <img src="https://img.shields.io/badge/Electron-Desktop-47848F?style=flat-square&logo=electron" alt="Electron">
  <img src="https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS">
</p>

---

**Rupa Pixel Editor** is a professional-grade desktop application for creating pixel art through a keyboard-centric interface. Inspired by the philosophy of "Rupa" (form) and the traditional art of "Sulam" (Stitching), it offers a methodical, precise, and meditative drawing experience.

Built with **Svelte 5** and **Electron**, Rupa treats the digital grid as a piece of fine **Linen** and the cursor as a **Needle**, turning every interaction into a meaningful **Stitch**.

**Live Demo**: [**✨ Try the Live Demo**](https://reasnov.github.io/rupa-pixel-editor)

---

## 📖 Documentation

The project documentation has been restructured for clarity and depth. Please refer to the following guides:

- **[The Artisan's Vision](./docs/wiki/overview.md)**: Explore the core philosophy and "Cottagecore" aesthetic.
- **[User Guide](./docs/USER_GUIDE.md)**: A complete manual for navigating the Atelier and mastering the Needle.
- **[Terminology](./docs/wiki/terminology.md)**: Learn the language of craft (**Stitch**, **Motif**, **Swatch**).
- **[Technical Architecture](./docs/developers/architecture.md)**: In-depth look at Svelte 5 Runes, SOC Engine, and LoomPad.
- **[Technical Specifications](./docs/developers/specs.md)**: Detailed grid mechanics, intent schemas, and design standards.
- **[Latest Release Notes](./docs/pubs/releases/v0.5.0-alpha.md)**: Highlights and changes in the v0.5.0-alpha update.
- **[Security Policy](./SECURITY.md)**: Guidelines for reporting vulnerabilities.

---

## ✨ Key Features

- **Keyboard-Centric Workflow**: Full navigation and drawing control using the keyboard for zero-latency response.
- **Digital Stitching**: Use the **Threading** mode (Hold `Ctrl`) to "pull the thread" and color paths as you move.
- **Looming (Selection)**: Define persistent regions with **Marching Ants** visual feedback. Supports **Batch Fill** (`Shift+Space`).
- **SOC Engine**: High-performance modular architecture separating state from core business logic.
- **Smart SVG Artifacts**: Advanced export engine that merges connected stitches into optimized vector paths.
- **Retro Audio Feedback**: Real-time synthesized SFX for movement and drawing, reinforcing the tactile experience.

## 🖼️ Gallery

![The Artisan's Workshop](static/screenshots/screenshot-1.png)

## ⌨️ Quick Controls

| Key             | Action                                 |
| :-------------- | :------------------------------------- |
| `Arrow Keys`    | Move Needle (Active Focus)             |
| `Space`         | Stitch (Color Cell) / Fill Selection   |
| `Backspace`     | Unstitch (Clear Cell)                  |
| `Ctrl` (Hold)   | **Threading**: Auto-color on move      |
| `Shift` (Hold)  | **Looming**: Define selection area     |
| `[` / `]`       | Move Active Veil Up / Down             |
| `G`             | **Go To**: Jump to specific coordinate |
| `[1-9, 0]`      | Select Dye (Plays musical scale)       |
| `P` / `K`       | Open Pattern Catalog (Command Palette) |
| `F1` / `Ctrl+?` | Open **Artisan Codex** (User Guide)    |
| `Esc`           | Clear Selection / Dismiss UI           |

_For the full list of controls, see the **[User Guide](./docs/USER_GUIDE.md)**._

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/reasnov/rupa-pixel-editor.git
   cd rupa-pixel-editor
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Vite development server and Electron window simultaneously:

```bash
npm run dev:all
```

## 🛠 Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/) (Runes)
- **Desktop**: [Electron](https://www.electronjs.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

Created with ❤️ by [reasnov](https://github.com/reasnov)
