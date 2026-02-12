# Contributing to the Atelier: An Artisan's Guide

First and foremost, thank you for your interest in contributing to the **Rupa Pixel Editor** (The Atelier). Our project thrives on the collective craftsmanship of digital artisans like you. Whether you are fixing a loose thread (bug) or weaving a new pattern (feature), your contributions are highly valued.

---

## 📜 The Artisan's Code (Code of Conduct)

By participating in this project, you agree to maintain a professional, respectful, and meditative environment. We value kindness, clarity, and the shared pursuit of digital craft.

---

## 🚀 How Can I Contribute?

### 1. Identifying Loose Threads (Reporting Bugs)
If you encounter an issue that disrupts the rhythm of the studio:
- Search the [GitHub Issue Tracker](https://github.com/reasnov/rupa-pixel-editor/issues) to see if it has already been reported.
- If not, open a new issue.
- Provide a clear, descriptive title and detailed steps to reproduce the behavior.
- Include your operating system and environment details.
- Describe the expected vs. actual behavior within the context of the "Digital Stitching" experience.

### 2. Suggesting New Patterns (Enhancements)
Have an idea to improve the studio?
- Open an issue with the `enhancement` label.
- Describe the proposed change and, most importantly, explain how it aligns with the project's **Keyboard-First** and **Cottagecore** philosophy.
- Consider how the feature would feel—is it tactile? Does it add to the meditative flow?

### 3. Weaving Code (Pull Requests)
1. **Fork the Repository:** Create your own branch from `main`.
2. **Adhere to the Blueprint:** Ensure your changes follow the established [Technical Architecture](./docs/developers/architecture.md).
3. **English Standard:** All code, comments, and documentation must be authored in English.
4. **Quality Assurance:**
   - Run `npm run check` to verify TypeScript and Svelte integrity.
   - Run `npm run format` to ensure the code matches the studio's aesthetic (Prettier).
5. **Documentation:** If you introduce new logic or intents, update the relevant files in the `docs/` directory.
6. **The Final Stitch:** Submit your PR with a clear description of what has changed and why.

---

## 🎨 Design Principles for Artisans

Every contribution must respect the core pillars of Rupa:

- **Keyboard-First (The Loom):** No feature should ever *require* a mouse. The keyboard is the primary instrument of the artisan.
- **Minimalist Aesthetic (The Sanctuary):** Keep the UI clean, warm, and free of clinical clutter. Use Solarized tones and organic textures.
- **Tactile Feedback (The Rhythm):** Every action should have a visual or auditory response (SFX). The artisan must "feel" the work.
- **Svelte 5 Runes (The Thread):** Utilize `$state`, `$derived`, and `$effect` for precise, fine-grained reactivity.

---

## 🛠 Studio Setup for Developers

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/rupa-pixel-editor.git
cd rupa-pixel-editor

# Install dependencies
npm install

# Start the dev environment (Vite + Electron)
npm run dev:all
```

---

## 📝 License & Rights

By contributing to Rupa Pixel Editor, you agree that your work will be licensed under the [MIT License](LICENSE).

---

*"Happy weaving, Artisan."*
