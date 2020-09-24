let registryUri = undefined;
let currentLightValue = undefined;
let currentNonceValue = undefined;

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", () => {
    const newNonce = blockchainUtils.generateNonce();
    dappyRChain
      .transaction({
        term: `new basket, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
            lookup!(\`rho:id:${registryUri}\`, *entryCh) |
            for(entry <- entryCh) {
              entry!(
              {
                "type": "ADD_OR_UPDATE",
                "payload": {
                  "id": "light",
                  "file": "${currentLightValue === "on" ? "off" : "on"}",
                  "nonce": "${newNonce}",
                  "signature": "SIGN"
                }
              }, *stdout)
            } |
            basket!({ "status": "completed" })
          }`,
        signatures: {
          SIGN: currentNonceValue,
        },
      })
      .then((a) => {
        currentNonceValue = newNonce;
      });
  });

  const checkLight = () => {
    dappyRChain
      .fetch("dappy://" + registryUri + ".light")
      .then((a) => {
        const rholangTerm = JSON.parse(a).expr[0];
        if (!rholangTerm) {
          document.body.setAttribute("style", "background: #222;color:#FFF;");
          document.body.innerText = "Light is off\n\nclick to switch";
          return;
        }
        const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
        if (jsValue === "on") {
          currentLightValue = "on";
          document.body.setAttribute(
            "style",
            "background: #FAFAFA;color:#000;"
          );
          document.body.innerText = "Light is on\n\nclick to switch";
        } else {
          currentLightValue = "off";
          document.body.setAttribute("style", "background: #222;color:#FFF;");
          document.body.innerText = "Light is off\n\nclick to switch";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadFilesModule = () => {
    dappyRChain
      .fetch("dappy://REGISTRY_URI")
      .then((a) => {
        console.log(a);
        const rholangTerm = JSON.parse(a).expr[0];
        const jsObject = blockchainUtils.rhoValToJs(rholangTerm);
        registryUri = jsObject.registryUri.replace("rho:id:", "");
        currentNonceValue = jsObject.nonce;
        console.log("registryUri is", registryUri);
        console.log("currentNonceValue is", currentNonceValue);
        checkLight();
        setInterval(checkLight, 5000);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  loadFilesModule();
});
