global.fetch = url => {
  let success;
  if (url.includes('nodea') || url.includes('nodeb') || url.includes('nodec')) {
    success = {
      status: 200,
      text: () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (url.includes('nodea')) {
              resolve('a');
            } else if (url.includes('nodeb')) {
              resolve('b');
            } else if (url.includes('nodec')) {
              resolve('c');
            }
          }, 10);
        }),
    };
  } else if (url.includes('nodefail')) {
    success = {
      status: 500,
    };
  }

  return new Promise((resolve, reject) => {
    resolve(success);
  });
};
