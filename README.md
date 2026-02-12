# Rupa Pixel Editor (Atelier)

<p align="center">
  <img src="static/rupa-logo.png" alt="Rupa Logo" width="400">
</p>

**Rupa Pixel Editor** is a professional-grade desktop application for creating pixel art through a keyboard-centric interface. Inspired by the philosophy of "Rupa" (form) and the traditional art of "Sulam" (Stitching), it offers a methodical, precise, and meditative drawing experience.

Built with **Svelte 5** and **Electron**, Rupa treats the digital grid as a piece of fine **Linen** and the cursor as a **Needle**, turning every interaction into a meaningful stitch.

**Live Demo**: [**✨ Try the Live Demo**](https://reasnov.github.io/rupa-pixel-editor)

---

## 📖 Documentation

The project documentation has been restructured for clarity and depth. Please refer to the following guides:

- **[The Artisan's Vision](./docs/wiki/overview.md)**: Explore the core philosophy and "Cottagecore" aesthetic.
- **[User Guide](./docs/USER_GUIDE.md)**: A complete manual for navigating the Atelier and mastering the Needle.
- **[Terminology](./docs/wiki/terminology.md)**: Learn the language of craft used throughout the studio.
- **[Technical Architecture](./docs/developers/architecture.md)**: In-depth look at Svelte 5 Runes, Electron integration, and the LoomPad engine.
- **[Technical Specifications](./docs/developers/specs.md)**: Detailed grid mechanics, intent schemas, and design standards.
- **[Project History](./docs/HISTORY.md)**: Changelogs and release milestones.
- **[Security Policy](./SECURITY.md)**: Guidelines for reporting vulnerabilities.

---

## ✨ Key Features

- **Keyboard-Centric Workflow**: Navigate the grid using arrow keys with zero-latency response.
- **Digital Stitching**: Use the **Stitch-Flow** mode (Hold `Ctrl`) to "pull the thread" and color paths as you move.
- **Artisan Bloom Cursor**: A dynamic inversion cursor that ensures visibility on any color without visual clutter.
- **Color Palette & Picker**: Full control over your "threads" with a keyboard-driven color selection system.
- **Pro Export Engine**: Export your creations as sharp PNGs or optimized SVGs.
- **Retro Audio Feedback**: Real-time synthesized SFX for movement and drawing, reinforcing the tactile experience.

## 🖼️ Gallery

![The Artisan's Workshop](static/screenshots/screenshot-1.png)

## ⌨️ Quick Controls

| Key | Action |
| :--- | :--- |
| `Arrow Keys` | Move Active Cell |
| `Space` | Stitch (Color Pixel) |
| `Backspace` | Unstitch (Clear Pixel) |
| `Ctrl` (Hold) | **Stitch-Flow**: Auto-color on move |
| `Shift` (Hold) | **Block Selection**: Select area |
| `[1-9, 0]` | Select Dye from Palette |
| `P` / `K` | Open Pattern Catalog (Command Palette) |
| `?` / `F1` | Show Help |

*For the full list of controls, see the **[User Guide](./docs/USER_GUIDE.md)**.*

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
