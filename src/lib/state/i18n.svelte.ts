import i18next from 'i18next';
import enCommon from '../lang/en/common.json' with { type: 'json' };

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
		await i18next.init({
			lng: this.locale,
			fallbackLng: 'en',
			resources: {
				en: {
					common: enCommon
				}
			},
			ns: ['common'],
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
 * @param key The translation key (e.g., 'hud.actions.preserve_weave')
 * @param replace Object containing interpolation values
 * @param locale Optional locale override
 */
export function __({
	key,
	replace = {},
	locale
}: {
	key: string;
	replace?: Record<string, any>;
	locale?: string;
}) {
	if (!i18nState.isReady) return key;

	const val = i18next.t(key, {
		...replace,
		lng: locale || i18nState.locale,
		returnObjects: true
	});

	if (typeof val === 'object' && val !== null) {
		const { artisan, technical } = val as any;
		if (artisan && technical) {
			return `${artisan} (${technical})`;
		}
	}

	return val as unknown as string;
}
