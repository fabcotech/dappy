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

  // purses
  // { [URI]: { [purseId: string]: purse } }
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
  for (@("PUBLIC_RECEIVE_PURSE", payload, return) <= entryCh) {
    new lookupReturnCh, checkReturnCh, readReturnCh, readPropertiesReturnCh, return1Ch,
    itCh, doDepositOrSwapCh, decideToDepositOrSwpaCh in {

      /*
        1: check the purses received by asking
        the contract at payload.get("registryUri")
      */
      lookup!(payload.get("registryUri"), *lookupReturnCh) |
      for (contractEntry <- lookupReturnCh) {
        contractEntry!(("PUBLIC_CHECK_PURSES", [payload.get("purse")], *checkReturnCh)) |
        contractEntry!(("PUBLIC_READ", Nil, *readReturnCh)) |
        match payload.get("purse") {
          purse => {
            @purse!(("READ", Nil, *readPropertiesReturnCh))
          }
        } |
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
                                  match purses.get(last) {
                                    purse => {
                                      @purse!(("READ", Nil, *readReturnCh))
                                    }
                                  } |
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
                                  match purses.get(first) {
                                    purse => {
                                      @purse!(("READ", Nil, *readReturnCh))
                                    }
                                  } |
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
                @purse!(("SWAP", { "box": *main.get("registryUri"), "publicKey": *main.get("publicKey") }, *returnSwapCh)) |
                for (returnSwap <- returnSwapCh) {
                  match *returnSwap {
                    String => {
                      @return!("error: CRITICAL check was successful but failed to swap")
                    }
                    (true, swappedPurse) => {
                      @swappedPurse!(("READ", Nil, *returnPropertiesCh)) |
                      for (properties <- returnPropertiesCh) {
                        for (boxPurses <- boxPursesCh) {
                          boxPursesCh!(
                            *boxPurses.set(
                              registryUri,
                              *boxPurses.get(registryUri).set(
                                *properties.get("id"),
                                swappedPurse
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
          }
          "deposit" => {
            new returnDepositCh, returnPropertiesCh in {
              @purseToDepositTo!(("DEPOSIT", purse, *returnDepositCh)) |
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

  for (@("PUBLIC_READ", Nil, return) <= entryCh) {
    for (main <<- mainCh) {
      @return!(*main)
    }
  } |

  for (@("PUBLIC_READ_SUPER_KEYS", payload, return) <= entryCh) {
    for (superKeys <<- superKeysCh) {
      @return!(*superKeys.keys())
    }
  } |

  for (@("PUBLIC_READ_PURSES", payload, return) <= entryCh) {
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

  insertArbitrary!(bundle+{*entryCh}, *entryUriCh) |

  for (entryUri <- entryUriCh) {

    // OWNER / PRIVATE capabilities
    for (@(action, return) <= @(*deployerId, "\${n}" %% { "n": *entryUri })) {
      match action.get("type") {
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
              new createKeyReturnCh, lookupReturnCh, readReturnCh, checkReturnCh,
              returnSwapCh, returnReadMainCh, returnPropertiesCh in {
                lookup!(action.get("payload").get("registryUri"), *lookupReturnCh) |
                for (contractEntry <- lookupReturnCh) {
                  contractEntry!(("PUBLIC_CHECK_PURSES", [action.get("payload").get("purse")], *checkReturnCh))
                } |
                for (checkReturn <- checkReturnCh) {
                  match *checkReturn {
                    (true, _) => {
                      for (main <<- mainCh) {
                        match action.get("payload").get("purse") {
                          purse => {
                            @purse!(("SWAP", { "box": *main.get("registryUri"), "publicKey": *main.get("publicKey") }, *returnSwapCh))
                          }
                        } |
                        for (returnSwap <- returnSwapCh) {
                          match *returnSwap {
                            String => {
                              @return!("error: CRITICAL check was successful but failed to swap")
                            }
                            (true, swappedPurse) => {
                              createKeyInBoxPurseIfNotExistCh!((action.get("payload").get("registryUri"), *createKeyReturnCh)) |
                              for (purses <- createKeyReturnCh) {
                                match *purses {
                                  String => {
                                    @return!("error: invalid payload")
                                  }
                                  _ => {
                                    @swappedPurse!(("READ", Nil, *readReturnCh)) |
                                    for (@properties <- readReturnCh) {
                                      for (boxPurses <- boxPursesCh) {
                                        boxPursesCh!(
                                          *boxPurses.set(
                                            action.get("payload").get("registryUri"),
                                            *purses.set(
                                              properties.get("id"),
                                              swappedPurse
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
                        }
                      }
                    }
                    String => {
                      @return!("error: invalid purse, check failed")
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
          stdout!(action.get("type")) |
          @return!("error: unknown action")
        }
      }
    } |

    stdout!("box deployed, private channel is @(*deployerId, '\${n}')" %% { "n": *entryUri }  ) |
    mainCh!({
      "registryUri": *entryUri,
      "publicKey": "${payload.publicKey}",
      "version": "5.0.3",
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
  iterateDataCh,
  byteArraySafeToStoreCh,
  iteratePropertiesCh,
  makePurseCh,
  superKeyCh,
  calculateFeeCh,
  pursesTreeHashMapCh,
  pursesForSaleTreeHashMapCh,

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
        // { "quantity": 100, "type": "GOLD", "box": \`rho:id:aaa\`, "publicKey": "aaa", }
      }
    }
  */
  vault,

  /*
    purses / thm
    A purse's properties is a Map {"quantity", "type", "price", "box", "publicKey"}
    stored in the tree hash map *purses. Anyone can read it through
    "READ_PURSES" public channel.

    // create purse "12" (it must not exist)
    purses!("set", thm, "12", { "publicKey": "aaa", "box": \`rho:id:aaa\`, etc... }, *setReturnCh) |

    // get properties of purse "12"
    purses!("get", thm, "12", *getReturnCh) |
    for (properties <- getReturnCh) {
      out!(*properties)
    }

  */
  pursesReadyCh,

  /*
    pursesForSale / thm2
    TreeHashMap of purses currently for sale
    TreeHashMap!("set", thm2, "12", purse, *setReturnCh) |
  */
  pursesForSaleReadyCh,


  /*
    pursesData contains the data associated to purses
    for (data <- @(*pursesData, "12")) { ... }
  */
  pursesData,

  counterCh,
  TreeHashMap,

  insertArbitrary(\`rho:registry:insertArbitrary\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`),
  deployerId(\`rho:rchain:deployerId\`)
in {

  counterCh!(0) |

  // reimplementation of TreeHashMap

/*
  Communications between channels have generally been reduced to reduce amount of
  serialization / deserialization

  when you "init" you can choose that the processes are also stored as bytes, instead of storing a map for each node, it stores a map at channel @map, and bytes at channel @(map, "bytes), this will make the "getAllValues" 10x, 20x, 30x faster depending on the process you are storing

  !!! make sure your processes do not contain the string "£$£$", or the bytes c2a324c2a324, those are used as delimiters
*/

new MakeNode, ByteArrayToNybbleList,
    TreeHashMapSetter, TreeHashMapSetterBytes, TreeHashMapGetter, TreeHashMapContains, TreeHashMapUpdater, HowManyPrefixes, NybbleListForI, RemoveBytesSectionIfExistsCh, keccak256Hash(\`rho:crypto:keccak256Hash\`),
    powersCh, storeToken, nodeGet in {
  match ([1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,655256], ["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"], 12, "£$£$£$£$".toByteArray().slice(4, 16), "£$£$£$£$".toByteArray().slice(4, 10)) {
    (powers, hexas, base, delimiter, insideDelimiter) => {
      contract MakeNode(@initVal, @node) = {
        @[node, *storeToken]!(initVal)
      } |


      /*
        delimiter between sections is £$£$£$£$ , length of delimiter is 12
        the hex representation of delimiter is c2a324c2a324c2a324c2a324
        "£$£$£$£$".toByteArray().slice(4, 16) == c2a324c2a324c2a324c2a324
        
        inside delimiter is £$£$ = c2a324c2a324

        The byte array has the following format (without bracket):
        c2a324c2a324c2a324c2a324[suffix]c2a324c2a324[value as byte array]c2a324c2a324c2a324c2a324[suffix2]c2a324c2a324[value 2 as byte array] etc.
      */
      contract RemoveBytesSectionIfExistsCh(@suffix, @ba, @ret) = {
        new itCh1, itCh2, removeSectionCh, indexesCh in {
          if (ba == Nil) {
            @ret!(Nil)
          } else {
            itCh1!(0) |
            indexesCh!([])
          } |
          for (@i <= itCh1) {
            if (ba.slice(i, i + 12) == delimiter) {
              if (i == ba.length() - 12) {
                for (@indexes <- indexesCh) {
                  removeSectionCh!(indexes ++ [i])
                }
              } else {
                for (@indexes <- indexesCh) {
                  indexesCh!(indexes ++ [i]) |
                  itCh1!(i + 1)
                }
              }
            } else {
              if (i == ba.length() - 12) {
                for (@indexes <- indexesCh) {
                  removeSectionCh!(indexes)
                }
              } else {
                itCh1!(i + 1)
              }
            }
          } |
          for (@indexes <- removeSectionCh) {
            for (@i <= itCh2) {
              // check if there is an index for i
              if (indexes.length() == i) {
                @ret!(ba)
              } else {
                if (ba.length() > indexes.nth(i) + suffix.length() + 12) {
                  if (ba.slice(indexes.nth(i) + 12, indexes.nth(i) + 12 + suffix.length()) == suffix) {
                    if (indexes.length() - 1 == i) {
                      // only one entry in ba, cannot slice(0,0), send Nil
                      if (indexes.length() > 1) {
                        @ret!(ba.slice(0, indexes.nth(i)))
                      } else {
                        @ret!(Nil)
                      }
                    } else {
                      @ret!(ba.slice(0, indexes.nth(i)) ++ ba.slice(indexes.nth(i + 1), ba.length()))
                    }
                  } else {
                    itCh2!(i + 1)
                  }
                } else {
                  @ret!(ba)
                }
              }
            } |
            itCh2!(0)
          }
        }
      } |

      contract nodeGet(@node, ret) = {
        for (@val <<- @[node, *storeToken]) {
          ret!(val)
        }
      } |

      contract HowManyPrefixes(@map, ret) = {
        for (@depth <<- @(map, "depth")) {
          match depth {
            1 => ret!(base)
            2 => ret!(base * base)
            3 => ret!(base * base * base)
            4 => ret!(base * base * base * base)
          }
        }
      } |

      contract NybbleListForI(@map, @i, @depth, ret) = {
        match depth {
          1 => {
            match hexas.nth(i % base) {
              str => {
                ByteArrayToNybbleList!(str.hexToBytes(), 0, depth, [], *ret)
              }
            }
          }
          2 => {
            match hexas.nth(i / base) ++ hexas.nth(i % base) {
              str => {
                ByteArrayToNybbleList!(str.hexToBytes(), 0, depth, [], *ret)
              }
            }
          }
          3 => {
            match hexas.nth(i / base / base) ++ hexas.nth(i / base) ++ hexas.nth(i % base) {
              str => {
                ByteArrayToNybbleList!(str.hexToBytes(), 0, depth, [], *ret)
              }
            }
          }
          4 => {
            match hexas.nth(i / base / base / base) ++ hexas.nth(i / base / base) ++ hexas.nth(i / base) ++ hexas.nth(i % base) {
              str => {
                ByteArrayToNybbleList!(str.hexToBytes(), 0, depth, [], *ret)
              }
            }
          }
        }
      } |

      contract ByteArrayToNybbleList(@ba, @n, @len, @acc, ret) = {
        if (n == len) {
          ret!(acc)
        } else {
          ByteArrayToNybbleList!(ba, n+1, len, acc ++ [ ba.nth(n) % base ], *ret)
        }
      } |

      contract TreeHashMap(@"init", @depth, @alsoStoreAsBytes, ret) = {
        new map in {
          MakeNode!(0, (*map, [])) |
          if (alsoStoreAsBytes == true) {
            MakeNode!(0, ((*map, "bytes"), []))
          } |
          @(*map, "depth")!!(depth) |
          @(*map, "alsoStoreAsBytes")!!(alsoStoreAsBytes) |
          ret!(*map)
        }
      } |

      contract TreeHashMapGetter(@map, @nybList, @n, @len, @suffix, ret) = {
        // Look up the value of the node at (map, nybList.slice(0, n + 1))
        for (@val <<- @[(map, nybList.slice(0, n)), *storeToken]) {
          if (n == len) {
            ret!(val.get(suffix))
          } else {
            // Otherwise check if the rest of the path exists.
            // Bit k set means node k exists.
            // nybList.nth(n) is the node number
            // val & powers.nth(nybList.nth(n)) is nonzero if the node exists
            // (val / powers.nth(nybList.nth(n))) % 2 is 1 if the node exists
            if ((val / powers.nth(nybList.nth(n))) % 2 == 0) {
              ret!(Nil)
            } else {
              TreeHashMapGetter!(map, nybList, n + 1, len, suffix, *ret)
            }
          }
        }
      } |

      contract TreeHashMap(@"get", @map, @key, ret) = {
        new hashCh, nybListCh in {
          // Hash the key to get a 256-bit array
          keccak256Hash!(key.toByteArray(), *hashCh) |
          for (@hash <- hashCh) {
            for (@depth <<- @(map, "depth")) {
              // Get the bit list
              ByteArrayToNybbleList!(hash, 0, depth, [], *nybListCh) |
              for (@nybList <- nybListCh) {
                TreeHashMapGetter!(map, nybList, 0,  depth, hash.slice(depth, 32), *ret)
              }
            }
          }
        }
      } |
  
      contract TreeHashMap(@"remove", @map, @key, ret) = {
        new hashCh, nybListCh in {
          // Hash the key to get a 256-bit array
          keccak256Hash!(key.toByteArray(), *hashCh) |
          for (@hash <- hashCh) {
            for (@depth <<- @(map, "depth")) {
              // Get the bit list
              ByteArrayToNybbleList!(hash, 0, depth, [], *nybListCh) |
              for (@nybList <- nybListCh) {
                TreeHashMapGetter!(map, nybList, 0,  depth, hash.slice(depth, 32), *ret)
              }
            }
          }
        }
      } |

      contract TreeHashMap(@"getAllValues", @map, ret) = {
        new hashCh, resultCh, howManyPrefixesCh, iterateOnPrefixesCh, nybListCh in {
          HowManyPrefixes!(map, *howManyPrefixesCh) |
          for (@depth <<- @(map, "depth")) {
            for (@alsoStoreAsBytes <<- @(map, "alsoStoreAsBytes")) {
              for (@howManyPrefixes <- howManyPrefixesCh ) {
                contract iterateOnPrefixesCh() = {
                  new itCh, bytesOrMapCh, TreeHashMapGetterValues in {
                    // do not move it up, the goal is reduce the number of serializatin / dezerialization
                    contract TreeHashMapGetterValues(@channel, @nybList, @n, @len, @i) = {
                      // channel is either map or (map, "bytes")
                      // Look up the value of the node at (channel, nybList.slice(0, n + 1))
                      for (@val <<- @[(channel, nybList.slice(0, n)), *storeToken]) {
                        if (n == len) {
                          if (val == Nil) {
                            itCh!(i + 1)
                          } else {
                            if (alsoStoreAsBytes == true) {
                              for (@bytes <- bytesOrMapCh) {
                                itCh!(i + 1) |
                                // store-as-bytes-map
                                bytesOrMapCh!(bytes.union(val))
                                // store-as-bytes-array
                                /* if (bytes == Nil) {
                                  bytesOrMapCh!(bytes)
                                } else {
                                  bytesOrMapCh!(bytes ++ val)
                                } */
                              }
                            } else {
                              for (@map <- bytesOrMapCh) {
                                bytesOrMapCh!(map.union(val)) |
                                itCh!(i + 1)
                              }
                            }
                          }
                        } else {
                          // Otherwise check if the rest of the path exists.
                          // Bit k set means node k exists.
                          // nybList.nth(n) is the node number
                          // val & powers.nth(nybList.nth(n)) is nonzero if the node exists
                          // (val / powers.nth(nybList.nth(n))) % 2 is 1 if the node exists
                          if ((val / powers.nth(nybList.nth(n))) % 2 == 0) {
                            itCh!(i + 1)
                          } else {
                            TreeHashMapGetterValues!(channel, nybList, n + 1, len, i)
                          }
                        }
                      }
                    } |

                    for (@i <= itCh) {
                      match i <= howManyPrefixes - 1 {
                        false => {
                          for (@a <- bytesOrMapCh) {
                            ret!(a)
                          }
                        }
                        true => {
                          NybbleListForI!(map, i, depth, *nybListCh) |
                          for (@nybList <- nybListCh) {
                            if (alsoStoreAsBytes == true) {
                              TreeHashMapGetterValues!((map, "bytes"), nybList, 0, depth, i)
                            } else {
                              TreeHashMapGetterValues!(map, nybList, 0, depth, i)
                            }
                          }
                        }
                      }
                    } |
                    if (alsoStoreAsBytes == true) {
                      // store-as-bytes-map
                       bytesOrMapCh!({})
                      // store-as-bytes-array
                      /* bytesOrMapCh!(Nil) */
                    } else {
                      bytesOrMapCh!({})
                    } |
                    itCh!(0)
                  }
                } |

                iterateOnPrefixesCh!()
              }
            }
          }
        }
      } |

      // Doesn't walk the path, just tries to fetch it directly.
      // Will hang if there's no key with that 64-bit prefix.
      // Returns Nil like "get" does if there is some other key with
      // the same prefix but no value there.
      contract TreeHashMap(@"fastUnsafeGet", @map, @key, ret) = {
        new hashCh, nybListCh in {
          // Hash the key to get a 256-bit array
          keccak256Hash!(key.toByteArray(), *hashCh) |
          for (@hash <- hashCh) {
            for(@depth <<- @(map, "depth")) {
              // Get the bit list
              ByteArrayToNybbleList!(hash, 0, depth, [], *nybListCh) |
              for (@nybList <- nybListCh) {
                new restCh, valCh in {
                  nodeGet!((map, nybList), *restCh) |
                  for (@rest <- restCh) {
                    ret!(rest.get(hash.slice(depth, 32)))
                  }
                }
              }
            }
          }
        }
      } |

      contract TreeHashMapSetterBytes(@channel, @nybList, @n, @len, @newVal, @suffix, ret) = {
        // channel is either map or (map, "bytes")
        // Look up the value of the node at (channel, nybList.slice(0, n + 1))
        new valCh, restCh, retRemoveCh in {
          match (channel, nybList.slice(0, n)) {
            node => {
              for (@val <<- @[node, *storeToken]) {
                if (n == len) {
                  // Acquire the lock on this node
                  for (@val <- @[node, *storeToken]) {
                    // If we're at the end of the path, set the node to newVal.
                    if (val == 0) {
                      // Release the lock
                      @[node, *storeToken]!(delimiter ++ suffix ++ insideDelimiter ++ newVal.toByteArray()) |
                      // Return
                      ret!(Nil)
                    }
                    else {
                      // Release the lock
                      if (newVal == Nil) {
                        RemoveBytesSectionIfExistsCh!(suffix, val, *retRemoveCh) |
                        for (@bytes <- retRemoveCh) {
                          @[node, *storeToken]!(bytes) |
                          ret!(Nil)
                        }
                        // Return
                      } else {
                        RemoveBytesSectionIfExistsCh!(suffix, val, *retRemoveCh) |
                        for (@bytes <- retRemoveCh) {
                          // check if empty
                          if (bytes == Nil) {
                            @[node, *storeToken]!(delimiter ++ suffix ++ insideDelimiter ++ newVal.toByteArray()) |
                            ret!(Nil)
                          } else {
                            @[node, *storeToken]!(bytes ++ delimiter ++ suffix ++ insideDelimiter ++ newVal.toByteArray()) |
                            ret!(Nil)
                          }
                        }
                      }
                    }
                  }
                } else {
                  // Otherwise make the rest of the path exist.
                  // Bit k set means child node k exists.
                  if ((val/powers.nth(nybList.nth(n))) % 2 == 0) {
                    // Child node missing
                    // Acquire the lock
                    for (@val <- @[node, *storeToken]) {
                      // Re-test value
                      if ((val/powers.nth(nybList.nth(n))) % 2 == 0) {
                        // Child node still missing
                        // Create node, set node to 0
                        MakeNode!(0, (channel, nybList.slice(0, n + 1))) |
                        // Update current node to val | (1 << nybList.nth(n))
                        match nybList.nth(n) {
                          bit => {
                            // val | (1 << bit)
                            // Bitwise operators would be really nice to have!
                            // Release the lock
                            @[node, *storeToken]!((val % powers.nth(bit)) +
                              (val / powers.nth(bit + 1)) * powers.nth(bit + 1) +
                              powers.nth(bit))
                          }
                        } |
                        // Child node now exists, loop
                        TreeHashMapSetterBytes!(channel, nybList, n + 1, len, newVal, suffix, *ret)
                      } else {
                        // Child node created between reads
                        // Release lock
                        @[node, *storeToken]!(val) |
                        // Loop
                        TreeHashMapSetterBytes!(channel, nybList, n + 1, len, newVal, suffix, *ret)
                      }
                    }
                  } else {
                    // Child node exists, loop
                    TreeHashMapSetterBytes!(channel, nybList, n + 1, len, newVal, suffix, *ret)
                  }
                }
              }
            }
          }
        }
      } |

      contract TreeHashMapSetter(@channel, @nybList, @n, @len, @newVal, @suffix, ret) = {
        // channel is either map or (map, "bytes")
        // Look up the value of the node at (channel, nybList.slice(0, n + 1))
        new valCh, restCh in {
          match (channel, nybList.slice(0, n)) {
            node => {
              for (@val <<- @[node, *storeToken]) {
                if (n == len) {
                  // Acquire the lock on this node
                  for (@val <- @[node, *storeToken]) {
                    // If we're at the end of the path, set the node to newVal.
                    if (val == 0) {
                      // Release the lock
                      @[node, *storeToken]!({suffix: newVal}) |
                      // Return
                      ret!(Nil)
                    }
                    else {
                      // Release the lock
                      if (newVal == Nil) {
                        @[node, *storeToken]!(val.delete(suffix)) |
                        // Return
                        ret!(Nil)
                      } else {
                        @[node, *storeToken]!(val.set(suffix, newVal)) |
                        // Return
                        ret!(Nil)
                      }
                    }
                  }
                } else {
                  // Otherwise make the rest of the path exist.
                  // Bit k set means child node k exists.
                  if ((val/powers.nth(nybList.nth(n))) % 2 == 0) {
                    // Child node missing
                    // Acquire the lock
                    for (@val <- @[node, *storeToken]) {
                      // Re-test value
                      if ((val/powers.nth(nybList.nth(n))) % 2 == 0) {
                        // Child node still missing
                        // Create node, set node to 0
                        MakeNode!(0, (channel, nybList.slice(0, n + 1))) |
                        // Update current node to val | (1 << nybList.nth(n))
                        match nybList.nth(n) {
                          bit => {
                            // val | (1 << bit)
                            // Bitwise operators would be really nice to have!
                            // Release the lock
                            @[node, *storeToken]!((val % powers.nth(bit)) +
                              (val / powers.nth(bit + 1)) * powers.nth(bit + 1) +
                              powers.nth(bit))
                          }
                        } |
                        // Child node now exists, loop
                        TreeHashMapSetter!(channel, nybList, n + 1, len, newVal, suffix, *ret)
                      } else {
                        // Child node created between reads
                        // Release lock
                        @[node, *storeToken]!(val) |
                        // Loop
                        TreeHashMapSetter!(channel, nybList, n + 1, len, newVal, suffix, *ret)
                      }
                    }
                  } else {
                    // Child node exists, loop
                    TreeHashMapSetter!(channel, nybList, n + 1, len, newVal, suffix, *ret)
                  }
                }
              }
            }
          }
        }
      } |

      contract TreeHashMap(@"set", @map, @key, @newVal, ret) = {
        new hashCh, nybListCh in {
          // Hash the key to get a 256-bit array
          keccak256Hash!(key.toByteArray(), *hashCh) |
          for (@hash <- hashCh) {
            for (@depth <<- @(map, "depth")) {
              for (@alsoStoreAsBytes <<- @(map, "alsoStoreAsBytes")) {
                ByteArrayToNybbleList!(hash, 0, depth, [], *nybListCh) |
                // Get the bit list
                for (@nybList <- nybListCh) {
                  if (alsoStoreAsBytes == true) {
                    new ret1, ret2 in {
                      if (newVal == Nil) {
                        // store-as-bytes-map
                        TreeHashMapSetter!((map, "bytes"), nybList, 0,  depth, Nil, hash.slice(depth, 32), *ret2)
                        // store-as-bytes-array
                        /* TreeHashMapSetterBytes!((map, "bytes"), nybList, 0,  depth, Nil, hash.slice(depth, 32), *ret2) */
                      } else {
                        // store-as-bytes-map
                        TreeHashMapSetter!((map, "bytes"), nybList, 0,  depth, newVal.toByteArray(), hash.slice(depth, 32), *ret2)
                        // store-as-bytes-array
                        /* TreeHashMapSetterBytes!((map, "bytes"), nybList, 0,  depth, newVal, hash.slice(depth, 32), *ret2) */
                      } |
                      TreeHashMapSetter!(map, nybList, 0, depth, newVal, hash.slice(depth, 32), *ret1) |
                      for (_ <- ret1; _ <- ret2) {
                        ret!(Nil)
                      }
                    }
                  } else {
                    TreeHashMapSetter!(map, nybList, 0,  depth, newVal, hash.slice(depth, 32), *ret)
                  }
                }
              }
            }
          }
        }
      } |

      contract TreeHashMapContains(@map, @nybList, @n, @len, @suffix, ret) = {
        // Look up the value of the node at [map, nybList.slice(0, n + 1)]
        new valCh in {
          nodeGet!((map, nybList.slice(0, n)), *valCh) |
          for (@val <- valCh) {
            if (n == len) {
              ret!(val.contains(suffix))
            } else {
              // See getter for explanation of formula
              if ((val/powers.nth(nybList.nth(n))) % 2 == 0) {
                ret!(false)
              } else {
                TreeHashMapContains!(map, nybList, n + 1, len, suffix, *ret)
              }
            }
          }
        }
      } |

      contract TreeHashMap(@"contains", @map, @key, ret) = {
        new hashCh, nybListCh in {
          // Hash the key to get a 256-bit array
          keccak256Hash!(key.toByteArray(), *hashCh) |
          for (@hash <- hashCh) {
            for (@depth <<- @(map, "depth")) {
              // Get the bit list
              ByteArrayToNybbleList!(hash, 0, depth, [], *nybListCh) |
              for (@nybList <- nybListCh) {
                TreeHashMapContains!(map, nybList, 0,  depth, hash.slice(depth, 32), *ret)
              }
            }
          }
        }
      } |

      contract TreeHashMapUpdater(@map, @nybList, @n, @len, update, @suffix, ret) = {
        // Look up the value of the node at [map, nybList.slice(0, n + 1)
        new valCh in {
          match (map, nybList.slice(0, n)) {
            node => {
              for (@val <<- @[node, *storeToken]) {
                if (n == len) {
                  // We're at the end of the path.
                  if (val == 0) {
                    // There's nothing here.
                    // Return
                    ret!(Nil)
                  } else {
                    new resultCh in {
                      // Acquire the lock on this node
                      for (@val <- @[node, *storeToken]) {
                        // Update the current value
                        update!(val.get(suffix), *resultCh) |
                        for (@newVal <- resultCh) {
                          // Release the lock
                          @[node, *storeToken]!(val.set(suffix, newVal)) |
                          // Return
                          ret!(Nil)
                        }
                      }
                    }
                  }
                } else {
                  // Otherwise try to reach the end of the path.
                  // Bit k set means child node k exists.
                  if ((val/powers.nth(nybList.nth(n))) % 2 == 0) {
                    // If the path doesn't exist, there's no value to update.
                    // Return
                    ret!(Nil)
                  } else {
                    // Child node exists, loop
                    TreeHashMapUpdater!(map, nybList, n + 1, len, *update, suffix, *ret)
                  }
                }
              }
            }
          }
        }
      } |
      contract TreeHashMap(@"update", @map, @key, update, ret) = {
        new hashCh, nybListCh in {
          // Hash the key to get a 256-bit array
          keccak256Hash!(key.toByteArray(), *hashCh) |
          for (@hash <- hashCh) {
            for (@depth <<- @(map, "depth")) {
              // Get the bit list
              ByteArrayToNybbleList!(hash, 0, depth, [], *nybListCh) |
              for (@nybList <- nybListCh) {
                TreeHashMapUpdater!(map, nybList, 0,  depth, *update, hash.slice(depth, 32), *ret)
              }
            }
          }
        }
      }
    }
  }
} |

  // depth 2 = 12 * 12 = 144 maps
  TreeHashMap!("init", ${payload.depth || 1}, true, *pursesReadyCh) |
  TreeHashMap!("init", ${payload.depth || 1}, false, *pursesForSaleReadyCh) |

  /* forbidden characters are used as delimiters in
  tree hash map, this method checks they are not aprt
  of a byte array */
  // store-as-bytes-array
  /* for (@(ba, ret) <= byteArraySafeToStoreCh) {
    new itCh1, itCh2, removeSectionCh, indexesCh in {
      itCh1!(0) |
      indexesCh!([]) |
      for (@i <= itCh1) {
        if (ba.slice(i, i + 6) == "£$£$£$£$".toByteArray().slice(4, 10)) {
          @ret!(false)
        } else {
          if (i == ba.length() - 6) {
            @ret!(true)
          } else {
            itCh1!(i + 1)
          }
        }
      }
    }
  } | */

  for (@thm <- pursesReadyCh; @thm2 <- pursesForSaleReadyCh) {
    /*
      makePurseCh
      only place where new purses are created
      "WITHDRAW", "PUBLIC_PURCHASE", "SWAP", "CREATE_PURSES" only call this channel

      depending on if .fungible is true or false, it decides
      which id to give to the new purse, then it creates
      the purse with SWAP, UPDATE_DATA, SET_PRICE, WITHDRAW, DEPOSIT instance methods
    */
    for (@(properties, data, return) <= makePurseCh) {
      new idAndQuantityCh, safeStringCh, thmGetReturnCh, thmGetReturn2Ch, thmGetReturn3Ch in {
        for (current <<- mainCh) {
          if (*current.get("fungible") == true) {
            for (counter <- counterCh) {
              counterCh!(*counter + 1) |
              idAndQuantityCh!({ "id": "\${n}" %% { "n": *counter }, "quantity": properties.get("quantity") })
            }
          } else {
            TreeHashMap!("get", thm, properties.get("id"), *thmGetReturnCh) |
            for (@existingPurseProperties <- thmGetReturnCh) {
              if (existingPurseProperties == Nil) {
                idAndQuantityCh!({ "id": properties.get("id"), "quantity": properties.get("quantity") })
                // store-as-bytes-array
                /* byteArraySafeToStoreCh!(((properties.get("type"), properties.get("id")).toByteArray(), *byteArraySafeToStoreReturnCh)) */
              } else {
                if (properties.get("id") == "0") {
                  TreeHashMap!("get", thm, properties.get("newId"), *thmGetReturn2Ch) |
                  for (properties2 <- thmGetReturn2Ch) {
                    match (properties.get("newId"), *properties2) {
                      (String, Nil) => {
                        idAndQuantityCh!({ "id": properties.get("newId"), "quantity": 1 })
                        // store-as-bytes-array
                        /* byteArraySafeToStoreCh!(((properties.get("type"), properties.get("newId")).toByteArray(), *byteArraySafeToStoreReturnCh)) */
                      }
                      _ => {
                        @return!("error: no .newId in payload or .newId already exists")
                      }
                    }
                  }
                } else {
                  @return!("error: purse ID already exists")
                }
              }
            }
          }
        } |
        for (@idAndQuantity <- idAndQuantityCh) {
          match properties
            .set("id", idAndQuantity.get("id"))
            .set("quantity", idAndQuantity.get("quantity"))
            .delete("newId")
          {
            purseProperties => {
              match (purseProperties, purseProperties.get("id").length() > 0, purseProperties.get("id").length() < 25) {
                ({
                  "quantity": Int,
                  // .box may is used to deploy other contracts
                  // and send purses to existing owners
                  "box": URI,
                  // .publicKey is used if purse is sold
                  "publicKey": String,
                  "type": String,
                  "id": String,
                  "price": Nil \\/ Int
                }, true, true) => {
                  new purse, setReturnCh in {
                    TreeHashMap!("set", thm, purseProperties.get("id"), purseProperties, *setReturnCh) |
                    for (_ <- setReturnCh) {

                      @(*pursesData, purseProperties.get("id"))!(data) |
                      @(*vault, *purse)!(purseProperties.get("id")) |

                      // todo if returns bundle+{*purse}, we can't iterate
                      // at line 627, why ???
                      @return!(*purse) |

                      /*
                        READ
                        Returns properties "id", "quantity", "type", "box" and "price"
                        (Nil) => propertie
                      */
                      for (@("READ", Nil, returnRead) <= purse) {
                        for (id <<- @(*vault, *purse)) {
                          TreeHashMap!("get", thm, *id, returnRead)
                        }
                      } |

                      /*
                        SWAP
                        (payload: { box: URI, publicKey: String }) => String | (true, purse)
                        Useful when you receive purse from unknown source, swap it
                        to make sure emitter did not keep a copy
                      */
                      for (@("SWAP", payload, returnSwap) <= purse) {
                        match (payload.get("box"), payload.get("publicKey")) {
                          (URI, String) => {
                            for (id <- @(*vault, *purse)) {
                              stdout!(("purse.SWAP", *id)) |
                              new setReturnCh, setForSaleReturnCh, getReturnCh, makePurseReturnCh in {
                                TreeHashMap!("get", thm, *id, *getReturnCh) |
                                for (properties <- getReturnCh) {
                                  if (*properties == Nil) {
                                    @returnSwap!("error: purse is worthless")
                                  } else {
                                    // todo remove key in treeHashMap instead of set Nil
                                    // not implemented in rnode yet
                                    TreeHashMap!("set", thm, *id, Nil, *setReturnCh) |
                                    TreeHashMap!("set", thm2, *id, Nil, *setForSaleReturnCh) |
                                    for (_ <- setReturnCh; _ <- setForSaleReturnCh; data <- @(*pursesData, *id)) {
                                      makePurseCh!((
                                        *properties
                                          .set("box", payload.get("box"))
                                          .set("publicKey", payload.get("publicKey")),
                                        *data,
                                        *makePurseReturnCh
                                      )) |
                                      for (newPurse <- makePurseReturnCh) {
                                        match *newPurse {
                                          String => {
                                            @returnSwap!("error: CRITICAL makePurse went wrong " ++ *newPurse)
                                          }
                                          _ => {
                                            stdout!(("purse.SWAP successful", *id)) |
                                            @returnSwap!((true, *newPurse))
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                          _ => {
                            @returnSwap!("error: payload must be box: URI, publicKey: String")
                          }
                        }
                      } |

                      /*
                        UPDATE_DATA
                        (payload: any) => String | (true, Nil)
                      */
                      for (@("UPDATE_DATA", payload, returnUpdateData) <= purse) {
                        new getReturnCh in {
                          for (id <<- @(*vault, *purse)) {
                            stdout!(("purse.UPDATE_DATA", *id)) |
                            TreeHashMap!("get", thm, *id, *getReturnCh) |
                            for (properties <- getReturnCh) {
                              if (*properties == Nil) {
                                @returnUpdateData!("error: purse is worthless")
                              } else {
                                for (_ <- @(*pursesData, *id)) {
                                  stdout!(("purse.UPDATE_DATA successful", *id)) |
                                  @(*pursesData, *id)!(payload) |
                                  @returnUpdateData!((true, Nil))
                                }
                              }
                            }
                          }
                        }
                      } |

                      /*
                        SET_PRICE
                        (payload: Int or Nil) => String | (true, Nil)
                      */
                      for (@("SET_PRICE", payload, returnSetPrice) <= purse) {
                        match payload {
                          Int \\/ Nil => {
                            new setReturnCh, getReturnCh, setForSaleReturnCh in {
                              for (id <<- @(*vault, *purse)) {
                                stdout!(("purse.SET_PRICE", *id)) |
                                TreeHashMap!("get", thm, *id, *getReturnCh) |
                                for (properties <- getReturnCh) {
                                  if (*properties == Nil) {
                                    @returnSetPrice!("error: purse is worthless")
                                  } else {
                                    TreeHashMap!("set", thm, *id, *properties.set("price", payload), *setReturnCh) |
                                    for (_ <- setReturnCh) {
                                      stdout!(("purse.SET_PRICE successful", *id)) |
                                      match payload {
                                        Int => {
                                          TreeHashMap!("set", thm2, *id, *purse, *setForSaleReturnCh) |
                                          for (_ <- setForSaleReturnCh) {
                                            @returnSetPrice!((true, Nil))
                                          }
                                        }
                                        Nil => {
                                          TreeHashMap!("set", thm2, *id, Nil, *setForSaleReturnCh) |
                                          for (_ <- setForSaleReturnCh) {
                                            @returnSetPrice!((true, Nil))
                                          }
                                        }
                                      }
                                    }
                                  }
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
                        (payload: Int) => String | (true, purse)
                      */
                      for (@("WITHDRAW", payload, returnWithdraw) <= purse) {
                        match payload {
                          Int => {
                            new getReturnCh, makePurseReturnCh, setReturnCh in {
                              for (id <<- @(*vault, *purse)) {
                                stdout!(("purse.WITHDRAW", *id)) |
                                TreeHashMap!("get", thm, *id, *getReturnCh) |
                                for (@properties <- getReturnCh) {
                                  if (properties == Nil) {
                                    @returnWithdraw!("error: purse is worthless")
                                  } else {
                                    match (
                                      /*
                                        The remaining cannot be 0, if you want to send
                                        the whole purse, just hand the *purse object to someone's box
                                      */
                                      properties.get("quantity") > payload,
                                      payload > 0
                                    ) {
                                      (true, true) => {
                                        /*
                                          change quantity in *purse, and create a new purse
                                          with [payload] quantity
                                        */
                                        TreeHashMap!("set", thm, properties.get("id"), properties.set("quantity", properties.get("quantity") - payload), *setReturnCh) |
                                        for (_ <- setReturnCh) {
                                          makePurseCh!((
                                            properties.set("quantity", payload).set("price", Nil), Nil, *makePurseReturnCh
                                          )) |
                                          for (newPurse <- makePurseReturnCh) {
                                            stdout!(("purse.WITHDRAW successful", *id)) |
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
                            }

                          }
                          _ => {
                            @returnWithdraw!("error: payload must be an integer")
                          }
                        }
                      } |


                      /*
                        DEPOSIT
                        (payload: purse) => String | (true, Nil)
                      */
                      for (@("DEPOSIT", payload, returnDeposit) <= purse) {
                        new proceedCh, receivePursesReturnCh, getReturnCh, getReturn2Ch, setReturnCh, setReturn2Ch in {
                          for (current <<- mainCh) {
                            if (*current.get("fungible") == true) {
                              proceedCh!(Nil)
                            } else {
                              @returnDeposit!("error: cannot deposit in a fungible = false contract")
                            }
                          } |
                          for (_ <- proceedCh) {
                            for (id <<- @(*vault, *purse); depositedPurseId <<- @(*vault, payload)) {
                              stdout!(("purse.DEPOSIT", *id)) |
                              TreeHashMap!("get", thm, *id, *getReturnCh) |
                              TreeHashMap!("get", thm, *depositedPurseId, *getReturn2Ch) |
                              for (@properties1 <- getReturnCh; @properties2 <- getReturn2Ch) {
                                match (
                                  properties1 != Nil,
                                  properties2 != Nil,
                                  *depositedPurseId != *id,
                                  properties2.get("quantity"),
                                  properties2.get("quantity") > 0,
                                  properties1.get("type") == properties2.get("type"),
                                  properties1.get("price")
                                ) {
                                  (true, true, true, Int, true, true, Nil) => {
                                    // delete purse [payload], and remove data
                                    TreeHashMap!("set", thm, *depositedPurseId, Nil, *setReturnCh) |
                                    for (_ <- @(*vault, payload); _ <- @(*pursesData, *depositedPurseId); _ <- setReturnCh) {

                                      // set new quantity in purse
                                      TreeHashMap!("set", thm, *id, properties1.set(
                                          "quantity",
                                          properties1.get("quantity") + properties2.get("quantity")
                                        ), *setReturn2Ch) |
                                      for (_ <- setReturn2Ch) {
                                        stdout!(("purse.DEPOSIT successful", *id)) |
                                        @returnDeposit!((true, Nil))
                                      }
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
                }
                _ => {
                  @return!("error: invalid purse, one of the following errors: id length must be between length 1 and 24, id/type must not contain characters £$£$")
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
            new itCh, sizeCh, createdPursesesCh, saveKeyAndBagCh in {
              createdPursesesCh!([]) |
              sizeCh!(payload.get("purses").keys().size()) |
              for (@size <- sizeCh) {
                itCh!(payload.get("purses").keys()) |
                for(@set <= itCh) {
                  match set {
                    Nil => {}
                    Set(last) => {
                      new retCh in {
                        makePurseCh!((payload.get("purses").get(last), payload.get("data").get(last), *retCh)) |
                        for (purse <- retCh) {
                          match *purse {
                            String => {
                              @return!(*purse)
                            }
                            _ => {
                              @return!((true, { "total": size, "purse": *purse }))
                            }
                          }
                        }
                      }
                    }
                    Set(first ... rest) => {
                      new retCh in {
                        makePurseCh!((payload.get("purses").get(first), payload.get("data").get(first), *retCh)) |
                        for (purse <- retCh) {
                          match *purse {
                            String => {
                              @return!(*purse)
                            }
                            _ => {
                              itCh!(rest) |
                              @return!((true, { "total": size, "purse": *purse }))
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

    contract iterateDataCh(@(ids, return)) = {
      new tmpCh, itCh in {
        for (@(tmpCh, ids) <= itCh) {
          for (tmp <- @tmpCh) {
            match ids {
              Nil => {
                @return!(*tmp)
              }
              Set(last) => {
                for (val <<- @(*pursesData, last)) {
                  @return!(*tmp.set(last, *val))
                }
              }
              Set(first ... rest) => {
                for (val <<- @(*pursesData, first)) {
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

    contract iteratePropertiesCh(@(ids, return)) = {
      new tmpCh, itCh in {
        for (@(tmpCh, ids) <= itCh) {
          for (tmp <- @tmpCh) {
            match ids {
              Nil => {
                @return!(*tmp)
              }
              Set(last) => {
                new retCh in {
                  TreeHashMap!("get", thm, last, *retCh) |
                  for (properties <- retCh) {
                    @return!(*tmp.set(last, *properties))
                  }
                }
              }
              Set(first ... rest) => {
                new retCh in {
                  TreeHashMap!("get", thm, first, *retCh) |
                  for (properties <- retCh) {
                    @tmpCh!(*tmp.set(first, *properties)) |
                    itCh!((tmpCh, rest))
                  }
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

    for (@("PUBLIC_READ_ALL_PURSES", Nil, return) <= entryCh) {
      new getAllValuesCh in {
        TreeHashMap!("getAllValues", thm, *getAllValuesCh) |
        for (@allValues <- getAllValuesCh) {
          @return!(allValues)
        }
      }
    } |

    for (@("PUBLIC_READ_PURSES", payload, return) <= entryCh) {
      match payload.size() < 101 {
        true => {
          iteratePropertiesCh!((payload, return))
        }
        _ => {
          @return!("error: payload must be a Set of strings with max size 100")
        }
      }
    } |

    for (@("PUBLIC_READ_PURSES_DATA", payload, return) <= entryCh) {
      match payload.size() < 101 {
        true => {
          iterateDataCh!((payload, return))
        }
        _ => {
          @return!("error: payload must be a Set of strings with max size 100")
        }
      }
    } |

    for (@("PUBLIC_READ", payload, return) <= entryCh) {
      for (current <<- mainCh) {
        @return!(*current)
      }
    } |

    /*
      (purse[]) => String | (true, id[])
      receives a list of purse, check that (they exist + no duplicate)
      and returns the corresponding list of ids
    */
    for (@("PUBLIC_CHECK_PURSES", payload, return) <= entryCh) {
      new tmpCh, itCh in {
        for (@keys <= itCh) {
          for (tmp <- tmpCh) {
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
                  tmpCh!(*tmp.union(Set(*id))) |
                  itCh!(rest)
                }
              }
            }
          }
        } |
        tmpCh!(Set()) |
        itCh!(payload)
      }
    } |


    for (@(amount, return) <= calculateFeeCh) {
      for (@current <<- mainCh) {
        if (current.get("fee") == Nil) {
          @return!((amount, 0))
        } else {
          match amount * current.get("fee").nth(1) / 100000 {
            feeAmount => {
              @return!((amount - feeAmount, feeAmount))
            }
          }
        }
      }
    } |

    /*
      (payload) => String | (true, purse)
      purchase with REV from a purse that has .price
      property not Nil
      see payload below
    */
    // todo limitation total payload size ??
    for (@("PUBLIC_PURCHASE", payload, return) <= entryCh) {
      match payload {
        { "quantity": Int, "purseId": String, "publicKey": String, "box": URI, "newId": Nil \\/ String, "data": _, "purseRevAddr": _, "purseAuthKey": _ } => {
          new getReturnCh, revVaultCh, ownerRevAddressCh, purseVaultCh, calculateFeeReturnCh, performRefundCh, balanceCh in {

            // refund if something went wrong
            for (@message <- performRefundCh) {
              new refundPurseBalanceCh, refundRevAddressCh, refundResultCh, refundPurseVaultCh, revVaultRefundReturnCh in {
                registryLookup!(\`rho:rchain:revVault\`, *revVaultRefundReturnCh) |
                for (@(_, RevVault) <- revVaultRefundReturnCh) {
                  @RevVault!("findOrCreate", payload.get("purseRevAddr"), *refundPurseVaultCh) |
                  for (@(true, purseVault) <- refundPurseVaultCh) {
                    @purseVault!("balance", *refundPurseBalanceCh) |
                    revAddress!("fromPublicKey", payload.get("publicKey").hexToBytes(), *refundRevAddressCh) |
                    for (@balance <- refundPurseBalanceCh; @buyerRevAddress <- refundRevAddressCh) {
                      @purseVault!("transfer", buyerRevAddress, balance, payload.get("purseAuthKey"), *refundResultCh) |
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
                }
              }
            } |

            TreeHashMap!("get", thm, payload.get("purseId"), *getReturnCh) |
            for (@properties <- getReturnCh) {
              match (
                properties.get("price"),
                properties.get("quantity") > 0,
                payload.get("quantity") > 0,
                properties.get("quantity") >= payload.get("quantity")
              ) {
                (Int, true, true, true) => {
                  registryLookup!(\`rho:rchain:revVault\`, *revVaultCh) |
                  revAddress!("fromPublicKey", properties.get("publicKey").hexToBytes(), *ownerRevAddressCh) |

                  calculateFeeCh!((payload.get("quantity") * properties.get("price"), *calculateFeeReturnCh)) |
                  for (@(_, RevVault) <- revVaultCh; @ownerRevAddress <- ownerRevAddressCh; amountAndFeeAmount <- calculateFeeReturnCh) {
                    match (
                      payload.get("purseRevAddr"),
                      ownerRevAddress,
                      *amountAndFeeAmount.nth(0),
                      *amountAndFeeAmount.nth(1)
                    ) {
                      (from, to, amount, feeAmount) => {
                        @RevVault!("findOrCreate", from, *purseVaultCh) |
                        for (@(true, purseVault) <- purseVaultCh) {
                          @purseVault!("balance", *balanceCh) |
                          for (@balance <- balanceCh) {
                            if (balance == payload.get("quantity") * properties.get("price")) {
                              // ${payload.fee ? `["${payload.fee[0]}", ${payload.fee[1]}]` : "Nil"}
                              match feeAmount > 0 {
                                true => {
                                  new feeRevAddressCh, transferFeeReturnCh in {
                                    for (@current <<- mainCh) {
                                      revAddress!("fromPublicKey", current.get("fee").nth(0).hexToBytes(), *feeRevAddressCh) |
                                      for (@feeRevAddress <- feeRevAddressCh) {
                                        @purseVault!("transfer", feeRevAddress, feeAmount, payload.get("purseAuthKey"), *transferFeeReturnCh)
                                      } |
                                      for (@transferFeeReturn <- transferFeeReturnCh) {
                                        match transferFeeReturn {
                                          (true, Nil) => {
                                            stdout!("fee transfer successful")
                                          }
                                          _ => {
                                            stdout!("error: CRITICAL could not transfer fee")
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              } |
                              new makePurseReturnCh, transferReturnCh, setReturnCh, getForSaleReturnCh in {
                                // todo pay transfer fee
                                @purseVault!("transfer", to, amount, payload.get("purseAuthKey"), *transferReturnCh) |
                                for (@result <- transferReturnCh) {
                                  match result {
                                    (true, Nil) => {
                                      /*
                                        Check if the purse must be removed because quantity 0
                                        if fungible: false, we always match 0
                                        if match 0, simply send back the purse, it will probably
                                        be SWAPed by the buyer
                                      */
                                      match properties.get("quantity") - payload.get("quantity") {
                                        0 => {
                                          // todo remove key in treeHashMap instead of set Nil
                                          // not implemented in rnode yet
                                          TreeHashMap!("get", thm2, properties.get("id"), *getForSaleReturnCh) |
                                          for (purse <- getForSaleReturnCh) {
                                            stdout!(("buyer receives entire purse from seller", *purse)) |
                                            if (*purse == Nil) {
                                              performRefundCh!("error: CRITICAL purse was not found in pursesForSale")
                                            } else {
                                              @return!((true, *purse))

                                            }
                                          }
                                        }
                                        _ => {
                                          // change quantity of exiting purse
                                          TreeHashMap!("set", thm, properties.get("id"),
                                            properties.set("quantity", properties.get("quantity") - payload.get("quantity"))
                                          , *setReturnCh) |
                                          // create a new purse
                                          for (_ <- setReturnCh) {
                                            makePurseCh!((
                                              properties
                                                .set("price", Nil)
                                                .set("newId", payload.get("newId"))
                                                .set("quantity", payload.get("quantity"))
                                                .set("publicKey", payload.get("publicKey"))
                                                .set("box", payload.get("box")),
                                              payload.get("data"),
                                              *makePurseReturnCh
                                            )) |
                                            for (newPurse <- makePurseReturnCh) {
                                              match *newPurse {
                                                String => {
                                                  performRefundCh!("error: CRITICAL makePurse went wrong " ++ *newPurse)
                                                }
                                                _ => {
                                                  @return!((true, *newPurse))
                                                }
                                              }
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
                            } else {
                              performRefundCh!("error: balance of purse does not equal quantity * price")
                            }
                          }
                        }
                      }
                    }
                  }
                }
                _=> {
                  performRefundCh!("error: quantity not available or purse not for sale")
                }
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

    insertArbitrary!(bundle+{*entryCh}, *entryUriCh) |

    for (entryUri <- entryUriCh) {
      stdout!(*entryUri) |
      new boxDataCh, boxEntryCh, boxReturnCh in {
        registryLookup!(\`rho:id:${fromBoxRegistryUri}\`, *boxEntryCh) |
        for (boxEntry <- boxEntryCh) {
          boxEntry!(("PUBLIC_READ", Nil, *boxDataCh)) |
          for (r <- boxDataCh) {
            match (*r.get("version")) {
              "5.0.3" => {
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
                        // fee on each PUBLIC_PURCHASE operation
                        // .fee: Nil | tuple(publicKey: string, fee: Int)
                        // .fee is express NOT IN PERCENT but in PER 100.000
                        // example: 1000 = 1% fee, 200 = 0.2% etc.
                        "fee": ${payload.fee ? `["${payload.fee[0]}", ${payload.fee[1]}]` : "Nil"},
                        "registryUri": *entryUri,
                        "locked": false,
                        "fungible": ${payload.fungible},
                        "name": "${payload.name}",
                        "version": "5.0.3"
                      }) |
                      stdout!({
                        "status": "completed",
                        "fee": ${payload.fee ? `["${payload.fee[0]}", ${payload.fee[1]}]` : "Nil"},
                        "registryUri": *entryUri,
                        "locked": false,
                        "fungible": ${payload.fungible},
                        "name": "${payload.name}",
                        "version": "5.0.3"
                      }) |
                      stdout!("completed, contract deployed")
                    }
                  }
                }
              }
              _ => {
                mainCh!({
                  "status": "failed",
                  "message": "box has not the same version number 5.0.3",
                }) |
                stdout!({
                  "status": "failed",
                  "message": "box has not the same version number 5.0.3",
                })
              }
            }
          }
        }
      }
      /*OUTPUT_CHANNEL*/
    }
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
  listenAgainOnReturnCh,
  processPurseCh,
  listenManyTimesCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!(({ "type": "READ_SUPER_KEYS" }, *boxCh)) |

  for (superKeys <- boxCh) {
    match *superKeys.get(\`rho:id:${registryUri}\`) {
      superKey => {
        @(superKey, "CREATE_PURSES")!((
          {
            // example
            // "purses": { "0": { "publicKey": "abc", "box": \`rho:id:abc\`, "type": "gold", "quantity": 3, "data": Nil }}
            "purses": ${JSON.stringify(payload.purses).replace(new RegExp(': null|:null', 'g'), ': Nil')
        .split('"$BQ').join('`')
        .split('$BQ"').join('`')},
            // example
            // "data": { "0": "this bag is mine" }
            "data": ${JSON.stringify(payload.data).replace(new RegExp(': null|:null', 'g'), ': Nil')},
          },
          *returnCh
        ))
      }
    }
  } |

  
  for (@i <= listenAgainOnReturnCh) {
    for (@resp <- returnCh) {
      match resp {
        String => {
          basket!({ "status": "failed", "message": resp }) |
          stdout!(("failed", resp))
        }
        (true, result) => {
          if (i + 1 == result.get("total")) {
            processPurseCh!((result.get("purse"), Nil, true))
          } else {
            new createNextCh in {
              processPurseCh!((result.get("purse"), *createNextCh, false)) |
              for (_ <- createNextCh) {
                listenAgainOnReturnCh!(i + 1)
              }
            }
          }
        }
      }
    }
  } |
  listenAgainOnReturnCh!(0) |

  for (@(purse, createNextCh, last) <= processPurseCh) {
    new entryCh, return2Ch, itCh in {
      registryLookup!(\`rho:id:${payload.fromBoxRegistryUri}\`, *entryCh) |
      for (entry <- entryCh) {
        new readReturnCh, receivePurseReturnCh in {
          @purse!(("READ", Nil, *readReturnCh)) |
          entry!((
            "PUBLIC_RECEIVE_PURSE", {
              "registryUri": \`rho:id:${registryUri}\`,
              "purse": purse
            }, *receivePurseReturnCh)
          ) |
          for (r <- receivePurseReturnCh) {
            match *r {
              String => {
                basket!({ "status": "failed", "message": *r }) |
                stdout!(("failed", *r))
              }
              _ => {
                if (last == true) {
                  stdout!("completed, purses created and saved to box") |
                  basket!({ "status": "completed" })
                } else {
                  @createNextCh!(Nil)
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
          boxEntry!(("PUBLIC_RECEIVE_PURSE", 
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
                      Remove the purse from emitter's box now that it is worthless :
                      deleted in contract
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
                  boxEntry!(("PUBLIC_RECEIVE_PURSE", 
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
      entry!(("PUBLIC_READ_PURSES", Set(${payload.pursesIds
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

  var readAllPursesTerm_1 = (
    registryUri,
    payload
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${registryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      entry!(("PUBLIC_READ_ALL_PURSES", Nil, *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
      };

  var readAllPursesTerm = {
  	readAllPursesTerm: readAllPursesTerm_1
  };

  var readPursesIdsTerm_1 = (
    registryUri
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${registryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      entry!(("PUBLIC_READ_PURSES_IDS", Nil, *x)) |
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
      entry!(("PUBLIC_READ", Nil, *a)) |
      for (current <- a) {
        new b in {
          entry!(("PUBLIC_READ_SUPER_KEYS", Nil, *b)) |
          for (superKeys <- b) {
            new c in {
              entry!(("PUBLIC_READ_PURSES", Nil, *c)) |
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
      entry!(("PUBLIC_READ", Nil, *x)) |
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
        @purse!(("UPDATE_DATA", "${payload.data}", *returnCh)) |
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
      entry!(("PUBLIC_READ_PURSES_DATA", Set(${payload.pursesIds
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
        @purse!(("WITHDRAW", ${payload.quantityInNewPurse}, *withdrawReturnCh)) |
        for (r <- withdrawReturnCh) {
          stdout!(("WITHDRAW OK", *r)) |
          match *r {
            String => {
              basket!({ "status": "failed", "message": *r }) |
              stdout!(("failed", *r))
            }
            (true, newPurse) => {
              /*
                Save new purse without joining it (DEPOSIT) to a purse with same type
              */
              @(*deployerId, "rho:id:${payload.fromBoxRegistryUri}")!((
                { "type": "SAVE_PURSE_SEPARATELY", "payload": { "registryUri": \`rho:id:${registryUri}\`, "purse": newPurse } },
                *savePurseReturnCh
              )) |
              for (r2 <- savePurseReturnCh) {
                stdout!(("SAVE_PURSE_SEPARATELY OK", *r2)) |
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
        @purse!(("SET_PRICE", ${payload.price || "Nil"}, *sendReturnCh)) |
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
  boxExistsCh,
  boxValuesCh,
  contractExistsCh,
  contractValuesCh,
  proceed1Ch,
  proceed2Ch,
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
  // New ID only used if fungible = false, if fungible = true set to Nil
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

  registryLookup!(\`rho:id:${payload.toBoxRegistryUri}\`, *boxExistsCh) |
  registryLookup!(\`rho:id:${registryUri}\`, *contractExistsCh) |
  for (boxExists <- boxExistsCh; contractExists <- contractExistsCh) {
    boxExists!(("PUBLIC_READ", Nil, *boxValuesCh)) |
    contractExists!(("PUBLIC_READ", Nil, *contractValuesCh)) |
    for (@contractValues <- contractValuesCh; @boxValues <- boxValuesCh ) {
      match contractValues.get("version") == boxValues.get("version") {
        true => {
          proceed1Ch!(Nil)
        }
        true => {
          basket!({ "status": "failed", "message": "box and contract don't have the same version, cancelled purchase and payment" }) |
          stdout!(("failed", "box and contract don't have the same version, cancelled purchase and payment"))
        }
      }
    }
  } |

  registryLookup!(\`rho:rchain:revVault\`, *revVaultPurseCh) |

  /*
    Create a vault/purse that is just used once (purse)
  */
  for(@(_, *RevVaultPurse) <- revVaultPurseCh; _ <- proceed1Ch) {
    new unf, purseRevAddrCh, purseAuthKeyCh, purseVaultCh, revAddressCh, RevVaultCh in {
      revAddress!("fromUnforgeable", *unf, *purseRevAddrCh) |
      RevVaultPurse!("unforgeableAuthKey", *unf, *purseAuthKeyCh) |
      for (@purseAuthKey <- purseAuthKeyCh; @purseRevAddr <- purseRevAddrCh) {

        stdout!({"new purse rev addr": purseRevAddr, "purse authKey": purseAuthKey}) |

        RevVaultPurse!("findOrCreate", purseRevAddr, *purseVaultCh) |

        for (
          @(true, purseVault) <- purseVaultCh;
          @publicKey <- publicKeyCh;
          @purseId <- purseIdCh;
          @registryUri <- registryUriCh;
          @price <- priceCh;
          @quantity <- quantityCh;
          @newId <- newIdCh;
          @data <- dataCh
        ) {

          match {
            "publicKey": publicKey,
            "price": price,
            "quantity": quantity,
            "purseId": purseId,
            "newId": newId,
          } {
            {
              "publicKey": String,
              "price": Int,
              "quantity": Int,
              "purseId": String,
              "newId": String,
            } => {
              proceed2Ch!(Nil)
            }
            _ => {
              basket!({ "status": "failed", "message": "error: invalid payload, cancelled purchase and payment" }) |
              stdout!(("failed", "error: invalid payload, cancelled purchase and payment"))
            }
          } |

          for (_ <- proceed2Ch) {

            revAddress!("fromPublicKey", publicKey.hexToBytes(), *revAddressCh) |

            registryLookup!(\`rho:rchain:revVault\`, *RevVaultCh) |
            for (@(_, RevVault) <- RevVaultCh; deployerRevAddress <- revAddressCh) {
              // send price * quantity REV in purse
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
                                entry!(("PUBLIC_PURCHASE", {
                                    "quantity": quantity,
                                    "purseId": purseId,
                                    "newId": newId,
                                    "data": data,
                                    "box": \`rho:id:${payload.toBoxRegistryUri}\`,
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
                                        entry!(("PUBLIC_READ", Nil, *readReturnCh)) |
                                        for (@current <- readReturnCh) {
                                          match "${payload.actionAfterPurchase || "PUBLIC_RECEIVE_PURSE"}" {
                                            "PUBLIC_RECEIVE_PURSE" => {
                                              registryLookup!(\`rho:id:${payload.toBoxRegistryUri}\`, *boxEntryCh) |
                                              for (boxEntry <- boxEntryCh) {
                                                boxEntry!(("PUBLIC_RECEIVE_PURSE", 
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
                                      new refundPurseBalanceCh, refundResultCh in {
                                        @purseVault!("balance", *refundPurseBalanceCh) |
                                        for (@balance <- refundPurseBalanceCh) {
                                          // the refund was successful
                                          if (balance == 0) {
                                            basket!({ "status": "failed", "message": *resp }) |
                                            stdout!(("failed", *resp))
                                          } else {
                                            @purseVault!("transfer", from, balance, purseAuthKey, *refundResultCh) |
                                            for (result <- refundResultCh)  {
                                              match *result {
                                                (true, Nil) => {
                                                  basket!({ "status": "failed", "message": "purchase failed but was able to refund " ++ balance }) |
                                                  stdout!(("failed", "purchase failed but was able to refund " ++ balance))
                                                }
                                                _ => {
                                                  basket!({ "status": "failed", "message": "purchase failed and was NOT ABLE to refund " ++ balance }) |
                                                  stdout!(("failed", "purchase failed and was NOT ABLE to refund " ++ balance))
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
        @purse!(("WITHDRAW", ${payload.quantityToWithdraw}, *withdrawReturnCh)) |
        for (r <- withdrawReturnCh) {
          match *r {
            String => {
              basket!({ "status": "failed", "message": *r }) |
              stdout!(("failed", *r))
            }
            (true, newPurse) => {
              registryLookup!(\`rho:id:${payload.toBoxRegistryUri}\`, *boxEntryCh) |
              for (boxEntry <- boxEntryCh) {
                boxEntry!(("PUBLIC_RECEIVE_PURSE", 
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
                      boxEntry2!(("PUBLIC_RECEIVE_PURSE", 
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

  // store-as-bytes-map
  var decodePurses_1 = (expr, rhoExprToVar, decodePar) => {
    const purses = {};

    Object.keys(expr.ExprMap.data).forEach((k) => {
      const a = expr.ExprMap.data[k];
      if (a && a.ExprBytes && a.ExprBytes.data) {
        const b = Buffer.from(a.ExprBytes.data, 'hex');
        try {
          const valJs = rhoExprToVar(decodePar(b).exprs[0]);
          purses[valJs.id] = valJs;
        } catch (err) {
          throw err;
        }
      }
    });
    return purses;
  };

  // store-as-bytes-array
  /*
  const DELIMITER = 'c2a324c2a324c2a324c2a324'; // '£$£$£$£$' represented has hex
  const INSIDE_DELIMITER = 'c2a324c2a324'; // '£$£$' represented has hex
  module.exports.decodePurses = (expr, rhoExprToVar, decodePar) => {
    const purses = {};
    if (expr && expr.ExprBytes && expr.ExprBytes.data) {
      expr.ExprBytes.data
        .split(DELIMITER)
        // remove empty string at first index
        .filter((section) => !!section)
        .forEach((section) => {
          const b = Buffer.from(section.split(INSIDE_DELIMITER)[1], 'hex');
          try {
            const par = decodePar(b).exprs[0];
            const valJs = rhoExprToVar(par);
            purses[valJs.id] = valJs;
          } catch (err) {
            throw err;
          }
        });
    }
    return purses;
  }; */

  var decodePurses = {
  	decodePurses: decodePurses_1
  };

  // rholang terms
  const { boxTerm: boxTerm$1 } = boxTerm;
  const { mainTerm: mainTerm$1 } = mainTerm;
  const { createPursesTerm: createPursesTerm$1 } = createPursesTerm;
  const { sendPurseTerm: sendPurseTerm$1 } = sendPurseTerm;
  const { readPursesTerm: readPursesTerm$1 } = readPursesTerm;
  const { readAllPursesTerm: readAllPursesTerm$1 } = readAllPursesTerm;
  const { readPursesIdsTerm: readPursesIdsTerm$1 } = readPursesIdsTerm;
  const { readBoxTerm: readBoxTerm$1 } = readBoxTerm;
  const { readTerm: readTerm$1 } = readTerm;
  const { updatePurseDataTerm: updatePurseDataTerm$1 } = updatePurseDataTerm;
  const { readPursesDataTerm: readPursesDataTerm$1 } = readPursesDataTerm;
  const { splitPurseTerm: splitPurseTerm$1 } = splitPurseTerm;
  const { setPriceTerm: setPriceTerm$1 } = setPriceTerm;
  const { purchaseTerm: purchaseTerm$1 } = purchaseTerm;
  const { withdrawTerm: withdrawTerm$1 } = withdrawTerm;

  // utils
  const { decodePurses: decodePurses$1 } = decodePurses;

  var src = {
    version: '5.0.3',
    // rholang terms
    boxTerm: boxTerm$1,
    mainTerm: mainTerm$1,
    createPursesTerm: createPursesTerm$1,
    sendPurseTerm: sendPurseTerm$1,
    readPursesTerm: readPursesTerm$1,
    readAllPursesTerm: readAllPursesTerm$1,
    readPursesIdsTerm: readPursesIdsTerm$1,
    readBoxTerm: readBoxTerm$1,
    readTerm: readTerm$1,
    updatePurseDataTerm: updatePurseDataTerm$1,
    readPursesDataTerm: readPursesDataTerm$1,
    splitPurseTerm: splitPurseTerm$1,
    setPriceTerm: setPriceTerm$1,
    purchaseTerm: purchaseTerm$1,
    withdrawTerm: withdrawTerm$1,

    // utils
    decodePurses: decodePurses$1,
  };
  var src_1 = src.version;
  var src_2 = src.boxTerm;
  var src_3 = src.mainTerm;
  var src_4 = src.createPursesTerm;
  var src_5 = src.sendPurseTerm;
  var src_6 = src.readPursesTerm;
  var src_7 = src.readAllPursesTerm;
  var src_8 = src.readPursesIdsTerm;
  var src_9 = src.readBoxTerm;
  var src_10 = src.readTerm;
  var src_11 = src.updatePurseDataTerm;
  var src_12 = src.readPursesDataTerm;
  var src_13 = src.splitPurseTerm;
  var src_14 = src.setPriceTerm;
  var src_15 = src.purchaseTerm;
  var src_16 = src.withdrawTerm;
  var src_17 = src.decodePurses;

  exports.boxTerm = src_2;
  exports.createPursesTerm = src_4;
  exports.decodePurses = src_17;
  exports.default = src;
  exports.mainTerm = src_3;
  exports.purchaseTerm = src_15;
  exports.readAllPursesTerm = src_7;
  exports.readBoxTerm = src_9;
  exports.readPursesDataTerm = src_12;
  exports.readPursesIdsTerm = src_8;
  exports.readPursesTerm = src_6;
  exports.readTerm = src_10;
  exports.sendPurseTerm = src_5;
  exports.setPriceTerm = src_14;
  exports.splitPurseTerm = src_13;
  exports.updatePurseDataTerm = src_11;
  exports.version = src_1;
  exports.withdrawTerm = src_16;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
