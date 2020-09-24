
Rename `getTranslationsDownloadLink.sh.example` by `getTranslationsDownloadLink.sh`. 

Choose lang between "zh-cn" and "en" in getTranslationsDownloadLink.sh

Get the translation link with ./getTranslationsDownloadLink.sh

Download with ./downloadTranslations.sh

Rename the created file translations.js

Add `module.exports.translations = ` in the beginning of the file.

Execute `node generateTransactionsObject.js`, enventually change the `lang =` in this file. Transaction file is added in `src`.