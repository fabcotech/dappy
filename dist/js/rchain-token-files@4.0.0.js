(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.RChainTokenFiles = {}));
}(this, (function (exports) { 'use strict';

  var mainTerm_1 = (newNonce, publicKey) => {
      return `new 
  mainCh,

  createCh,
  purchaseCh,
  sendCh,
  changePriceCh,
  entryCh,
  entryUriCh,
  setLockedCh,
  updateTokenDataCh,
  updateBagDataCh,
  verifySignatureAndUpdateNonceCh,
  justVerifySignatureCh,

  bags,
  bagsData,
  tokensData,

  insertArbitrary(\`rho:registry:insertArbitrary\`),
  stdout(\`rho:io:stdout\`),
  secpVerify(\`rho:crypto:secp256k1Verify\`),
  blake2b256(\`rho:crypto:blake2b256Hash\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`)
in {


  /*
    bags: {
      [bagId: String (incremental id)]: {
        publicKey: String (public key),
        n: Nil \\/ String (token id),
        price: Nil \\/ Int
        quantity: Int
      }
    }
  */
  bags!({/*DEFAULT_BAGS*/}) |

  /*
    bagsData: {
      [bagId: String (bag id)]: Any
    }
  */
  bagsData!({/*DEFAULT_BAGS_DATA*/}) |

  /*
    tokensData: {
      [n: Strig (token id)]: String (registry URI)
    }
  */
  tokensData!({/*DEFAULT_TOKENS_DATA*/}) |

  for (@(payload, signature, returnCh) <= verifySignatureAndUpdateNonceCh) {
    new hashCh, verifySignatureCh in {
      for (@current <<- mainCh) {
        blake2b256!(
          payload.set("nonce", current.get("nonce")).toByteArray(),
          *hashCh
        ) |
        for (@hash <- hashCh) {
          secpVerify!(
            hash,
            signature.hexToBytes(),
            current.get("publicKey").hexToBytes(),
            *verifySignatureCh
          )
        } |
        for (@result <- verifySignatureCh) {
          match result {
            true => {
              @returnCh!(true) |
              for (@c <- mainCh) {
                mainCh!(c.set("nonce", payload.get("newNonce")))
              }
            }
            false => {
              @returnCh!("error: Invalid signature, could not perform operation")
            }
          }
        }
      }
    }
  } |

  for (@(publicKey, signature, payload, nonce, returnCh) <= justVerifySignatureCh) {
    stdout!("justVerifySignatureCh") |
    new hashCh, verifySignatureCh in {
      blake2b256!(
        payload.set("nonce", nonce).toByteArray(),
        *hashCh
      ) |
      for (@hash <- hashCh) {
        secpVerify!(
          hash,
          signature.hexToBytes(),
          publicKey.hexToBytes(),
          *verifySignatureCh
        )
      } |
      for (@result <- verifySignatureCh) {
        @returnCh!(result)
      }
    }
  } |

  contract setLockedCh(payload, signature, return) = {
    stdout!("setLockedCh") |

    for (@current <<- mainCh) {
      match current.get("locked") {
        true => {
          return!("error: contract is already locked")
        }
        false => {
          new verifyCh in {
            verifySignatureAndUpdateNonceCh!((
              *payload,
              *signature,
              *verifyCh
            )) |
            for (@verified <- verifyCh) {
              match verified {
                true => {
                  for (@c <- mainCh) {
                    mainCh!(c.set("locked", true))
                  } |
                  return!(true)
                }
                err => {
                  return!(err)
                }
              }
            }
          }
        }
      }
    }
  } |

  contract updateTokenDataCh(payload, signature, return) = {
    stdout!("updateTokenDataCh") |

    for (@current <<- mainCh) {
      match current.get("locked") {
        true => {
          return!("error: contract is locked, cannot update token data")
        }
        false => {
          new verifyCh in {
            verifySignatureAndUpdateNonceCh!((
              *payload,
              *signature,
              *verifyCh
            )) |
            for (@verified <- verifyCh) {
              match verified {
                true => {
                  for (@currentTokensData <- tokensData) {
                    tokensData!(
                      currentTokensData.set(*payload.get("n"), *payload.get("data"))
                    )
                  } |
                  return!(true)
                }
                err => {
                  return!(err)
                }
              }
            }
          }
        }
      }
    }
  } |

  contract updateBagDataCh(payload, signature, return) = {
    stdout!("updateBagDataCh") |
    for (@currentBags <<- bags) {
      match currentBags.get(*payload.get("bagId")) {
        Nil => {
          return!("error : token (bag ID) " ++ *payload.get("bagId") ++ " does not exist")
        }
        bag => {
          new justVerifySignatureReturnCh in {
            justVerifySignatureCh!((
              bag.get("publicKey"),
              *signature,
              *payload,
              bag.get("nonce"),
              *justVerifySignatureReturnCh
            )) |
            for (@verified <- justVerifySignatureReturnCh) {
              match verified {
                true => {
                  for (@currentBagsData <- bagsData) {
                    bagsData!(
                      currentBagsData.set(*payload.get("bagId"), *payload.get("data"))
                    ) |
                    return!(true)
                  }
                }
                err => {
                  return!("error: Invalid signature, could not perform operation")
                }
              }
            }
          }
        }
      }
    }
  } |

  // add a token (1 or more)
  contract createCh(payload, signature, return) = {
    stdout!("createCh") |

    for (@current <<- mainCh) {
      match current.get("locked") {
        true => {
          return!("error: contract is locked, cannot create token")
        }
        false => {
          for (@currentBags <<- bags) {
            new verifyCh in {
              verifySignatureAndUpdateNonceCh!((
                *payload,
                *signature,
                *verifyCh
              )) |
              for (@verified <- verifyCh) {
                match verified {
                  true => {
                    new newBagIdCh in {
                      match currentBags.get(*payload.get("newBagId")) {
                        Nil => { newBagIdCh!(*payload.get("newBagId")) }
                        _ => { return!("error: bagId, already exists") }
                      } |

                      for (@newBagId <- newBagIdCh) {
                        for (_ <- bags) {
                          bags!(
                            currentBags.union(*payload.get("bags"))
                          )
                        } |

                        match *payload.get("data") {
                          Nil => {}
                          data => {
                            for (@currentBagsData <- bagsData) {
                              bagsData!(
                                currentBagsData.union(*payload.get("data"))
                              )
                            }
                          }
                        } |

                        return!(true)
                      }
                    }
                  }
                  err => {
                    return!(err)
                  }
                }
              }
            }
          }
        }
      }
    }
  } |

  // purchase token (1 or more)
  contract purchaseCh(payload, return) = {
    stdout!("purchaseCh") |
    for (@currentBags <<- bags) {
      match currentBags.get(*payload.get("bagId")) {
        Nil => {
          return!("error : token (bag ID) " ++ *payload.get("bagId") ++ " does not exist")
        }
        bag => {
          match bag.get("quantity") - *payload.get("quantity") >= 0 {
            false => {
              return!("error : not enough tokens in bag (bag ID: " ++ *payload.get("bagId") ++ ") available")
            }
            true => {
              new RevVaultCh, ownerRevAddressCh, purseVaultCh in {

                registryLookup!(\`rho:rchain:revVault\`, *RevVaultCh) |
                revAddress!("fromPublicKey", bag.get("publicKey").hexToBytes(), *ownerRevAddressCh) |

                for (@(_, RevVault) <- RevVaultCh; @ownerRevAddress <- ownerRevAddressCh) {
                  match (
                    *payload.get("purseRevAddr"),
                    ownerRevAddress,
                    *payload.get("quantity") * bag.get("price")
                  ) {
                    (from, to, amount) => {
                      @RevVault!("findOrCreate", from, *purseVaultCh) |
                      for (@(true, purseVault) <- purseVaultCh) {
                        new resultCh, newBagIdCh, performRefundCh in {
                          // refund
                          for (@message <- performRefundCh) {
                            new refundPurseBalanceCh, refundRevAddressCh, refundResultCh in {
                              @purseVault!("balance", *refundPurseBalanceCh) |
                              revAddress!("fromPublicKey", *payload.get("publicKey").hexToBytes(), *refundRevAddressCh) |
                              for (@balance <- refundPurseBalanceCh; @revAddress <- refundRevAddressCh) {
                                @purseVault!("transfer", revAddress, balance, *payload.get("purseAuthKey"), *refundResultCh) |
                                for (@refundResult <- refundResultCh) {
                                  match refundResult {
                                    (true, Nil) => {
                                      stdout!("refund went well") |
                                      return!(message ++ ", issuer was refunded")
                                    }
                                    _ => {
                                      stdout!("error: refund DID NOT go well") |
                                      return!(message ++ ", issuer was NOT refunded")
                                    }
                                  }
                                }
                              }
                            }
                          } |
                          @purseVault!("transfer", to, amount, *payload.get("purseAuthKey"), *resultCh) |
                          for (@result <- resultCh) {
                            match result {
                              (true, Nil) => {
                                match currentBags.get(*payload.get("newBagId")) {
                                  Nil => { newBagIdCh!(*payload.get("newBagId")) }
                                  _ => { performRefundCh!("error: bagId, already exists") }
                                } |
                                for (@newBagId <- newBagIdCh) {
                                  for (_ <- bags) {
                                    match *payload.get("bagId") == "0" {
                                      true => {
                                        // purchase from bag "0"
                                        // creating a bag with new bag ID is allowed
                                        bags!(
                                          currentBags.set(newBagId, {
                                            "quantity": *payload.get("quantity"),
                                            "publicKey": *payload.get("publicKey"),
                                            "nonce": *payload.get("nonce"),
                                            "n": bag.get("n"),
                                            "price": Nil,
                                          // Udate quantity in seller token ownership
                                          }).set(
                                            *payload.get("bagId"),
                                            bag.set("quantity", bag.get("quantity") - *payload.get("quantity"))
                                          )
                                        ) |
                                        match *payload.get("data") {
                                          Nil => {}
                                          data => {
                                            for (@currentBagsData <- bagsData) {
                                              bagsData!(currentBagsData.set(newBagId, data))
                                            }
                                          }
                                        }
                                      }
                                      false => {
                                        // purchase from bag other than "0"
                                        // creating a bag with new bag ID is NOT allowed
                                        // buyer takes control of the bag
                                        // todo, should we delete bag data for *payload.get("bagId") here ?
                                        bags!(
                                          currentBags.set(*payload.get("bagId"), {
                                            "quantity": *payload.get("quantity"),
                                            "publicKey": *payload.get("publicKey"),
                                            "nonce": *payload.get("nonce"),
                                            "n": bag.get("n"),
                                            "price": Nil,
                                          })
                                        ) |
                                        match *payload.get("data") {
                                          Nil => {}
                                          data => {
                                            for (@currentBagsData <- bagsData) {
                                              bagsData!(currentBagsData.set(*payload.get("bagId"), data))
                                            }
                                          }
                                        }
                                      }
                                    } |
                                    return!(true)
                                  }
                                }
                              }
                              _ => {
                                performRefundCh!("error: REV transfer went wrong")
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } |

  contract sendCh(payload, signature, return) = {
    stdout!("sendCh") |
    for (@currentBags <<- bags) {
      match currentBags.get(*payload.get("bagId")) {
        Nil => {
          return!("error : token (bag ID) " ++ *payload.get("bagId") ++ " does not exist")
        }
        bag => {
          match currentBags.get(*payload.get("newBagId")) {
            Nil => {
              match bag.get("quantity") - *payload.get("quantity") >= 0 {
                true => {
                  new justVerifySignatureReturnCh in {
                    justVerifySignatureCh!((
                      bag.get("publicKey"),
                      *signature,
                      *payload,
                      bag.get("nonce"),
                      *justVerifySignatureReturnCh
                    )) |
                    for (@r <- justVerifySignatureReturnCh) {
                      match r {
                        true => {
                          // Add bag data if found in payload
                          match *payload.get("data") {
                            Nil => {}
                            data => {
                              for (@currentBagsData <- bagsData) {
                                bagsData!(currentBagsData.set(*payload.get("newBagId"), data))
                              }
                            }
                          } |
                          for (_ <- bags) {
                            match bag.get("quantity") - *payload.get("quantity") == 0 {
                              true => {
                                bags!(
                                  // todo, should we delete bag data for *payload.get("bagId") here ?
                                  currentBags.set(*payload.get("newBagId"), {
                                    "quantity": *payload.get("quantity"),
                                    "publicKey": *payload.get("publicKey"),
                                    "nonce": *payload.get("bagNonce2"),
                                    "n": bag.get("n"),
                                    "price": Nil,
                                  // Delete issuer bag
                                  }).delete(*payload.get("bagId"))
                                )
                              }
                              false => {
                                bags!(
                                  // New bag ID for new bag
                                  currentBags.set(*payload.get("newBagId"), {
                                    "quantity": *payload.get("quantity"),
                                    "publicKey": *payload.get("publicKey"),
                                    "nonce": *payload.get("bagNonce2"),
                                    "n": bag.get("n"),
                                    "price": Nil,
                                  // Udate quantity in seller bag
                                  }).set(
                                    *payload.get("bagId"),
                                    bag.set(
                                      "quantity", bag.get("quantity") - *payload.get("quantity")
                                    ).set(
                                      "nonce",
                                      *payload.get("bagNonce")
                                    )
                                  )
                                )
                              }
                            } |
                            return!(true)
                          }
                        }
                        false => {
                          return!("error: Invalid signature, could not perform operation")
                        }
                      }
                    }
                  }
                }
                false => {
                  return!("error : not enough tokens in bag (bag ID) " ++ *payload.get("bagId") ++ " available")
                }
              }
            }
            _ => {
              return!("error : new bag ID already exists")
            }
          }
        }
      }
    }
  } |

  contract changePriceCh(payload, signature, return) = {
    stdout!("changePriceCh") |
    for (@currentBags <<- bags) {
      match currentBags.get(*payload.get("bagId")) {
        Nil => {
          return!("error : token (bag ID) " ++ *payload.get("bagId") ++ " does not exist")
        }
        bag => {
          new justVerifySignatureReturnCh in {
            justVerifySignatureCh!((
              bag.get("publicKey"),
              *signature,
              *payload,
              bag.get("nonce"),
              *justVerifySignatureReturnCh
            )) |
            for (@r <- justVerifySignatureReturnCh) {
              match r {
                true => {
                  for (_ <- bags) {
                    bags!(
                      currentBags.set(
                        *payload.get("bagId"),
                        bag
                          .set("price", *payload.get("price"))
                          .set("nonce", *payload.get("bagNonce"))
                      )
                    ) |
                    return!(true)
                  }
                }
                false => {
                  return!("error: Invalid signature, could not perform operation")
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
      // Read capabilities
      "READ_BAGS" => {
        for (currentBags <<- bags) {
          return!(*currentBags)
        }
      }
      "READ_BAGS_DATA" => {
        for (currentBagsData <<- bagsData) {
          return!(*currentBagsData)
        }
      }
      "READ_TOKENS_DATA" => {
        for (@currentTokensData <<- tokensData) {
          return!(currentTokensData)
        }
      }
      "READ" => {
        for (current <<- mainCh) {
          return!(*current)
        }
      }
      // Admin capabilities (require a signature of the nonce)
      "SET_LOCKED" => {
        match *action.get("payload") {
          { "newNonce": String } => {
            setLockedCh!(
              *action.get("payload"),
              *action.get("signature"),
              *return
            )
          }
          _ => {
            return!("error: invalid payload, structure should be { 'newNonce': String, 'locked': Boolean }")
          }
        }
      }
      "UPDATE_TOKEN_DATA" => {
        match *action.get("payload") {
          { "newNonce": String, "n": String, "data": _ } => {
            updateTokenDataCh!(*action.get("payload"), *action.get("signature"), *return)
          }
          _ => {
            return!("error: invalid payload, structure should be { 'newNonce': String, 'n': String, 'data': _ }")
          }
        }
      }
      "UPDATE_BAG_DATA" => {
        match *action.get("payload") {
          { "newNonce": String, "bagId": String, "data": _ } => {
            updateBagDataCh!(
              *action.get("payload"),
              *action.get("signature"),
              *return
            )
          }
          _ => {
            return!("error: invalid payload, structure should be { 'newNonce': String, 'bagId': String, 'data': _ }")
          }
        }
      }
      "CREATE_TOKENS" => {
        match *action.get("payload") {
          {
            "bags": _,
            "data": _,
/*             "bags": {
              [String]: {
                "nonce": String,
                "quantity": Int,
                "publicKey": String,
                "n": String,
                "price": Nil \\/ Int,
              }
            },
            "data": {
              [String]: _
            }, */
            "newNonce": String,
          } => {
            createCh!(
              *action.get("payload"),
              *action.get("signature"),
              *return
            )
          }
          _ => {
            return!("error: invalid payload")
          }
        }
      }
      // Anyone capabilities
      "PURCHASE_TOKENS" => {
        match *action.get("payload") {
          { "quantity": 1, "bagId": String, "newBagId": String, "publicKey": String, "nonce": String, "data": _, "purseRevAddr": _, "purseAuthKey": _ } => {
            purchaseCh!(*action.get("payload"), *return)
          }
          _ => {
            return!("error: invalid payload, structure should be { 'quantity': 1, 'bagId': String, 'newBagId': String, 'publicKey': String, 'nonce': String, 'data': Any, 'purseRevAddr': String, 'purseAuthKey': AuthKey }")
          }
        }
      }
      "SEND_TOKENS" => {
        match *action.get("payload") {
          { "quantity": Int, "bagId": "0", "newBagId": String, "publicKey": String, "bagNonce": String, "bagNonce2": String, "data": _, } => {
            sendCh!(
              *action.get("payload"),
              *action.get("signature"),
              *return
            )
          }
          _ => {
            return!("error: invalid payload, structure should be { 'quantity': Int, 'bagId': '0', 'newBagId': String 'publicKey': String, 'bagNonce': String, 'bagNonce2': String, 'data': Any }")
          }
        }
      }
      "CHANGE_PRICE" => {
        match *action.get("payload") {
          { "bagId": String, "price": Nil \\/ Int, "bagNonce": String } => {
            changePriceCh!(
              *action.get("payload"),
              *action.get("signature"),
              *return
            )
          }
          _ => {
            return!("error: invalid payload, structure should be { 'price': Nil or Int, 'bagId': String, 'bagNonce': String }")
          }
        }
      }
      _ => {
        return!("error: unknown action")
      }
    }
  } |

  insertArbitrary!(bundle+{*entryCh}, *entryUriCh) |

  for (entryUri <- entryUriCh) {

    mainCh!({
      "registryUri": *entryUri,
      "locked": false,
      "publicKey": "${publicKey}",
      "nonce": "${newNonce}",
      "version": "4.0.0"
    }) |
    stdout!({
      "registryUri": *entryUri,
      "locked": false,
      "publicKey": "${publicKey}",
      "nonce": "${newNonce}",
      "version": "4.0.0"
    })

    /*OUTPUT_CHANNEL*/
  }
}
`;
  };

  var mainTerm = {
  	mainTerm: mainTerm_1
  };

  var createTokensTerm_1 = (
    registryUri,
    payload,
    signature,
  ) => {
    return `new basket,
  returnCh,
  entryCh,
  lookup(\`rho:registry:lookup\`),
  stdout(\`rho:io:stdout\`)
in {

  lookup!(\`rho:id:${registryUri}\`, *entryCh) |

  for(entry <- entryCh) {
    entry!(
      {
        "type": "CREATE_TOKENS",
        // signature of the payload + contract nonce in it, with the private key of the owner (generateSignatureForNonce.js)
        "signature": "${signature}",
        "payload": {
          // new nonce, must be different and random (generateNonce.js)
          "newNonce": "${payload.newNonce}",
          // example
          // "bags": { "0": { "price": 2, "quantity": 3, "publicKey": "aaa", "nonce": "abcdefba", data: Nil }}
          "bags": ${JSON.stringify(payload.bags).replace(new RegExp(': null|:null', 'g'), ': Nil')},
          // example
          // "data": { "0": "this bag is mine" }
          "data": ${JSON.stringify(payload.data).replace(new RegExp(': null|:null', 'g'), ': Nil')},
        }
      },
      *returnCh
    )
  } |

  for (resp <- returnCh) {
    match *resp {
      true => {
        basket!({ "status": "completed" }) |
        stdout!("completed, tokens created")
      }
      _ => {
        basket!({ "status": "failed", "message": *resp }) |
        stdout!(("failed", *resp))
      }
    }
  }
}
`;
  };

  var createTokensTerm = {
  	createTokensTerm: createTokensTerm_1
  };

  var purchaseTokensTerm_1 = (
    registryUri,
    payload
  ) => {
    return `
new
  basket,
  revVaultPurseCh,
  priceCh,
  quantityCh,
  publicKeyCh,
  nonceCh,
  bagDataCh,
  returnCh,
  bagIdCh,
  newBagIdCh,
  registryUriCh,
  revAddressCh,
  registryLookup(\`rho:registry:lookup\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`)
in {

  /*
    The 5 following values must be filled with proper values
  */ 
  // Registry URI of the contract
  registryUriCh!!(\`rho:id:${registryUri}\`) |
  // Unique ID of the token you want to purchase
  bagIdCh!!("${payload.bagId}") |
  // new bag ID (index, home, contact, document etc.)
  newBagIdCh!!("${payload.newBagId}") |
  // Per token price, make sure it is accurate
  priceCh!!(${payload.price || "Nil"}) |
  // Bag data: Any
  bagDataCh!!(${payload.data ? '"' + payload.data + '"' : "Nil"}) |
  // Quantity you want to purchase, make sure enough are available
  quantityCh!!(${payload.quantity}) |
  // Your public key
  // If the transfer fails, refund will go to the corresponding REV address
  publicKeyCh!!("${payload.publicKey}") |
  // A unique nonce to be changed on each operation
  nonceCh!!("${payload.bagNonce}") |

  registryLookup!(\`rho:rchain:revVault\`, *revVaultPurseCh) |

  /*
    Create a vault/purse that is just used once (purse)
  */
  for(@(_, *RevVaultPurse) <- revVaultPurseCh) {
    new unf, purseRevAddrCh, purseAuthKeyCh, vaultCh, revAddressCh in {
      revAddress!("fromUnforgeable", *unf, *purseRevAddrCh) |
      RevVaultPurse!("unforgeableAuthKey", *unf, *purseAuthKeyCh) |
      for (@purseAuthKey <- purseAuthKeyCh; @purseRevAddr <- purseRevAddrCh) {

        stdout!({"new purse rev addr": purseRevAddr, "purse authKey": purseAuthKey}) |

        RevVaultPurse!("findOrCreate", purseRevAddr, *vaultCh) |

        for (
          @(true, *vault) <- vaultCh;
          @publicKey <- publicKeyCh;
          @nonce <- nonceCh;
          @bagId <- bagIdCh;
          @newBagId <- newBagIdCh;
          @registryUri <- registryUriCh;
          @price <- priceCh;
          @bagData <- bagDataCh;
          @quantity <- quantityCh
        ) {

          revAddress!("fromPublicKey", publicKey.hexToBytes(), *revAddressCh) |

          new RevVaultCh in {

            registryLookup!(\`rho:rchain:revVault\`, *RevVaultCh) |
            for (@(_, RevVault) <- RevVaultCh; deployerRevAddress <- revAddressCh) {

              stdout!(("3.transfer_funds.rho")) |

              /*
                Put price * quantity REV in the purse
              */
              match (
                *deployerRevAddress,
                purseRevAddr,
                price * quantity
              ) {
                (from, to, amount) => {

                  new vaultCh, revVaultkeyCh, deployerId(\`rho:rchain:deployerId\`) in {
                    @RevVault!("findOrCreate", from, *vaultCh) |
                    @RevVault!("deployerAuthKey", *deployerId, *revVaultkeyCh) |
                    for (@(true, vault) <- vaultCh; key <- revVaultkeyCh) {

                      stdout!(("Beginning transfer of ", amount, "REV from", from, "to", to)) |

                      new resultCh, entryCh in {
                        @vault!("transfer", to, amount, *key, *resultCh) |
                        for (@result <- resultCh) {

                          stdout!(("Finished transfer of ", amount, "REV to", to, "result was:", result)) |
                          match result {
                            (true, Nil) => {
                              stdout!("yes") |
                              registryLookup!(registryUri, *entryCh) |

                              for(entry <- entryCh) {
                                stdout!(("GET ENTRY", *entry)) |
                                entry!(
                                  {
                                    "type": "PURCHASE_TOKENS",
                                    "payload": {
                                      "quantity": quantity,
                                      "bagId": bagId,
                                      "newBagId": newBagId,
                                      "data": bagData,
                                      "nonce": nonce,
                                      "publicKey": publicKey,
                                      "purseRevAddr": purseRevAddr,
                                      "purseAuthKey": purseAuthKey
                                    }
                                  },
                                  *returnCh
                                ) |
                                for (resp <- returnCh) {
                                  match *resp {
                                    true => {
                                      basket!({ "status": "completed" }) |
                                      stdout!("completed, tokens purchased")
                                    }
                                    _ => {
                                      basket!({ "status": "failed", "message": *resp }) |
                                      stdout!(("failed", *resp))
                                    }
                                  }
                                }
                              }
                            }
                            _ => {
                              basket!({ "status": "failed", "message": result }) |
                              stdout!(("failed", result))
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
  };

  var purchaseTokensTerm = {
  	purchaseTokensTerm: purchaseTokensTerm_1
  };

  var sendTokensTerm_1 = (
    registryUri,
    payload,
    signature, 
  ) => {
    return `new basket,
  returnCh,
  entryCh,
  lookup(\`rho:registry:lookup\`),
  stdout(\`rho:io:stdout\`)
in {

  lookup!(\`rho:id:${registryUri}\`, *entryCh) |

  for(entry <- entryCh) {
    entry!(
      {
        "type": "SEND_TOKENS",
        // signature of the payload + bag nonce in it, with the private key of the bag owner (generateSignatureForNonce.js)
        "signature": "${signature}",
        "payload": {
          // new nonce, must be different and random (generateNonce.js)
          "bagNonce": "${payload.bagNonce}",
          // new nonce for the new bag
          "bagNonce2": "${payload.bagNonce2}",
          // bag ID to send tokens from (ex: "0")
          "bagId": "${payload.bagId}",
          // new bag ID (index, home, contact, document etc.)
          "newBagId": "${payload.newBagId}",
          // quantity of tokens to send
          "quantity": ${payload.quantity},
          // publicKey this send those tokens to (can be the same just split a bag)
          "publicKey": "${payload.publicKey}",
          // data (optional) to be attached to the new bag (in bagsData)
          "data": ${payload.data ? '"' + payload.data + '"' : "Nil"}
        }
      },
      *returnCh
    )
  } |

  for (resp <- returnCh) {
    match *resp {
      true => {
        basket!({ "status": "completed" }) |
        stdout!("completed, tokens send")
      }
      _ => {
        basket!({ "status": "failed", "message": *resp }) |
        stdout!(("failed", *resp))
      }
    }
  }
}
`;
  };

  var sendTokensTerm = {
  	sendTokensTerm: sendTokensTerm_1
  };

  var setLockedTerm_1 = (registryUri, payload, signature) => {
    return `new basket,
  entryCh,
  returnCh,
  lookup(\`rho:registry:lookup\`),
  stdout(\`rho:io:stdout\`)
in {

  lookup!(\`rho:id:${registryUri}\`, *entryCh) |

  for(entry <- entryCh) {
    entry!(
      {
        "type": "SET_LOCKED",
        // signature of the payload + contract nonce in it, with the private key of the owner (generateSignatureForNonce.js)
        "signature": "${signature}",
        "payload": {
          // new nonce, must be different and random (generateNonce.js)
          "newNonce": "${payload.newNonce}",
        }
      },
      *returnCh
    )
  } |

  for (resp <- returnCh) {
    match *resp {
      true => {
        basket!({ "status": "completed" }) |
        stdout!("completed, contract locked")
      }
      _ => {
        basket!({ "status": "failed", "message": *resp }) |
        stdout!(("failed", *resp))
      }
    }
  }
}
`;
  };

  var setLockedTerm = {
  	setLockedTerm: setLockedTerm_1
  };

  var updateTokenDataTerm_1 = (
    registryUri,
    payload,
    signature, 
  ) => {
    return `new basket,
  entryCh,
  returnCh,
  lookup(\`rho:registry:lookup\`),
  stdout(\`rho:io:stdout\`)
in {

  lookup!(\`rho:id:${registryUri}\`, *entryCh) |

  for(entry <- entryCh) {
    entry!(
      {
        "type": "UPDATE_TOKEN_DATA",
        // signature of the payload + contract nonce in it, with the private key of the owner (generateSignatureForNonce.js)
        "signature": "${signature}",
        "payload": {
          // new nonce, must be different and random (generateNonce.js)
          "newNonce": "${payload.newNonce}",
          // token ID you want to attach data to
          "n": ${typeof payload.n == "string" ? '"' + payload.n + '"' : "Nil"},
          // data is used only if new token ("n" : Nil)
          "data": ${payload.data ? '"' + payload.data + '"' : "Nil"}
        }
      },
      *returnCh
    )
  } |

  for (resp <- returnCh) {
    match *resp {
      true => {
        basket!({ "status": "completed" }) |
        stdout!("completed, data updated")
      }
      _ => {
        basket!({ "status": "failed", "message": *resp }) |
        stdout!(("failed", *resp))
      }
    }
  }
}
`;
  };

  var updateTokenDataTerm = {
  	updateTokenDataTerm: updateTokenDataTerm_1
  };

  var updateBagDataTerm_1 = (
    registryUri,
    payload,
    signature,
  ) => {
    return `new basket,
  entryCh,
  returnCh,
  lookup(\`rho:registry:lookup\`),
  stdout(\`rho:io:stdout\`)
in {

  lookup!(\`rho:id:${registryUri}\`, *entryCh) |

  for(entry <- entryCh) {
    entry!(
      {
        "type": "UPDATE_BAG_DATA",
        // signature of the payload + bag nonce in it, with the private key of the bag owner (generateSignatureForNonce.js)
        "signature": "${signature}",
        "payload": {
          // new nonce, must be different and random (generateNonce.js)
          "newNonce": "${payload.newNonce}",
          // bag ID you want to attach data to
          "bagId": "${payload.bagId}",
          // data is used only if new token ("n" : Nil)
          "data": ${payload.data ? '"' + payload.data + '"' : "Nil"}
        }
      },
      *returnCh
    )
  } |

  for (resp <- returnCh) {
    match *resp {
      true => {
        basket!({ "status": "completed" }) |
        stdout!("completed, data updated")
      }
      _ => {
        basket!({ "status": "failed", "message": *resp }) |
        stdout!(("failed", *resp))
      }
    }
  }
}
`;
  };

  var updateBagDataTerm = {
  	updateBagDataTerm: updateBagDataTerm_1
  };

  var readBagOrTokenDataTerm_1 = (
    registryUri,
    bagsOrTokens,
    bagOrTokenId,
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
    lookup!(\`rho:id:${registryUri}\`, *entryCh) |
    for(entry <- entryCh) {
      new x in {
        entry!({ "type": "${bagsOrTokens === "tokens" ? "READ_TOKENS_DATA" : "READ_BAGS_DATA"}" }, *x) |
        for (y <- x) {
          return!(*y.get("${bagOrTokenId}"))
        }
      }
    }
  }`;
  };

  var readBagOrTokenDataTerm = {
  	readBagOrTokenDataTerm: readBagOrTokenDataTerm_1
  };

  var readBagsOrTokensDataTerm_1 = (
    registryUri,
    bagsOrTokens
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
    lookup!(\`rho:id:${registryUri}\`, *entryCh) |
    for(entry <- entryCh) {
      new x in {
        entry!({ "type": "${bagsOrTokens === "tokens" ? "READ_TOKENS_DATA" : "READ_BAGS_DATA"}" }, *x) |
        for (y <- x) {
          return!(*y)
        }
      }
    }
  }`;
  };

  var readBagsOrTokensDataTerm = {
  	readBagsOrTokensDataTerm: readBagsOrTokensDataTerm_1
  };

  var read_1 = (
    registryUri,
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
    lookup!(\`rho:id:${registryUri}\`, *entryCh) |
    for(entry <- entryCh) {
      new x in {
        entry!({ "type": "READ" }, *x) |
        for (y <- x) {
          return!(*y)
        }
      }
    }
  }`;
  };

  var read = {
  	read: read_1
  };

  var readBagsTerm_1 = (
    registryUri
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
    lookup!(\`rho:id:${registryUri}\`, *entryCh) |
    for(entry <- entryCh) {
      new x in {
        entry!({ "type": "READ_BAGS" }, *x) |
        for (y <- x) {
          return!(*y)
        }
      }
    }
  }`;
  };

  var readBagsTerm = {
  	readBagsTerm: readBagsTerm_1
  };

  var changePriceTerm_1 = (
    registryUri,
    payload,
    signature,
  ) => {
    return `new basket,
  returnCh,
  entryCh,
  lookup(\`rho:registry:lookup\`),
  stdout(\`rho:io:stdout\`)
in {

  lookup!(\`rho:id:${registryUri}\`, *entryCh) |

  for(entry <- entryCh) {
    entry!(
      {
        "type": "CHANGE_PRICE",
        // signature of the payload + bag nonce in it, with the private key of the bag owner (generateSignatureForNonce.js)
        "signature": "${signature}",
        "payload": {
          // new nonce, must be different and random (generateNonce.js)
          "bagNonce": "${payload.bagNonce}",
          // bag ID (ex: "0")
          "bagId": "${payload.bagId}",
          // quantity of tokens to send
          "price": ${payload.price || "Nil"},
        }
      },
      *returnCh
    )
  } |

  for (resp <- returnCh) {
    match *resp {
      true => {
        basket!({ "status": "completed" }) |
        stdout!("completed, bag price changed")
      }
      _ => {
        basket!({ "status": "failed", "message": *resp }) |
        stdout!(("failed", *resp))
      }
    }
  }
}
`;
  };

  var changePriceTerm = {
  	changePriceTerm: changePriceTerm_1
  };

  const { mainTerm: mainTerm$1 } = mainTerm;
  const { createTokensTerm: createTokensTerm$1 } = createTokensTerm;
  const { purchaseTokensTerm: purchaseTokensTerm$1 } = purchaseTokensTerm;
  const { sendTokensTerm: sendTokensTerm$1 } = sendTokensTerm;
  const { setLockedTerm: setLockedTerm$1 } = setLockedTerm;
  const { updateTokenDataTerm: updateTokenDataTerm$1 } = updateTokenDataTerm;
  const { updateBagDataTerm: updateBagDataTerm$1 } = updateBagDataTerm;
  const { readBagOrTokenDataTerm: readBagOrTokenDataTerm$1 } = readBagOrTokenDataTerm;
  const { readBagsOrTokensDataTerm: readBagsOrTokensDataTerm$1 } = readBagsOrTokensDataTerm;
  const { read: read$1 } = read;
  const { readBagsTerm: readBagsTerm$1 } = readBagsTerm;
  const { changePriceTerm: changePriceTerm$1 } = changePriceTerm;

  var src = {
    version: '4.0.0',
    mainTerm: mainTerm$1,
    createTokensTerm: createTokensTerm$1,
    purchaseTokensTerm: purchaseTokensTerm$1,
    sendTokensTerm: sendTokensTerm$1,
    setLockedTerm: setLockedTerm$1,
    updateTokenDataTerm: updateTokenDataTerm$1,
    updateBagDataTerm: updateBagDataTerm$1,
    readBagOrTokenDataTerm: readBagOrTokenDataTerm$1,
    readBagsOrTokensDataTerm: readBagsOrTokensDataTerm$1,
    read: read$1,
    readBagsTerm: readBagsTerm$1,
    changePriceTerm: changePriceTerm$1,
  };
  var src_1 = src.version;
  var src_2 = src.mainTerm;
  var src_3 = src.createTokensTerm;
  var src_4 = src.purchaseTokensTerm;
  var src_5 = src.sendTokensTerm;
  var src_6 = src.setLockedTerm;
  var src_7 = src.updateTokenDataTerm;
  var src_8 = src.updateBagDataTerm;
  var src_9 = src.readBagOrTokenDataTerm;
  var src_10 = src.readBagsOrTokensDataTerm;
  var src_11 = src.read;
  var src_12 = src.readBagsTerm;
  var src_13 = src.changePriceTerm;

  exports.changePriceTerm = src_13;
  exports.createTokensTerm = src_3;
  exports.default = src;
  exports.mainTerm = src_2;
  exports.purchaseTokensTerm = src_4;
  exports.read = src_11;
  exports.readBagOrTokenDataTerm = src_9;
  exports.readBagsOrTokensDataTerm = src_10;
  exports.readBagsTerm = src_12;
  exports.sendTokensTerm = src_5;
  exports.setLockedTerm = src_6;
  exports.updateBagDataTerm = src_8;
  exports.updateTokenDataTerm = src_7;
  exports.version = src_1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

