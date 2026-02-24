import i18next from 'i18next';

// Automatically glob all JSON files in the lang/en directory
const enResources: Record<string, any> = import.meta.glob('../lang/en/*.json', {
	eager: true,
	import: 'default'
});

/**
 * i18nState: Manages the studio's language and translations.
 * Uses Svelte 5 Runes for reactivity.
 */
class I18nState {
	locale = $state('en');
	isReady = $state(false);

	constructor() {
		this.init();
	}

	private async init() {
		const resources: Record<string, any> = { en: {} };
		const namespaces: string[] = [];

		// Process globbed resources
		for (const path in enResources) {
			// Extract filename without extension (e.g., '../lang/en/common.json' -> 'common')
			const ns = path.split('/').pop()?.replace('.json', '');
			if (ns) {
				resources.en[ns] = enResources[path];
				namespaces.push(ns);
			}
		}

		await i18next.init({
			lng: this.locale,
			fallbackLng: 'en',
			resources,
			ns: namespaces,
			defaultNS: 'common',
			interpolation: {
				escapeValue: false
			}
		});
		this.isReady = true;
	}

	async setLocale(newLocale: string) {
		this.locale = newLocale;
		await i18next.changeLanguage(newLocale);
	}
}

export const i18nState = new I18nState();

/**
 * The Artisan's Translation Function
 * MUST be imported manually in every component.
 * Supports: __('namespace:key', { replace: { ... } }) or backward compat __({ key: '...' })
 */
export function __(
	keyOrOptions: string | { key: string; replace?: Record<string, any>; locale?: string },
	options: { replace?: Record<string, any>; locale?: string } = {}
) {
	if (!i18nState.isReady) return typeof keyOrOptions === 'string' ? keyOrOptions : keyOrOptions.key;

	let key: string;
	let replace = options.replace || {};
	let locale = options.locale || i18nState.locale;

	if (typeof keyOrOptions === 'string') {
		key = keyOrOptions.toLowerCase();
	} else {
		key = keyOrOptions.key.toLowerCase();
		replace = keyOrOptions.replace || replace;
		locale = keyOrOptions.locale || locale;
	}

	const val = i18next.t(key, {
		...replace,
		lng: locale,
		returnObjects: true
	});

	// Check if key exists and log warning if missing
	if (!i18next.exists(key, { lng: locale })) {
		const msg = `[i18n] Missing translation key: "${key}" for locale: "${locale}"`;
		if (typeof window !== 'undefined' && window.electronAPI?.logWarn) {
			// ANSI Yellow (plain) for terminal visibility
			window.electronAPI.logWarn(`\x1b[33m${msg}\x1b[0m`);
		}
	}

	if (typeof val === 'object' && val !== null) {
		const { artisan, technical } = val as any;
		if (artisan && technical) {
			return `${artisan} (${technical})`;
		}
	}

	return val as unknown as string;
}
