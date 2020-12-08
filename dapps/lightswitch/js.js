let registryUri = undefined;
let currentLightValue = undefined;
let currentNonceValue = undefined;
let publicKey = undefined;

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', () => {
    dappyRChain
      .exploreDeploys([
        // get all bags of the contratc, there should be just "index", and eventually "light"
        RChainTokenFiles.readBagsTerm(registryUri),
        // get the data associated with bag "light"
        RChainTokenFiles.readBagOrTokenDataTerm(registryUri, 'bags', 'light'),
      ])
      .then((response) => {
        const results = JSON.parse(response).results;
        if (!results[0].success || !results[1].success) {
          console.error('explore-deploy failed');
          return;
        }

        const bagDataLight = JSON.parse(results[1].data).expr[0];
        const lightOnOrOff = bagDataLight
          ? blockchainUtils.rhoValToJs(bagDataLight)
          : undefined;

        const rholangTerm = JSON.parse(results[0].data).expr[0];
        const bags = blockchainUtils.rhoValToJs(rholangTerm);

        // if a bag with ID "light" exists, simply update data associated to it
        if (bags['light']) {
          const payload = {
            nonce: bags['light'].nonce,
            newNonce: blockchainUtils.generateNonce(),
            bagId: 'light',
            data: encodeURI(lightOnOrOff === 'on' ? 'off' : 'on'),
          };

          // returns UInt8Array of the javascript object, in rholang process format
          const ba = blockchainUtils.toByteArray(payload);
          const term = RChainTokenFiles.updateBagDataTerm(
            registryUri,
            payload,
            'SIGN'
          );

          dappyRChain
            .transaction({
              term: term,
              signatures: {
                /*
                This string will need to be signed by the user, with he's private key,
                'SIGN' in rholang/term will then be replaced by the real signature
              */
                SIGN: blockchainUtils.uInt8ArrayToHex(ba),
              },
            })
            .then((a) => {
              console.log('transaction aired !');
            });
        } else {
          /*
          if no bag with ID "light" exists, we must create a new bag, and
          attach data to it (string "on" or string "off")
        */

          const newNonce = blockchainUtils.generateNonce();
          const payload = {
            bags: {
              light: {
                nonce: blockchainUtils.generateNonce(),
                publicKey: publicKey,
                n: '0',
                price: null,
                quantity: 1,
              },
            },
            data: {
              light: encodeURI('on'),
            },
            nonce: currentNonceValue,
            newNonce: newNonce,
          };

          // returns UInt8Array of the javascript object, in rholang process format
          const ba = blockchainUtils.toByteArray(payload);

          const term = RChainTokenFiles.createTokensTerm(
            registryUri,
            payload,
            'SIGN'
          );

          dappyRChain
            .transaction({
              term: term,
              signatures: {
                /*
                This string will need to be signed by the user, with he's private key,
                'SIGN' in rholang/term will then be replaced by the real signature
              */
                SIGN: blockchainUtils.uInt8ArrayToHex(ba),
              },
            })
            .then((a) => {
              console.log('transaction aired !');
              currentNonceValue = newNonce;
            });
        }
      });
  });

  const checkLight = () => {
    dappyRChain
      .fetch('dappy://' + registryUri + '.light')
      .then((a) => {
        const rholangTerm = JSON.parse(a).expr[0];
        if (!rholangTerm) {
          document.body.setAttribute('style', 'background: #222;color:#FFF;');
          document.body.innerText = 'Light is off\n\nclick to switch';
          return;
        }
        const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
        if (jsValue === 'on') {
          currentLightValue = 'on';
          document.body.setAttribute(
            'style',
            'background: #FAFAFA;color:#000;'
          );
          document.body.innerText = 'Light is on\n\nclick to switch';
        } else {
          currentLightValue = 'off';
          document.body.setAttribute('style', 'background: #222;color:#FFF;');
          document.body.innerText = 'Light is off\n\nclick to switch';
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadFilesModule = () => {
    dappyRChain
      .fetch('dappy://REGISTRY_URI')
      .then((a) => {
        const rholangTerm = JSON.parse(a).expr[0];
        const jsObject = blockchainUtils.rhoValToJs(rholangTerm);
        registryUri = jsObject.registryUri.replace('rho:id:', '');
        currentNonceValue = jsObject.nonce;
        publicKey = jsObject.publicKey;
        console.log('publicKey is', publicKey);
        console.log('registryUri is', registryUri);
        console.log('currentNonceValue is', currentNonceValue);
        checkLight();
        setInterval(checkLight, 5000);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  loadFilesModule();
});
