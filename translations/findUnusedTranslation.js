const fs = require('fs');

const src = fs.readFileSync('../dist/src.6d5e3ab5.js', 'utf8');

const translations = require('../src/translations_en').translations;

const missing = [];
Object.keys(translations).forEach(tr => {
  if (!src.includes("t('" + tr) && !src.includes('t("' + tr)) {
    missing.push(tr);
  }
})

console.log(missing.join('\n'))