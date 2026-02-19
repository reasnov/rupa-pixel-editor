/**
 * i18nState: Manages the studio's language and translations.
 * Uses Svelte 5 Runes for reactivity.
 */
declare class I18nState {
    locale: string;
    isReady: boolean;
    constructor();
    private init;
    setLocale(newLocale: string): Promise<void>;
}
export declare const i18nState: I18nState;
/**
 * The Artisan's Translation Function
 * @param key The translation key (e.g., 'hud.actions.preserve_weave')
 * @param replace Object containing interpolation values
 * @param locale Optional locale override
 */
export declare function __({ key, replace, locale }: {
    key: string;
    replace?: Record<string, any>;
    locale?: string;
}): string;
export {};
