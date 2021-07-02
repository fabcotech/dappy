(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.RChainToken = {}));
}(this, (function (exports) { 'use strict';

  var boxTerm_1 = (payload) => {
    return `new 
  mainCh,
  entryCh,
  entryUriCh,
  returnBagsWithoutKeys,
  createKeyInBoxPurseIfNotExistCh,
  superKeysCh,
  readyCh,
  readyCounterCh,
  boxPursesCh,
  deployerId(\`rho:rchain:deployerId\`),
  stdout(\`rho:io:stdout\`),
  insertArbitrary(\`rho:registry:insertArbitrary\`),
  lookup(\`rho:registry:lookup\`)
in {

  // superKeys
  // { [URI]: key }
  superKeysCh!({}) |

  // keys
  // { [URI]: { [bagId: string]: key } }
  boxPursesCh!({}) |

  // returns { [URI]: Set[BagId] }
  contract returnBagsWithoutKeys(@(registryUris, keys, return)) = {
    new tmpCh, itCh in {
      for (@(tmpCh, registryUris) <= itCh) {
        for (tmp <- @tmpCh) {
          match registryUris {
            Nil => {
              @return!(*tmp)
            }
            Set(last) => {
              @return!(*tmp.set(last, keys.get(last).keys()))
            }
            Set(first ... rest) => {
              @tmpCh!(*tmp.set(first, keys.get(first).keys())) |
              itCh!((tmpCh, rest))
            }
          }
        }
      } |
      tmpCh!({}) |
      itCh!((*tmpCh, registryUris))
    }
  } |

  for (@(uri, return) <= createKeyInBoxPurseIfNotExistCh) {
    match uri {
      URI => {
        for (keys <<- boxPursesCh) {
          match *keys.get(uri) {
            Nil => {
              for (_ <- boxPursesCh) {
                boxPursesCh!(*keys.set(uri, {})) | @return!({})
              }
            }
            _ => {
              @return!(*keys.get(uri))
            }
          }
        }
      }
      _ => {
        @return!("error: unknown type")
      }
    }
  } |

  // PUBLIC capabilities
  /*
    (payload: { registryUri: URI, purse: *purse }) => String | (true, Nil)
    Receives a purse, checks it, find a purse with same type
    if fungible
      SWAP
    if non-fungible
      if a purse in box is found (same type AND price Nil): DEPOSIT
      else: SWAP and save new purse
  */
  // todo, if this operation fails, remove empty key in boxPurses ?
  for (@(payload, return) <= @(*entryCh, "PUBLIC_RECEIVE_PURSE")) {
    new lookupReturnCh, checkReturnCh, readReturnCh, readPropertiesReturnCh, return1Ch,
    itCh, doDepositOrSwapCh, decideToDepositOrSwpaCh in {

      /*
        1: check the purses received by asking
        the contract at payload.get("registryUri")
      */
      lookup!(payload.get("registryUri"), *lookupReturnCh) |
      for (contractEntry <- lookupReturnCh) {
        @(*contractEntry, "PUBLIC_CHECK_PURSES")!(([payload.get("purse")], *checkReturnCh)) |
        @(*contractEntry, "PUBLIC_READ")!((Nil, *readReturnCh)) |
        @(payload.get("purse"), "READ")!((Nil, *readPropertiesReturnCh)) |
        for (checkReturn <- checkReturnCh; current <- readReturnCh; receivedPurseProperties <- readPropertiesReturnCh) {
          match *checkReturn {
            String => {
              @return!(*checkReturn)
            }
            (true, _) => {
              /*
                2: create key for registry URI in boxPurses if it does
                nto exist
              */
              createKeyInBoxPurseIfNotExistCh!((payload.get("registryUri"), *return1Ch)) |

              /*
                3: find a purse to deposit into and
                decide to DEPOSIT or SWAP
                toto: if a purse is found check that it's not a purse
                that already exists in box
              */
              for (@purses <- return1Ch) {
                match purses {
                  String => {
                    @return!(purses)
                  }
                  _ => {
                    match *current.get("fungible") {
                      false => {
                        doDepositOrSwapCh!((
                          payload.get("purse"),
                          payload.get("registryUri"),
                          "swap",
                          Nil
                        ))
                      }
                      true => {
                        new tmpCh, itCh in {
                          for (pursesIds <= itCh) {
                            match *pursesIds {
                              Set() => {
                                doDepositOrSwapCh!((
                                  payload.get("purse"),
                                  payload.get("registryUri"),
                                  "swap",
                                  Nil
                                ))
                              }
                              Set(last) => {
                                new readReturnCh in {
                                  @(purses.get(last), "READ")!((Nil, *readReturnCh)) |
                                  for (properties <- readReturnCh) {
                                    match (
                                      *properties.get("type") == *receivedPurseProperties.get("type"),
                                      *properties.get("price") == Nil
                                    ) {
                                      (true, true) => {
                                        doDepositOrSwapCh!((
                                          payload.get("purse"),
                                          payload.get("registryUri"),
                                          "deposit",
                                          purses.get(last)
                                        ))
                                      }
                                      _ => {
                                        doDepositOrSwapCh!((
                                          payload.get("purse"),
                                          payload.get("registryUri"),
                                          "swap",
                                          Nil
                                        ))
                                      }
                                    }
                                  }
                                }
                              }
                              Set(first ... rest) => {
                                new readReturnCh in {
                                  @(purses.get(first), "READ")!((Nil, *readReturnCh)) |
                                  for (properties <- readReturnCh) {
                                    match (
                                      *properties.get("type") == *receivedPurseProperties.get("type"),
                                      *properties.get("price") == Nil
                                    ) {
                                      (true, true) => {
                                        doDepositOrSwapCh!((
                                          payload.get("purse"),
                                          payload.get("registryUri"),
                                          "deposit",
                                          purses.get(first)
                                        ))
                                      }
                                      _ => {
                                        itCh!(rest)
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          } |
                          itCh!(purses.keys())
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

      /*
        4: SWAP or DEPOSIT then save to boxPursesCh
      */
      for (@(purse, registryUri, operation, purseToDepositTo) <- doDepositOrSwapCh) {
        match operation {
          "swap" => {
            new returnSwapCh, returnReadMainCh, returnPropertiesCh in {
              for (main <<- mainCh) {
                @(purse, "SWAP")!((*main.get("publicKey"), *returnSwapCh)) |
                for (swappedPurse <- returnSwapCh) {
                  @(*swappedPurse, "READ")!((Nil, *returnPropertiesCh)) |
                  for (properties <- returnPropertiesCh) {
                    for (boxPurses <- boxPursesCh) {
                      boxPursesCh!(
                        *boxPurses.set(
                          registryUri,
                          *boxPurses.get(registryUri).set(
                            *properties.get("id"),
                            *swappedPurse
                          )
                        )
                      ) |
                      @return!((true, Nil))
                    }
                  }
                }
              }
            }
          }
          "deposit" => {
            new returnDepositCh, returnPropertiesCh in {
              @(purseToDepositTo, "DEPOSIT")!((purse, *returnDepositCh)) |
              for (r <- returnDepositCh) {
                match *r {
                  String => {
                    @return!(*r)
                  }
                  (true, Nil) => {
                    @return!((true, Nil))
                  }
                }
              }
            }
          }
        }
      }
    }
  } |

  for (@(Nil, return) <= @(*entryCh, "PUBLIC_READ")) {
    for (main <<- mainCh) {
      @return!(*main)
    }
  } |

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ_SUPER_KEYS")) {
    for (superKeys <<- superKeysCh) {
      @return!(*superKeys.keys())
    }
  } |

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ_PURSES")) {
    for (purses <<- boxPursesCh) {
      match *purses.keys().size() {
        0 => {
          @return!({})
        }
        _ => {
          returnBagsWithoutKeys!((*purses.keys(), *purses, return))
        }
      }
    }
  } |

  insertArbitrary!(*entryCh, *entryUriCh) |

  for (entryUri <- entryUriCh) {

    // OWNER / PRIVATE capabilities
    for (@(action, return) <= @(*deployerId, "\${n}" %% { "n": *entryUri })) {
      match action.get("type") {
        "READ" => {
          for (main <<- mainCh) {
            @return!(*main)
          }
        }
        "READ_SUPER_KEYS" => {
          for (superKeys <<- superKeysCh) {
            @return!(*superKeys)
          }
        }
        "READ_PURSES" => {
          for (purses <<- boxPursesCh) {
            @return!(*purses)
          }
        }
        "SAVE_PURSE_SEPARATELY" => {
          match (
            action.get("payload").get("registryUri"),
            action.get("payload").get("purse"),
          ) {
            (URI, _) => {
              new createKeyReturnCh, readReturnCh in {
                createKeyInBoxPurseIfNotExistCh!((action.get("payload").get("registryUri"), *createKeyReturnCh)) |
                for (purses <- createKeyReturnCh) {
                  match *purses {
                    String => {
                      @return!("error: invalid payload")
                    }
                    _ => {
                      @(action.get("payload").get("purse"), "READ")!((Nil, *readReturnCh)) |
                      for (@properties <- readReturnCh) {
                        for (boxPurses <- boxPursesCh) {
                          boxPursesCh!(
                            *boxPurses.set(
                              action.get("payload").get("registryUri"),
                              *purses.set(
                                properties.get("id"),
                                action.get("payload").get("purse")
                              )
                            )
                          ) |
                          @return!((true, Nil))
                        }
                      }
                    }
                  }
                }
              }
            }
            _ => {
              @return!("error: invalid payload")
            }
          }
        }
        "DELETE_PURSE" => {
          for (purses <<- boxPursesCh) {
            match action.get("payload") {
              payload => {
                match (
                  payload.get("registryUri"),
                  payload.get("id"),
                  *purses.get(payload.get("registryUri"))
                ) {
                  (URI, String, Map) => {
                    for (boxPurses <- boxPursesCh) {
                      boxPursesCh!(
                        *boxPurses.set(
                          payload.get("registryUri"),
                          *boxPurses.get(payload.get("registryUri")).delete(payload.get("id"))
                        )
                      ) |
                      @return!((true, Nil))
                    }
                  }
                  _ => {
                    @return!("error: invalid payload")
                  }
                }
              }
              _ => {
                @return!("error: invalid payload")
              }
            }
          }
        }
        "SAVE_SUPER_KEY" => {
          match action.get("payload") {
            { "superKey": _, "registryUri": URI } => {
              for (keys <- superKeysCh) {
                match *keys.keys().contains(action.get("payload").get("registryUri")) {
                  true => {
                    superKeysCh!(*keys) |
                    @return!("error: super key for registryUri already exists in box")
                  }
                  false => {
                    superKeysCh!(*keys.set(action.get("payload").get("registryUri"), action.get("payload").get("superKey"))) |
                    @return!((true, Nil))
                  }
                }
              }
            }
            _ => {
              @return!("error: invalid payload, structure should be { superKey: _, registryUri: String }")
            }
          }
        }
        _ => {
          @return!("error: unknown action")
        }
      }
    } |

    stdout!("box deployed, private channel is @(*deployerId, '\${n}')" %% { "n": *entryUri }  ) |
    mainCh!({
      "registryUri": *entryUri,
      "publicKey": "${payload.publicKey}",
      "version": "5.0.0",
      "status": "completed"
    })
  }
}
`;
  };

  var boxTerm = {
  	boxTerm: boxTerm_1
  };

  var mainTerm_1 = (fromBoxRegistryUri, payload) => {
      return `new 
  mainCh,

  entryCh,
  entryUriCh,
  iterateCh,
  makePurseCh,
  superKeyCh,

  /*
    vault stores the id for each purse unforgeable name, you
    must have a purse to receive / peek from *vault:
    // create purse "12"
    @(*vault, *purse)!("12")

    // peek and check purse
    for (id <<- @(*vault, *purse)) {
      out!(*purse) |
      // "12"
      for (purse <- @(*purses, "12")) {
        out!(*purse)
        // { "quantity": 100, "type": "GOLD", "publicKey": "aaa" }
      }
    }
  */
  vault,

  /*
    A purse's properties is a Map {"quantity", "type", "price", "publicKey"}
    stored in the channel *purses. Anyone can read it through
    "READ_PURSES" public channel.

    // create purse "12" (it must not exist)
    @(*purses, "12")!({ "publicKey": "aaa", etc... }) |

    // receive purse "12"
    for (purse <- @(*purses, "12")) {
      out!(*purse)
    }

    // peek purse "12"
    for (purse <<- @(*purses, "12")) {
      out!(*purse)
    }
  */
  purses,

  /*
    pursesIds is a Set with all ids of purses that have amount > 0
    for (ids <- pursesIds) { ... }
  */
  pursesIds,

  /*
    pursesData contains the data associated to purses
    for (data <- @(*pursesData, "12")) { ... }
  */
  pursesData,

  counterCh,

  insertArbitrary(\`rho:registry:insertArbitrary\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`),
  deployerId(\`rho:rchain:deployerId\`)
in {

  counterCh!(0) |

  pursesIds!(Set()) |

  /*
    MAKE PURSE
    only place where new purses are created
    "MINT", "SWAP", "CREATE_PURSES" call this channel

    depending on if .fungible is true or false, it decides
    which id to give to the new purse, then it instantiates
    the purse with WITHDRAW, SWAP, BURN "instance channels"
  */
  for (@(properties, data, return) <= makePurseCh) {
    new idAndQuantityCh in {
      for (current <<- mainCh) {
        match *current.get("fungible") {
          true => {
            for (counter <- counterCh) {
              counterCh!(*counter + 1) |
              idAndQuantityCh!({ "id": "\${n}" %% { "n": *counter }, "quantity": properties.get("quantity") })
            }
          }
          false => {
            for (ids <<- pursesIds) {
              match *ids.contains(properties.get("id")) {
                true => {
                  match properties.get("id") {
                    "0" => {
                      match (properties.get("newId"), *ids.contains(properties.get("newId"))) {
                        (String, false) => {
                          idAndQuantityCh!({ "id": properties.get("newId"), "quantity": 1 })
                        }
                        _ => {
                          @return!("error: no .newId in payload or .newId already exists")
                        }
                      }
                    }
                    _ => {
                      @return!("error: purse ID already exists")
                    }
                  }
                }
                false => { idAndQuantityCh!({ "id": properties.get("id"), "quantity": properties.get("quantity") }) }
              }
            }
          }
        }
      } |
      for (idAndQuantity <- idAndQuantityCh) {
        match properties
          .set("id", *idAndQuantity.get("id"))
          .set("quantity", *idAndQuantity.get("quantity"))
          .delete("newId")
        {
          purseProperties => {
            match purseProperties {
              {
                "quantity": Int,
                // not used in main contract or box contract
                // only useful for dumping data
                "publicKey": String,
                "type": String,
                "id": String,
                "price": Nil \\/ Int
              } => {
                for (ids <- pursesIds) {
                  match *ids.contains(purseProperties.get("id")) {
                    false => {
                      pursesIds!(*ids.union(Set(purseProperties.get("id")))) |
                      @(*purses, purseProperties.get("id"))!(purseProperties) |
                      @(*pursesData, purseProperties.get("id"))!(data) |
                      new purse in {
                        @(*vault, *purse)!(purseProperties.get("id")) |
                        @return!(*purse) |

                        /*
                          READ
                          Returns prperties "id", "quantity", "type", "publicKey" and "price"(not implemented)
                          (Nil) => propertie
                        */
                        for (@(Nil, returnRead) <= @(*purse, "READ")) {
                          for (id <<- @(*vault, *purse)) {
                            for (props <<- @(*purses, *id)) {
                              @returnRead!(*props.set("id", *id))
                            }
                          }
                        } |

                        /*
                          SWAP
                          (Nil) => purse
                          Useful when you receive purse from unknown source, swap it
                          to make sure emitter did not keep a copy
                        */
                        for (@(publicKey, returnSwap) <= @(*purse, "SWAP")) {
                          match publicKey {
                            String => {
                              for (id <- @(*vault, *purse)) {
                                for (ids <- pursesIds) {
                                  pursesIds!(*ids.delete(*id)) |
                                  for (data <- @(*pursesData, *id)) {
                                    for (props <- @(*purses, *id)) {
                                      makePurseCh!((
                                        *props.set("publicKey", publicKey), *data, returnSwap
                                      ))
                                    }
                                  }
                                }
                              }
                            }
                            _ => {
                              @returnSwap!("error: public key must be a string")
                            }
                          }
                        } |

                        /*
                          UPDATE_DATA
                          (any) => string | (true, purse[])
                        */
                        for (@(payload, returnUpdateData) <= @(*purse, "UPDATE_DATA")) {
                          new readReturnCh in {
                            @(*purse, "READ")!((Nil, *readReturnCh)) |
                            for (@properties <- readReturnCh) {
                              for (_ <- @(*pursesData, properties.get("id"))) {
                                @(*pursesData, properties.get("id"))!(payload) |
                                @returnUpdateData!((true, Nil))
                              }
                            }
                          }
                        } |

                        /*
                          SET_PRICE
                          (payload: Int or Nil) => string | (true, Nil)
                        */
                        for (@(payload, returnSetPrice) <= @(*purse, "SET_PRICE")) {
                          match payload {
                            Int \\/ Nil => {
                              new boxEntryCh, receivePursesReturnCh, readReturnCh, makePurseReturnCh in {
                                @(*purse, "READ")!((Nil, *readReturnCh)) |
                                for (@properties1 <- readReturnCh) {
                                  for (@properties2 <- @(*purses, properties1.get("id"))) {
                                    @(*purses, properties1.get("id"))!(
                                      properties2.set("price", payload)
                                    ) |
                                    @returnSetPrice!((true, Nil))
                                  }
                                }
                              }
                            }
                            _ => {
                              @returnSetPrice!("error: payload must be an integer or Nil")
                            }
                          }
                        } |

                        /*
                          WITHDRAW
                          (payload: Int) => string | (true, purse)
                        */
                        for (@(payload, returnWithdraw) <= @(*purse, "WITHDRAW")) {
                          match payload {
                            Int => {
                              new boxEntryCh, receivePursesReturnCh, readReturnCh, makePurseReturnCh in {
                                @(*purse, "READ")!((Nil, *readReturnCh)) |
                                for (@properties1 <- readReturnCh) {
                                  match (
                                    /*
                                      The remaining cannot be 0, if you want to send
                                      the whole purse, just hand the *purse object to someone's box
                                    */
                                    properties1.get("quantity") > payload,
                                    payload > 0
                                  ) {
                                    (true, true) => {
                                      /*
                                        change quantity in *purse, and create a new purse
                                        with [payload] quantity
                                      */
                                      for (@properties2 <- @(*purses, properties1.get("id"))) {
                                        @(*purses, properties1.get("id"))!(
                                          properties2.set("quantity", properties2.get("quantity") - payload)
                                        ) |
                                        makePurseCh!((
                                          properties2.set("quantity", payload).set("price", Nil), Nil, *makePurseReturnCh
                                        )) |
                                        for (newPurse <- makePurseReturnCh) {
                                          @returnWithdraw!((true, *newPurse))
                                        }
                                      }
                                    }
                                    _ => {
                                      @returnWithdraw!("error: quantity invalid, remaining cannot be zero")
                                    }
                                  }
                                }
                              }

                            }
                            _ => {
                              @returnWithdraw!("error: payload must be an integer")
                            }
                          }
                        } |

                        /*
                          DEPOSIT
                          (payload: purse) => string | (true, Nil)
                        */
                        for (@(payload, returnDeposit) <= @(*purse, "DEPOSIT")) {
                          new boxEntryCh, receivePursesReturnCh, readReturnCh in {
                            @(*purse, "READ")!((Nil, *readReturnCh)) |
                            for (@properties1 <- readReturnCh) {
                              for (id <<- @(*vault, payload)) {
                                for (@properties2 <<- @(*purses, *id)) {
                                  match (
                                    properties2.get("quantity"),
                                    properties2.get("quantity") > 0,
                                    properties1.get("type") == properties2.get("type"),
                                    properties1.get("price")
                                  ) {
                                    (Int, true, true, Nil) => {
                                      for (_ <- @(*vault, payload)) { Nil } |
                                      for (ids <- pursesIds) {
                                        pursesIds!(*ids.delete(*id))
                                      } |
                                      for (_ <- @(*pursesData, *id)) { Nil } |
                                      for (_ <- @(*purses, *id)) { Nil } |
                                      for (@properties <- @(*purses, properties1.get("id"))) {
                                        @(*purses, properties1.get("id"))!(
                                          properties.set(
                                            "quantity",
                                            properties.get("quantity") + properties2.get("quantity")
                                          )
                                        ) |
                                        @returnDeposit!((true, Nil))
                                      }
                                    }
                                    _ => {
                                      @returnDeposit!("error: cannot deposit to a purse with .price not Nil")
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    true => {
                      pursesIds!(*ids) |
                      @return!("error: purse ID already exists")
                    }
                  }
                }
              }
              _ => {
                @return!("error: invalid purse")
              }
            }
          }
        }
      }
    }
  } |

  // ====================================
  // SUPER / ADMIN / OWNER capabilities (if not locked)
  // You must have the superKeyCh to perform those operations
  // ====================================

  for (@(Nil, return) <= @(*superKeyCh, "LOCK")) {
    for (@current <<- mainCh) {
      match current.get("locked") {
        true => {
          @return!("error: contract is locked")
        }
        false => {
          for (current <- mainCh) {
            mainCh!(*current.set("locked", true)) |
            @return!((true, Nil))
          }
        }
      }
    }
  } |

  for (@(payload, return) <= @(*superKeyCh, "CREATE_PURSES")) {
    for (@current <<- mainCh) {
      match current.get("locked") {
        true => {
          @return!("error: contract is locked")
        }
        false => {
          new itCh, createdPursesesCh, saveKeyAndBagCh in {
            createdPursesesCh!([]) |
            itCh!((payload.get("purses").keys(), payload.get("purses"), payload.get("data"))) |
            for(@(set, newPurses, newData) <= itCh) {
              match set {
                Nil => {}
                Set(last) => {
                  new retCh in {
                    makePurseCh!((newPurses.get(last), newData.get(last), *retCh)) |
                    for (purse <- retCh) {
                      match *purse {
                        String => {
                          @return!(*purse)
                        }
                        _ => {
                          for (createdPurses <- createdPursesesCh) {
                            @return!((true, { "purses": *createdPurses ++ [*purse] }))
                          }
                        }
                      }
                    }
                  }
                }
                Set(first ... rest) => {
                  new retCh in {
                    makePurseCh!((newPurses.get(first), newData.get(first), *retCh)) |
                    for (purse <- retCh) {
                      match *purse {
                        String => {
                          @return!(*purse)
                        }
                        _ => {
                          for (createdPurses <- createdPursesesCh) {
                            createdPursesesCh!(*createdPurses ++ [*purse]) |
                            itCh!((rest, newPurses, newData))
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

  /*
    Returns values corresponding to ids, "PUBLIC_READ_PURSES"
    and "PUBLIC_PUBLIC_READ_PURSES_DATA" call this channel

    channelToReadFrom: *pursesData or *purses
    ids: Set purse ids (they must all exist)
    example iterateCh!((*pursesData, Set("1", "2", "18"), *return))
  */
  contract iterateCh(@(channelToReadFrom, ids, return)) = {
    new tmpCh, itCh in {
      for (@(tmpCh, ids) <= itCh) {
        for (tmp <- @tmpCh) {
          match ids {
            Nil => {
              @return!(*tmp)
            }
            Set(last) => {
              for (val <<- @(channelToReadFrom, last)) {
                @return!(*tmp.set(last, *val))
              }
            }
            Set(first ... rest) => {
              for (val <<- @(channelToReadFrom, first)) {
                @tmpCh!(*tmp.set(first, *val)) |
                itCh!((tmpCh, rest))
              }
            }
          }
        }
      } |
      tmpCh!({}) |
      itCh!((*tmpCh, ids))
    }
  } |


  // ====================================
  // ===== ANY USER / PUBLIC capabilities
  // ====================================

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ_PURSES_IDS")) {
    for (ids <<- pursesIds) {
      @return!(*ids)
    }
  } |

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ_PURSES")) {
    match payload.size() < 101 {
      true => {
        iterateCh!((*purses, payload, return))
      }
      _ => {
        @return!("error: payload must be a Set of strings with max size 100")
      }
    }
  } |

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ_PURSES_DATA")) {
    match payload.size() < 101 {
      true => {
        iterateCh!((*pursesData, payload, return))
      }
      _ => {
        @return!("error: payload must be a Set of strings with max size 100")
      }
    }
  } |

  for (@(payload, return) <= @(*entryCh, "PUBLIC_READ")) {
    for (current <<- mainCh) {
      @return!(*current)
    }
  } |

  /*
    (purse[]) => String | (true, id[])
    receives a list of purse, check that (they exist + no duplicate)
    and returns the corresponding list of ids
  */
  for (@(payload, return) <= @(*entryCh, "PUBLIC_CHECK_PURSES")) {
    new tmpCh, itCh in {
      for (@(tmpCh, keys) <= itCh) {
        for (tmp <- @tmpCh) {
          match keys {
            Nil => {
              @return!(*tmp)
            }
            [last] => {
              for (id <<- @(*vault, last)) {
                match *tmp.union(Set(*id)).size() == payload.length() {
                  true => {
                    @return!((true, *tmp.union(Set(*id))))

                  }
                  false => {
                    @return!("error: duplicates")
                  }
                }
              }
            }
            [first ... rest] => {
              for (id <<- @(*vault, first)) {
                @tmpCh!(*tmp.union(Set(*id))) |
                itCh!((tmpCh, rest))
              }
            }
          }
        }
      } |
      tmpCh!(Set()) |
      itCh!((*tmpCh, payload))
    }
  } |

  /*
    (payload) => String | (true, purse)
    purchase with REV from a purse that has .price
    property not Nil
    see payload below
  */
  // todo limitation total payload size ??
  for (@(payload, return) <= @(*entryCh, "PUBLIC_PURCHASE")) {
    match payload {
      { "quantity": Int, "purseId": String, "publicKey": String,
      "newId": Nil \\/ String, "data": _, "purseRevAddr": _, "purseAuthKey": _ } => {
        for (@properties <<- @(*purses, payload.get("purseId"))) {
          match (
            properties.get("price"),
            properties.get("quantity") > 0,
            payload.get("quantity") > 0,
            properties.get("quantity") >= payload.get("quantity")
          ) {
            (Int, true, true, true) => {
              new revVaultCh, ownerRevAddressCh, purseVaultCh in {

                registryLookup!(\`rho:rchain:revVault\`, *revVaultCh) |
                revAddress!("fromPublicKey", properties.get("publicKey").hexToBytes(), *ownerRevAddressCh) |

                for (@(_, RevVault) <- revVaultCh; @ownerRevAddress <- ownerRevAddressCh) {
                  match (
                    payload.get("purseRevAddr"),
                    ownerRevAddress,
                    payload.get("quantity") * properties.get("price")
                  ) {
                    (from, to, amount) => {
                      @RevVault!("findOrCreate", from, *purseVaultCh) |
                      for (@(true, purseVault) <- purseVaultCh) {
                        new makePurseReturnCh, transferReturnCh, performRefundCh in {                        
                          // refund
                          for (@message <- performRefundCh) {
                            new refundPurseBalanceCh, refundRevAddressCh, refundResultCh in {
                              @purseVault!("balance", *refundPurseBalanceCh) |
                              revAddress!("fromPublicKey", payload.get("publicKey").hexToBytes(), *refundRevAddressCh) |
                              for (@balance <- refundPurseBalanceCh; @revAddress <- refundRevAddressCh) {
                                @purseVault!("transfer", revAddress, balance, payload.get("purseAuthKey"), *refundResultCh) |
                                for (@refundResult <- refundResultCh) {
                                  match refundResult {
                                    (true, Nil) => {
                                      stdout!(message ++ ", issuer was refunded") |
                                      @return!(message ++ ", issuer was refunded")
                                    }
                                    _ => {
                                      stdout!(message ++ ", issuer was NOT refunded") |
                                      @return!(message ++ ", issuer was NOT refunded")
                                    }
                                  }
                                }
                              }
                            }
                          } |
                          @purseVault!("transfer", to, amount, payload.get("purseAuthKey"), *transferReturnCh) |
                          for (@result <- transferReturnCh) {
                            match result {
                              (true, Nil) => {
                                for (@properties2 <- @(*purses, payload.get("purseId"))) {
                                  /*
                                    Check if the purse must be removed because quantity 0
                                    if fungible: false, we always match 0
                                  */
                                  match properties2.get("quantity") - payload.get("quantity") {
                                    0 => {
                                      for (ids <- pursesIds) {
                                        pursesIds!(*ids.delete(properties2.get("id"))) |
                                        for (_ <- @(*pursesData, properties2.get("id"))) {
                                          makePurseCh!((
                                            properties2
                                              .set("price", Nil)
                                              .set("newId", payload.get("newId"))
                                              .set("quantity", payload.get("quantity"))
                                              .set("publicKey", payload.get("publicKey")),
                                            payload.get("data"),
                                            *makePurseReturnCh
                                          )) |
                                          for (newPurse <- makePurseReturnCh) {
                                            @return!((true, *newPurse))
                                          }
                                        }
                                      }
                                    }
                                    _ => {
                                      @(*purses, properties2.get("id"))!(
                                        properties2.set("quantity", properties2.get("quantity") - payload.get("quantity"))
                                      ) |
                                      makePurseCh!((
                                        properties2
                                          .set("price", Nil)
                                          .set("newId", payload.get("newId"))
                                          .set("quantity", payload.get("quantity"))
                                          .set("publicKey", payload.get("publicKey")),
                                        payload.get("data"),
                                        *makePurseReturnCh
                                      )) |
                                      for (newPurse <- makePurseReturnCh) {
                                        stdout!(*newPurse) |
                                        @return!((true, *newPurse))
                                      }
                                    }
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
            _=> {
              @return!("error: quantity not available or purse not for sale")
            }
          }
        }
      }
      _ => {
        @return!("error: invalid payloads")
      }
    }
  } |


  // ====================================
  // ===================== INITIALIZATION
  // save superKeyCh to a box
  // ====================================

  /*
    todo: secure with bundle- (*entryCh -> bundle-{*entryCh}) , but we must
    do it after all the listens are active
  */
  insertArbitrary!(*entryCh, *entryUriCh) |

  for (entryUri <- entryUriCh) {
    new boxDataCh, boxReturnCh in {
      @(*deployerId, "rho:id:${fromBoxRegistryUri}")!(({ "type": "READ" }, *boxDataCh)) |
      for (r <- boxDataCh) {
      stdout!(*r) |
        match (*r.get("version")) {
          "5.0.0" => {
            @(*deployerId, "rho:id:${fromBoxRegistryUri}")!((
              {
                "type": "SAVE_SUPER_KEY",
                "payload": { "superKey": *superKeyCh, "registryUri": *entryUri }
              },
              *boxReturnCh
            )) |
            for (resp <- boxReturnCh) {
              match *resp {
                String => {
                  mainCh!({ "status": "failed", "message": *resp }) |
                  stdout!(("failed", *resp))
                }
                _ => {
                  mainCh!({
                    "status": "completed",
                    "registryUri": *entryUri,
                    "locked": false,
                    "fungible": ${payload.fungible},
                    "version": "5.0.0"
                  }) |
                  stdout!({
                    "status": "completed",
                    "registryUri": *entryUri,
                    "locked": false,
                    "fungible": ${payload.fungible},
                    "version": "5.0.0"
                  }) |
                  stdout!("completed, contract deployed")
                }
              }
            }
          }
          _ => {
            mainCh!({
              "status": "failed",
              "message": "box has not the same version number 5.0.0",
            }) |
            stdout!({
              "status": "failed",
              "message": "box has not the same version number 5.0.0",
            })
          }
        }
      }
    }

    /*OUTPUT_CHANNEL*/
  }
}
`;
  };

  var mainTerm = {
  	mainTerm: mainTerm_1
  };

  var createPursesTerm_1 = (
    registryUri,
    payload
  ) => {
    return `new basket,
  returnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_SUPER_KEYS" }, *boxCh)) |

  for (superKeys <- boxCh) {
    match *superKeys.get(\`rho:id:${registryUri}\`) {
      ch => {
        @(ch, "CREATE_PURSES")!((
          {
            // example
            // "purses": { "0": { "publicKey": "abc", "type": "gold", "quantity": 3, "data": Nil }}
            "purses": ${JSON.stringify(payload.purses).replace(new RegExp(': null|:null', 'g'), ': Nil')},
            // example
            // "data": { "0": "this bag is mine" }
            "data": ${JSON.stringify(payload.data).replace(new RegExp(': null|:null', 'g'), ': Nil')},
          },
          *returnCh
        ))
      }
    }
  } |

  for (resp <- returnCh) {
    match *resp {
      String => {
        basket!({ "status": "failed", "message": *resp }) |
        stdout!(("failed", *resp))
      }
      (true, payload) => {
        new entryCh, return2Ch, itCh in {
          registryLookup!(\`rho:id:${payload.fromBoxRegistryUri}\`, *entryCh) |
          for (entry <- entryCh) {
            for (purses <= itCh) {
              match *purses {
                Nil => {
                  basket!({ "status": "failed", "message": "no purse" }) |
                  stdout!(("failed", "no purse"))
                }
                [last] => {
                  new readReturnCh, receivePurseReturnCh in {
                    @(last, "READ")!((Nil, *readReturnCh)) |
                    for (properties <- readReturnCh) {
                      @(*entry, "PUBLIC_RECEIVE_PURSE")!(({
                        "registryUri": \`rho:id:${registryUri}\`,
                        "purse": last
                      }, *receivePurseReturnCh))
                    } |
                    for (r <- receivePurseReturnCh) {
                      match *r {
                        String => {
                          basket!({ "status": "failed", "message": *r }) |
                          stdout!(("failed", *r))
                        }
                        _ => {
                          stdout!("completed, purses created and saved to box") |
                          basket!({ "status": "completed" })
                        }
                      }
                    }
                  }
                }
                [first ... rest] => {
                  new readReturnCh, receivePurseReturnCh in {
                    @(first, "READ")!((Nil, *readReturnCh)) |
                    for (properties <- readReturnCh) {
                      @(*entry, "PUBLIC_RECEIVE_PURSE")!(({
                        "registryUri": \`rho:id:${registryUri}\`,
                        "purse": first
                      }, *receivePurseReturnCh))
                    } |
                    for (r <- receivePurseReturnCh) {
                      match *r {
                        String => {
                          basket!({ "status": "failed", "message": *r }) |
                          stdout!(("failed", *r))
                        }
                        _ => { itCh!(rest) }
                      }
                    }
                  }
                }
              }
            } |
            itCh!(payload.get("purses"))
          }
        }
      }
    }
  }
}
`;
  };

  var createPursesTerm = {
  	createPursesTerm: createPursesTerm_1
  };

  var sendPurseTerm_1 = (
      registryUri,
    payload
  ) => {
    return `new basket,
  sendReturnCh,
  deletePurseReturnCh,
  boxCh,
  boxEntryCh,
  boxEntry2Ch,
  receivePursesReturnCh,
  receivePursesReturn2Ch,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_PURSES" }, *boxCh)) |

  for (purses <- boxCh) {
    match *purses.get(\`rho:id:${registryUri}\`).get("${payload.purseId}") {
      Nil => {
        basket!({ "status": "failed", "message": "purse not found" }) |
        stdout!(("failed", "purse not found"))
      }
      purse => {
        registryLookup!(\`rho:id:${payload.toBoxRegistryUri}\`, *boxEntryCh) |
        for (boxEntry <- boxEntryCh) {
          @(*boxEntry, "PUBLIC_RECEIVE_PURSE")!((
            {
              "registryUri": \`rho:id:${registryUri}\`,
              "purse": purse,
            },
            *receivePursesReturnCh
          )) |
          for (r <- receivePursesReturnCh) {
            match *r {
              (true, Nil) => {
                match "rho:id:${payload.toBoxRegistryUri}" == "rho:id:${payload.fromBoxRegistryUri}" {
                  true => {
                    stdout!("completed, purse sent") |
                    basket!({ "status": "completed" })
                  }
                  false => {
                    /*
                      Remove the purse from emitter's box now that it is worthless
                    */
                    @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!((
                      { "type": "DELETE_PURSE", "payload": { "registryUri": \`rho:id:${registryUri}\`, "id": "${payload.purseId}" } },
                      *deletePurseReturnCh
                    )) |
                    for (r2 <- deletePurseReturnCh) {
                      match *r2 {
                        String => {
                          stdout!("WARNING completed, purse sent but could not remove from box") |
                          basket!({ "status": "completed" })
                        }
                        _ => {
                          stdout!("completed, purse sent and removed from box") |
                          basket!({ "status": "completed" })
                        }
                      }
                    }

                  }
                }
              }
              _ => {
                registryLookup!(\`rho:id:${payload.fromBoxRegistryUri}\`, *boxEntry2Ch) |
                for (boxEntry2 <- boxEntry2Ch) {
                  @(*boxEntry, "PUBLIC_RECEIVE_PURSE")!((
                    {
                      "registryUri": \`rho:id:${registryUri}\`,
                      "purse": purse,
                    },
                    *receivePursesReturn2Ch
                  ))
                } |
                for (r2 <- receivePursesReturn2Ch) {
                  match *r2 {
                    String => {
                      stdout!("Failed to send, could not send back to emitter box, purse may be lost " ++ *r2 ++ *r) |
                      basket!({ "status": "failed", "message": "Failed to send, could not send back to emitter box, purse may be lost " ++ *r2 ++ *r})
                    }
                    _ => {
                      stdout!("Failed to send, could send back to emitter box" ++ *r2) |
                      basket!({ "status": "failed", "message": "Failed to send, could send back to emitter box" ++ *r2 })
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

  var sendPurseTerm = {
  	sendPurseTerm: sendPurseTerm_1
  };

  var readPursesTerm_1 = (
    registryUri,
    payload
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${registryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      @(*entry, "PUBLIC_READ_PURSES")!((Set(${payload.pursesIds
  .map((id) => '"' + id + '"')
  .join(',')}), *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
      };

  var readPursesTerm = {
  	readPursesTerm: readPursesTerm_1
  };

  var readPursesIdsTerm_1 = (
    registryUri
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${registryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      @(*entry, "PUBLIC_READ_PURSES_IDS")!((Nil, *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
  };

  var readPursesIdsTerm = {
  	readPursesIdsTerm: readPursesIdsTerm_1
  };

  var readBoxTerm_1 = (
    boxRegistryUri
  ) => {
    return `new return, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
  lookup!(\`rho:id:${boxRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    stdout!(*entry) |
    new a in {
      @(*entry, "PUBLIC_READ")!((Nil, *a)) |
      for (current <- a) {
        new b in {
          @(*entry, "PUBLIC_READ_SUPER_KEYS")!((Nil, *b)) |
          for (superKeys <- b) {
            new c in {
              @(*entry, "PUBLIC_READ_PURSES")!((Nil, *c)) |
              for (purses <- c) {
                return!(
                  *current
                    .set("superKeys", *superKeys)
                    .set("purses", *purses)
                )
              }
            }
          }
        }
      }
    }
  }
}`;
  };

  var readBoxTerm = {
  	readBoxTerm: readBoxTerm_1
  };

  var readTerm_1 = (
    registryUri
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${registryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      @(*entry, "PUBLIC_READ")!((Nil, *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
  };

  var readTerm = {
  	readTerm: readTerm_1
  };

  var updatePurseDataTerm_1 = (
      registryUri,
    payload
  ) => {
    return `new basket,
  returnCh,
  deletePurseReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_PURSES" }, *boxCh)) |

  for (purses <- boxCh) {
    match *purses.get(\`rho:id:${registryUri}\`).get("${payload.purseId}") {
      Nil => {
        basket!({ "status": "failed", "message": "purse not found" }) |
        stdout!(("failed", "purse not found"))
      }
      purse => {
        @(purse, "UPDATE_DATA")!(("${payload.data}", *returnCh)) |
        for (r <- returnCh) {
          match *r {
            String => {
              basket!({ "status": "failed", "message": *r }) |
              stdout!(("failed", *r))
            }
            _ => {
              stdout!("completed, purse data updated") |
              basket!({ "status": "completed" })
            }
          }
        }
      }
    }
  }
}
`;
  };

  var updatePurseDataTerm = {
  	updatePurseDataTerm: updatePurseDataTerm_1
  };

  var readPursesDataTerm_1 = (
    registryUri,
    payload
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${registryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      @(*entry, "PUBLIC_READ_PURSES_DATA")!((Set(${payload.pursesIds
  .map((id) => '"' + id + '"')
  .join(',')}), *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
      };

  var readPursesDataTerm = {
  	readPursesDataTerm: readPursesDataTerm_1
  };

  var splitPurseTerm_1 = (
      registryUri,
    payload
  ) => {
    return `new basket,
  withdrawReturnCh,
  savePurseReturnCh,
  boxCh,
  readReturnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_PURSES" }, *boxCh)) |

  for (purses <- boxCh) {
    match *purses.get(\`rho:id:${registryUri}\`).get("${payload.purseId}") {
      Nil => {
        basket!({ "status": "failed", "message": "purse not found" }) |
        stdout!(("failed", "purse not found"))
      }
      purse => {
        @(purse, "WITHDRAW")!((${payload.quantityInNewPurse}, *withdrawReturnCh)) |
        for (r <- withdrawReturnCh) {
          match *r {
            String => {
              basket!({ "status": "failed", "message": *r }) |
              stdout!(("failed", *r))
            }
            (true, newPurse) => {
              @(newPurse, "READ")!((Nil, *readReturnCh)) |
              for (@properties <- readReturnCh) {
                /*
                  Save new purse without joining it (DEPOSIT) to a purse with same type
                */
                @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!((
                  { "type": "SAVE_PURSE_SEPARATELY", "payload": { "registryUri": \`rho:id:${registryUri}\`, "purse": newPurse } },
                  *savePurseReturnCh
                )) |
                for (r2 <- savePurseReturnCh) {
                  match *r2 {
                    String => {
                      stdout!("DANGER completed, purse split but could not save to box") |
                      basket!({ "status": "failed", "message": "DANGER completed, purse split but could not save to box" })
                    }
                    _ => {
                      stdout!("completed, purse split and saved in box") |
                      basket!({ "status": "completed" })
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

  var splitPurseTerm = {
  	splitPurseTerm: splitPurseTerm_1
  };

  var setPriceTerm_1 = (
    registryUri,
    payload
  ) => {
    return `new basket,
  sendReturnCh,
  deletePurseReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_PURSES" }, *boxCh)) |

  for (purses <- boxCh) {
    match *purses.get(\`rho:id:${registryUri}\`).get("${payload.purseId}") {
      Nil => {
        basket!({ "status": "failed", "message": "purse not found" }) |
        stdout!(("failed", "purse not found"))
      }
      purse => {
        @(purse, "SET_PRICE")!((${payload.price || "Nil"}, *sendReturnCh)) |
        for (r <- sendReturnCh) {
          match *r {
            String => {
              basket!({ "status": "failed", "message": *r }) |
              stdout!(("failed", *r))
            }
            _ => {
              stdout!("completed, price set") |
              basket!({ "status": "completed" })
            }
          }
        }
      }
    }
  }
}
`;
  };

  var setPriceTerm = {
  	setPriceTerm: setPriceTerm_1
  };

  var purchaseTerm_1 = (
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
  newIdCh,
  dataCh,
  returnCh,
  purseIdCh,
  registryUriCh,
  revAddressCh,
  registryLookup(\`rho:registry:lookup\`),
  deployerId(\`rho:rchain:deployerId\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`)
in {

  /*
    The 5 following values must be filled with proper values
  */
  // Registry URI of the contract
  registryUriCh!!(\`rho:id:${registryUri}\`) |
  // Unique ID of the token you want to purchase
  purseIdCh!!("${payload.purseId}") |
  // New ID only used if fungible = false
  newIdCh!!("${payload.newId ? payload.newId : "Nil"}") |
  // Per token price, make sure it is accurate
  priceCh!!(${payload.price || "Nil"}) |
  // Quantity you want to purchase, make sure enough are available
  quantityCh!!(${payload.quantity}) |
  // Your public key
  // If the transfer fails, refund will go to the corresponding REV address
  publicKeyCh!!("${payload.publicKey}") |
  // data
  dataCh!("${payload.data}") |

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
          @purseId <- purseIdCh;
          @registryUri <- registryUriCh;
          @price <- priceCh;
          @quantity <- quantityCh;
          @newId <- newIdCh;
          @data <- dataCh
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

                  new vaultCh, revVaultkeyCh in {
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
                              registryLookup!(registryUri, *entryCh) |
                              for(entry <- entryCh) {
                                stdout!("PUBLIC_PURCHASE") |
                                stdout!(*entry) |
                                @(*entry, "PUBLIC_PURCHASE")!((
                                  {
                                    "quantity": quantity,
                                    "purseId": purseId,
                                    "newId": newId,
                                    "data": data,
                                    "publicKey": publicKey,
                                    "purseRevAddr": purseRevAddr,
                                    "purseAuthKey": purseAuthKey
                                  },
                                  *returnCh
                                )) |
                                for (resp <- returnCh) {
                                  match *resp {
                                    (true, purse) => {
                                      new readReturnCh, boxEntryCh, receivePursesReturnCh in {
                                        @(*entry, "PUBLIC_READ")!((Nil, *readReturnCh)) |
                                        for (@current <- readReturnCh) {
                                          match "${payload.actionAfterPurchase || "PUBLIC_RECEIVE_PURSE"}" {
                                            "PUBLIC_RECEIVE_PURSE" => {
                                              registryLookup!(\`rho:id:${payload.toBoxRegistryUri}\`, *boxEntryCh) |
                                              for (boxEntry <- boxEntryCh) {
                                                @(*boxEntry, "PUBLIC_RECEIVE_PURSE")!((
                                                  {
                                                    "registryUri": current.get("registryUri"),
                                                    "purse": purse,
                                                  },
                                                  *receivePursesReturnCh
                                                ))
                                              }
                                            }
                                            "SAVE_PURSE_SEPARATELY" => {
                                              @(*deployerId, "rho:id:${payload.toBoxRegistryUri}")!((
                                                {
                                                  "type": "SAVE_PURSE_SEPARATELY",
                                                  "payload": {
                                                    "registryUri": current.get("registryUri"),
                                                    "purse": purse,
                                                  } 
                                                },
                                                *receivePursesReturnCh
                                              ))
                                            }
                                          } |
                                          for (r <- receivePursesReturnCh) {
                                            match *r {
                                              String => {
                                                basket!({ "status": "failed", "message": *resp }) |
                                                stdout!(("failed", *resp))
                                              }
                                              _ => {
                                                basket!({ "status": "completed" }) |
                                                stdout!("purchase went well")
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                    _ => {
                                      stdout!(*resp) |
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
}`;
  };

  var purchaseTerm = {
  	purchaseTerm: purchaseTerm_1
  };

  var withdrawTerm_1 = (
      registryUri,
    payload
  ) => {
    return `new basket,
  withdrawReturnCh,
  savePurseReturnCh,
  boxCh,
  readReturnCh,
  receivePursesReturnCh,
  receivePursesReturn2Ch,
  boxEntryCh,
  boxEntry2Ch,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_PURSES" }, *boxCh)) |

  for (purses <- boxCh) {
    match *purses.get(\`rho:id:${registryUri}\`).get("${payload.purseId}") {
      Nil => {
        basket!({ "status": "failed", "message": "purse not found" }) |
        stdout!(("failed", "purse not found"))
      }
      purse => {
        @(purse, "WITHDRAW")!((${payload.quantityToWithdraw}, *withdrawReturnCh)) |
        for (r <- withdrawReturnCh) {
          match *r {
            String => {
              basket!({ "status": "failed", "message": *r }) |
              stdout!(("failed", *r))
            }
            (true, newPurse) => {
              registryLookup!(\`rho:id:${payload.toBoxRegistryUri}\`, *boxEntryCh) |
              for (boxEntry <- boxEntryCh) {
                @(*boxEntry, "PUBLIC_RECEIVE_PURSE")!((
                  {
                    "registryUri": \`rho:id:${registryUri}\`,
                    "purse": newPurse,
                  },
                  *receivePursesReturnCh
                ))
              } |
              for (r <- receivePursesReturnCh) {
                match *r {
                  (true, Nil) => {
                    stdout!("Purse withdrawn") |
                    basket!({ "status": "completed", "message": "Purse withdrawn" })
                  }
                  _ => {
                    registryLookup!(\`rho:id:${payload.fromBoxRegistryUri}\`, *boxEntry2Ch) |
                    for (boxEntry2 <- boxEntry2Ch) {
                      @(*boxEntry2, "PUBLIC_RECEIVE_PURSE")!((
                        {
                          "registryUri": \`rho:id:${registryUri}\`,
                          "purse": newPurse,
                        },
                        *receivePursesReturnCh
                      ))
                    } |
                    for (r2 <- receivePursesReturn2Ch) {
                      match *r2 {
                        String => {
                          stdout!("Failed to withdraw to recipient box, could not withdrawn back to box " ++ *r2) |
                          basket!({ "status": "failed", "message": "Failed to withdraw to recipient box, could not withdrawn back to box " ++ *r2 })
                        }
                        _ => {
                          stdout!("Failed to withdraw to recipient box, withdrawn back to box") |
                          basket!({ "status": "failed", "message": "Failed to withdraw to recipient box, withdrawn back to box"})
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

  var withdrawTerm = {
  	withdrawTerm: withdrawTerm_1
  };

  const { boxTerm: boxTerm$1 } = boxTerm;
  const { mainTerm: mainTerm$1 } = mainTerm;
  const { createPursesTerm: createPursesTerm$1 } = createPursesTerm;
  const { sendPurseTerm: sendPurseTerm$1 } = sendPurseTerm;
  const { readPursesTerm: readPursesTerm$1 } = readPursesTerm;
  const { readPursesIdsTerm: readPursesIdsTerm$1 } = readPursesIdsTerm;
  const { readBoxTerm: readBoxTerm$1 } = readBoxTerm;
  const { readTerm: readTerm$1 } = readTerm;
  const { updatePurseDataTerm: updatePurseDataTerm$1 } = updatePurseDataTerm;
  const { readPursesDataTerm: readPursesDataTerm$1 } = readPursesDataTerm;
  const { splitPurseTerm: splitPurseTerm$1 } = splitPurseTerm;
  const { setPriceTerm: setPriceTerm$1 } = setPriceTerm;
  const { purchaseTerm: purchaseTerm$1 } = purchaseTerm;
  const { withdrawTerm: withdrawTerm$1 } = withdrawTerm;

  var src = {
    version: '5.0.0',
    boxTerm: boxTerm$1,
    mainTerm: mainTerm$1,
    createPursesTerm: createPursesTerm$1,
    sendPurseTerm: sendPurseTerm$1,
    readPursesTerm: readPursesTerm$1,
    readPursesIdsTerm: readPursesIdsTerm$1,
    readBoxTerm: readBoxTerm$1,
    readTerm: readTerm$1,
    updatePurseDataTerm: updatePurseDataTerm$1,
    readPursesDataTerm: readPursesDataTerm$1,
    splitPurseTerm: splitPurseTerm$1,
    setPriceTerm: setPriceTerm$1,
    purchaseTerm: purchaseTerm$1,
    withdrawTerm: withdrawTerm$1,
  };
  var src_1 = src.version;
  var src_2 = src.boxTerm;
  var src_3 = src.mainTerm;
  var src_4 = src.createPursesTerm;
  var src_5 = src.sendPurseTerm;
  var src_6 = src.readPursesTerm;
  var src_7 = src.readPursesIdsTerm;
  var src_8 = src.readBoxTerm;
  var src_9 = src.readTerm;
  var src_10 = src.updatePurseDataTerm;
  var src_11 = src.readPursesDataTerm;
  var src_12 = src.splitPurseTerm;
  var src_13 = src.setPriceTerm;
  var src_14 = src.purchaseTerm;
  var src_15 = src.withdrawTerm;

  exports.boxTerm = src_2;
  exports.createPursesTerm = src_4;
  exports.default = src;
  exports.mainTerm = src_3;
  exports.purchaseTerm = src_14;
  exports.readBoxTerm = src_8;
  exports.readPursesDataTerm = src_11;
  exports.readPursesIdsTerm = src_7;
  exports.readPursesTerm = src_6;
  exports.readTerm = src_9;
  exports.sendPurseTerm = src_5;
  exports.setPriceTerm = src_13;
  exports.splitPurseTerm = src_12;
  exports.updatePurseDataTerm = src_10;
  exports.version = src_1;
  exports.withdrawTerm = src_15;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
