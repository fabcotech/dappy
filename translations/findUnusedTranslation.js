const fs = require('fs');

const src = fs.readFileSync('../dist/renderer/src.840a20f5.js', 'utf8');

const translations = require('../src/translations_en').translations;

const missing = [];
Object.keys(translations).forEach((tr) => {
  /*
    (ex: what is rev ?) hints are given as props to components and not used in the
    t('trad') way
  */
  if (tr.startsWith('what') || tr.startsWith('why')) {
    return;
  }
  if (!src.includes("t('" + tr) && !src.includes('t("' + tr)) {
    missing.push(tr);
  }
});

console.log(missing.join('\n'));
