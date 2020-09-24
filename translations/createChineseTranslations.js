const fs = require('fs');
const english = require('./translations').translations;

const chinese = fs.readFileSync('./dappy_Chineseupdated.csv', 'utf8');

const obj = {};

chinese.split('\n').forEach((c, i) => {
  const term = c.split(',')[0];
  const trans = c.split(',')[3];
  const found = english.find(e => e.term === term);
  if (found) {
  } else {
    console.warn('Not found for ' + term + ' no' + i);
  }
});
