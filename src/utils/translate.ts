export const translate = (term: string, plural = false) => {
  if (translations[term]) {
    if (plural) {
      if (translations[term].other) {
        return translations[term].other;
      } else {
        console.warn('Unknown translation for ' + term + ' plural');
        return translations[term].one;
      }
    } else {
      return translations[term].one;
    }
  } else {
    console.warn('Unknown translation for ' + term);
    return term;
  }
};

export const initTranslate = (lang: string) => {
  window['t'] = translate;
  if (lang === 'en') {
    window.translations = require(`../translations_en`).translations;
  } else if (lang === 'cn') {
    window.translations = require(`../translations_cn`).translations;
  } else {
    console.warn('Unknown language ' + lang);
    window.translations = require(`../translations_en`).translations;
  }
};
