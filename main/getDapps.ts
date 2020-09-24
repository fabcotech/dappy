import fs from 'fs';

export const getDapps = (path: string) => {
  const directories = fs.readdirSync(path + '/dapps/');
  const dapps = {};
  directories.forEach((d) => {
    dapps[d] = {
      js: encodeURI(fs.readFileSync(path + '/dapps/' + d + '/js.js', { encoding: 'utf8' })),
      css: encodeURI(fs.readFileSync(path + '/dapps/' + d + '/css.css', { encoding: 'utf8' })),
      html: encodeURI(fs.readFileSync(path + '/dapps/' + d + '/html.html', { encoding: 'utf8' })),
    };
  });
  return dapps;
};
