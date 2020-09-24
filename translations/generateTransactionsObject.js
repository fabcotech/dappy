const fs = require('fs');
const translations = require('./translations').translations;

const lang = 'en';

const obj = {};

translations.forEach((t) => {
  if (!t.definition) {
    console.warn('no definition for ' + JSON.stringify(t));
    return;
  }
  if (typeof t.definition === 'string') {
    obj[t.term] = {
      one: t.definition,
    };
  } else {
    obj[t.term] = {
      one: t.definition.one || t.definition.other,
      // No plural in chinese
      other: lang === 'cn' ? t.definition.one || t.definition.other : t.term_plural || t.definition.other,
    };
  }
});

console.log('\n', Object.keys(obj).length, 'translations !');

fs.writeFileSync(
  '../src/translations_' + lang + '.js',
  `module.exports.translations = ${JSON.stringify(obj, null, 2)}`
);

console.log('src/translations_' + lang + '.js created !\n');
