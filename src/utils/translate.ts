export const translate = (term: string, plural = false) => {
  if (window.translations[term]) {
    if (plural) {
      if (window.translations[term].other) {
        return window.translations[term].other;
      }
        console.warn(`Unknown translation for ${term} plural`);
        return window.translations[term].one;
    }
      return window.translations[term].one;
  }
    console.warn(`Unknown translation for ${term}`);
    return term;
};

export const initTranslate = (lang: string) => {
  (window as any).t = translate;
  if (lang === 'en') {
    window.translations = require('../translations_en').translations;
  } else if (lang === 'cn') {
    window.translations = require('../translations_cn').translations;
  } else {
    console.error(`Unknown language ${lang}`);
    window.translations = require('../translations_en').translations;
  }
};

declare global {
  var t: (term: string, plural?: boolean) => string;
}
