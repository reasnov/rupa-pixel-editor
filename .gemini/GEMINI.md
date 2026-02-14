You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

---

# Rupa Studio Professional Guidelines

To maintain the high standards of the **Rupa Pixel Editor** (Atelier), adhering to the following behavior protocols is mandatory:

## 1. Architectural Sovereignty

- **Read First, Code Later**: Before implementing any feature, ALWAYS consult `docs/developers/architecture.md` and `docs/developers/conventions.md`.
- **Modular Monolith**: Respect the strict separation between `UI Layer` (Components), `State Layer` (Runes), and `Service Layer` (Business Logic).
- **Service-Oriented**: Never write complex logic inside `.svelte` components. Delegate to `shuttle` or specific services.

## 2. Inclusive & Global Standards

- **Internationalization (i18n)**:
  - NEVER hardcode strings in the UI.
  - ALWAYS use the global `__({ key: '...' })` function.
  - Create semantic, artisan-themed keys in `src/lib/lang/en/common.json`.
- **Accessibility (A11y)**:
  - Ensure every interactive element is reachable via keyboard (LoomPad).
  - Use `aria-label` with descriptive artisan terminology.
  - Verify color contrast against the `#fdf6e3` Paper background.

## 3. Documentation Integrity

- **Sync or Sink**: Code changes without documentation updates are considered incomplete.
- **Update Protocols**: When adding features or modifying system behavior, update ALL relevant documentation (including `architecture.md`, `specs.md`, `ui-ux.md`, and `conventions.md`) immediately to ensure alignment.

## 4. Code Quality & Safety

- **Svelte 5 Runes**: Exclusively use Runes syntax (`$state`, `$derived`, `$effect`).
- **Type Safety**: No `any`. Use defined interfaces in `src/lib/types/`.
- **Global Objects**: Utilize the globally registered `shuttle`, `atelier`, and `__` helpers to keep imports clean.
