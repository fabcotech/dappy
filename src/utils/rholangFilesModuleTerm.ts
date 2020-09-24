export const rholangFilesModuleTerm = (
  publicKey: string,
  nonce: string,
  addFile?: { fileId: string; fileAsBase64: string }
) => {
  let term = `new 
    filesModuleCh,
    fileUriCh,
    addCh,
    entryCh,
    entryUriCh,
    updateUriCh,
    hashCh,
    verifySignatureCh,
    insertArbitrary(\`rho:registry:insertArbitrary\`),
    stdout(\`rho:io:stdout\`),
    secpVerify(\`rho:crypto:secp256k1Verify\`),
    blake2b256(\`rho:crypto:blake2b256Hash\`)
  in {


    // add a file
    contract addCh(payload, overrideIfExists, return) = {
      stdout!("addCh") |
      for (current <- filesModuleCh) {
        stdout!(*current) |
        match *current.get("files").contains(*payload.get("id")) and (not *overrideIfExists) {
          true => {
            return!("error: file id " ++ *payload.get("id") ++ " already exists") |
            filesModuleCh!(*current)
          }
          false => {
              blake2b256!(
                *current.get("nonce").toUtf8Bytes(),
                *hashCh
              ) |
              for (@hash <- hashCh) {
                secpVerify!(
                  hash,
                  *payload.get("signature").hexToBytes(),
                  *current.get("publicKey").hexToBytes(),
                  *verifySignatureCh
                ) |
                for (@result <- verifySignatureCh) {
                  match result {
                    true => {
                      new uriCh in {
                        insertArbitrary!(*payload.get("file"), *uriCh) |
                        for (uri <- uriCh) {
                          filesModuleCh!(
                            *current
                              .set(
                                "files",
                                *current
                                  .get("files")
                                  .set(
                                    *payload.get("id"),
                                    *uri
                                  )
                              )
                              .set(
                                "nonce",
                                *payload.get("nonce")
                              )
                          ) |
                          return!("success: file " ++ *payload.get("id") ++ " added")
                        }
                      }
                    }
                    false => {
                      return!("error: signature invalid") |
                      filesModuleCh!(*current)
                    }
                  }
                }
              }
          }
        }
      }
    } |

    contract entryCh(action, return) = {
      match *action.get("type") {
        "READ" => {
          for (current <<- filesModuleCh) {
            return!(*current)
          }
        }
        "ADD" => {
          addCh!(*action.get("payload"), false, *return)
        }
        "ADD_OR_UPDATE" => {
          addCh!(*action.get("payload"), true, *return)
        }
        _ => {
          return!("error: unknown action")
        }
      }
    } |

    insertArbitrary!(*entryCh, *entryUriCh) |

    for (entryUri <- entryUriCh) {ADD_FILE}
  }`;

  if (addFile) {
    term = term.replace(
      'ADD_FILE',
      `
      new x in {
        x!("${addFile.fileAsBase64}") |
        insertArbitrary!("${addFile.fileAsBase64}", *fileUriCh) |
        for (fileUri <- fileUriCh) {
          filesModuleCh!({
            "registryUri": *entryUri,
            "publicKey": "${publicKey}",
            "nonce": "${nonce}",
            "files": {
              "${addFile.fileId}": *fileUri
            },
            "version": "0.4"
          }) |
          stdout!({
            "registryUri": *entryUri,
            "publicKey": "${publicKey}",
            "nonce": "${nonce}",
            "files": {
              "${addFile.fileId}": *fileUri
            },
            "version": "0.4"
          })
        }
      }`
    );
  } else {
    term = term.replace(
      'ADD_FILE',
      `
    filesModuleCh!({
      "registryUri": *entryUri,
      "publicKey": "${publicKey}",
      "nonce": "${nonce}",
      "files": {},
      "version": "0.4"
    }) |
    stdout!({
      "registryUri": *entryUri,
      "publicKey": "${publicKey}",
      "nonce": "${nonce}",
      "files": {},
      "version": "0.4"
    })`
    );
  }

  return term;
};
