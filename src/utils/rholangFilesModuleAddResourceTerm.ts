export const rholangFilesModuleAddResourceTerm = (
  registryUri: string,
  fileId: string,
  fileBase64: string,
  signature: string,
  newNonce: string
) => {
  return `new entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
    lookup!(\`${registryUri}\`, *entryCh) |
    for(entry <- entryCh) {
      entry!(
        {
          "type": "ADD",
          "payload": {
            "id": "${fileId}",
            "file": "${fileBase64}",
            "nonce": "${newNonce}",
            "signature": "${signature}"
          }
        },
        *stdout
      )
    }
  }`;
};
