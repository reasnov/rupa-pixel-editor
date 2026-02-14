// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	const __APP_VERSION__: string;

	/**
	 * The Artisan's Global Translation Function
	 */
	function __({
		key,
		replace,
		locale
	}: {
		key: string;
		replace?: Record<string, any>;
		locale?: string;
	}): string;

	interface Window {
		electronAPI?: {
			saveFile: (content: string, defaultPath?: string) => Promise<string | null>;
			openFile: () => Promise<{ content: string; filePath: string } | null>;
			autoSave: (content: string) => Promise<string>;
		};
	}
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
