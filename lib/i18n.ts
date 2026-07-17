export type Language = 'en' | 'ur' | 'es' | 'ar' | 'fr' | 'de' | 'tr' | 'pt' | 'zh';

export const languageNames: Record<Language, string> = {
  en: 'English',
  ur: 'اردو',
  es: 'Español',
  ar: 'العربية',
  fr: 'Français',
  de: 'Deutsch',
  tr: 'Türkçe',
  pt: 'Português',
  zh: '中文'
};

export const defaultLanguage: Language = 'en';

export async function fetchDictionary(lang: Language): Promise<Record<string, string>> {
  try {
    const dict = await import(`../locales/${lang}.json`);
    return dict.default;
  } catch (e) {
    console.error(`Failed to load dictionary for ${lang}`, e);
    const fallback = await import(`../locales/en.json`);
    return fallback.default || {};
  }
}
