const fs = require('fs');
const https = require('https');
const querystring = require('querystring');
//const translations = require('./translations').translations;

const POEDITOR_API_TOKEN = require('./env').POEDITOR_API_TOKEN;
const POEDITOR_ID = require('./env').POEDITOR_ID;
const POEDITOR_LANG = require('./env').POEDITOR_LANG;
const DAPPY_LANG = require('./env').DAPPY_LANG;

const url = `https://api.poeditor.com/v2/projects/export?api_token=${POEDITOR_API_TOKEN}?id=${POEDITOR_ID}?type=json?language=${POEDITOR_LANG}`;

const main = async () => {
  const translations = await new Promise((resolve) => {
    const postData = querystring.stringify({
      api_token: POEDITOR_API_TOKEN,
      id: POEDITOR_ID,
      type: 'json',
      language: POEDITOR_LANG,
    });
    const options = {
      hostname: 'api.poeditor.com',
      port: 443,
      path: `/v2/projects/export`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        const url = JSON.parse(d.toString('utf8')).result.url;

        const req2 = https.get(url, (res2) => {
          let data = '';
          res2.on('data', (d2) => {
            data += d2.toString('utf8');
          });
          res2.on('end', () => {
            resolve(JSON.parse(data));
          });
        });

        req2.end();
      });
    });

    req.end(postData);
  });

  const obj = {};

  let missing = 0;
  translations.forEach((t) => {
    if (!t.definition) {
      missing += 1;
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
        other: DAPPY_LANG === 'cn' ? t.definition.one || t.definition.other : t.term_plural || t.definition.other,
      };
    }
  });

  if (missing > 0) console.log(missing, 'missing definitions for language', POEDITOR_LANG);

  fs.writeFileSync(
    'translations_' + POEDITOR_LANG + '.js',
    `module.exports.translations = ${JSON.stringify(translations, null, 2)}`
  );
  fs.writeFileSync(
    '../src/translations_' + DAPPY_LANG + '.js',
    `module.exports.translations = ${JSON.stringify(obj, null, 2)}`
  );

  console.log('src/translations_' + DAPPY_LANG + '.js created !\n');
};

main();
