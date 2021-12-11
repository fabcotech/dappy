(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.RChainToken = {}));
}(this, (function (exports) { 'use strict';

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var deployBoxTerm_1 = (
    payload
  ) => {
    return `new basket,
  masterEntryCh,
  registerBoxReturnCh,
  sendReturnCh,
  deletePurseReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *masterEntryCh) |

  for (masterEntry <- masterEntryCh) {
    masterEntry!(("PUBLIC_REGISTER_BOX", { "boxId": "${payload.boxId}", "publicKey": "${payload.publicKey}" }, *registerBoxReturnCh)) |
    for (@r <- registerBoxReturnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, box) => {
          @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")!(box) |
          basket!({ "status": "completed", "boxId": "${payload.boxId}" }) |
          stdout!("completed, box registered")
        }
      }
    }
  }
}
`;
  };

  var deployBoxTerm = {
  	deployBoxTerm: deployBoxTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var masterTerm_1 = (payload) => {
      return `new 
  basket,

  entryCh,
  entryUriCh,

  makePurseCh,
  transferToEscrowPurseCh,
  calculateFeeCh,
  initializeOCAPOnBoxCh,

  initLocksForContractCh,
  initLocksForBoxCh,

  /*
    vault is the ultimate accessibility unforgeable in
    master contract, every data is stored in channels that
    derives from *vault unforgeable name

    // tree hash map of purses :
    thm <- @(*vault, "purses", "contract03")

    // tree hash map of purses data :
    thm <- @(*vault, "pursesData", "contract03")

    // contract's configs
    config <- @(*vault, "contractConfig", "contract03")

    // box's configs
    config <- @(*vault, "boxConfig", "box01")

    // boxes (rholang Map)
    box <- @(*vault, "boxes", "box01")

    // super keys of a given box
    superKeys <- @(*vault, "boxesSuperKeys", "box01")
  */
  vault,

  /*
    boxesThm and contractsThm only store the list
    of existing contracts / boxes, ex:
    boxesThm:
    { "box1": "exists", "mycoolbox": "exists" }

    Then each box is a Map stored at a unique channel
    (see above) and has the following structure:
    {
      [contractId: string]: Set(purseId: string)
    }

    Each contract has its own tree hash map, and
    have the following structure:
    pursesThm, example of FT purses:
    {
      "1": { quantity: 2, timestamp: 12562173658, type: "0", boxId: "box1", price: Nil},
      "2": { quantity: 12, timestamp: 12562173658, type: "0", boxId: "box1", price: 2},
    }
  */
  boxesReadyCh,
  contractsReadyCh,

  TreeHashMap,

  savePurseInBoxCh,
  removePurseInBoxCh,
  getBoxCh,
  getPurseCh,
  getContractPursesThmCh,
  getContractPursesDataThmCh,

  insertArbitrary(\`rho:registry:insertArbitrary\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`),
  blockData(\`rho:block:data\`)
in {

  // reimplementation of TreeHashMap

/*
  Communications between channels have generally been reduced to reduce amount of
  serialization / deserialization

  when you "init" you can choose that the processes are also stored as bytes, instead of storing a map for each node, it stores a map at channel @map, and bytes at channel @(map, "bytes), this will make the "getAllValues" 10x, 20x, 30x faster depending on the process you are storing

  !!! make sure your processes do not contain the string "£$£$", or the bytes c2a324c2a324, those are used as delimiters
*/

new MakeNode, ByteArrayToNybbleList, TreeHashMapSetter, TreeHashMapGetter, TreeHashMapUpdater, HowManyPrefixes, NybbleListForI, RemoveBytesSectionIfExistsCh, keccak256Hash(\`rho:crypto:keccak256Hash\`), powersCh, storeToken, nodeGet in {
  match ([1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,655256], ["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"], 12) {
    (powers, hexas, base) => {
      contract MakeNode(@initVal, @node) = {
        @[node, *storeToken]!(initVal)
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
  
      // not used anymore, now getValuesAtIndex is used to get all values
      // this way we avoid iteration
      contract TreeHashMap(@"getAllValues", @map, ret) = {
        new howManyPrefixesCh, iterateOnPrefixesCh, nybListCh in {
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

      contract TreeHashMap(@"getValuesAtIndex", @map, @i, ret) = {
        new howManyPrefixesCh, nybListCh in {
          HowManyPrefixes!(map, *howManyPrefixesCh) |
          for (@depth <<- @(map, "depth")) {
            for (@alsoStoreAsBytes <<- @(map, "alsoStoreAsBytes")) {
              for (@howManyPrefixes <- howManyPrefixesCh ) {
                new TreeHashMapGetterValues in {
                  // do not move it up, the goal is reduce the number of serializatin / dezerialization
                  contract TreeHashMapGetterValues(@channel, @nybList, @n, @len, @i) = {
                    // channel is either map or (map, "bytes")
                    // Look up the value of the node at (channel, nybList.slice(0, n + 1))
                    for (@val <<- @[(channel, nybList.slice(0, n)), *storeToken]) {
                      if (n == len) {
                        ret!(val)
                      } else {
                        // Otherwise check if the rest of the path exists.
                        // Bit k set means node k exists.
                        // nybList.nth(n) is the node number
                        // val & powers.nth(nybList.nth(n)) is nonzero if the node exists
                        // (val / powers.nth(nybList.nth(n))) % 2 is 1 if the node exists
                        if ((val / powers.nth(nybList.nth(n))) % 2 == 0) {
                          ret!({})
                        } else {
                          TreeHashMapGetterValues!(channel, nybList, n + 1, len, i)
                        }
                      }
                    }
                  } |

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
                        TreeHashMapSetter!((map, "bytes"), nybList, 0,  depth, Nil, hash.slice(depth, 32), *ret2)
                      } else {
                        TreeHashMapSetter!((map, "bytes"), nybList, 0,  depth, newVal.toByteArray(), hash.slice(depth, 32), *ret2)
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
        new hashCh, nybListCh, keccak256Hash(\`rho:crypto:keccak256Hash\`) in {
          // Hash the key to get a 256-bit array
          keccak256Hash!(key.toByteArray(), *hashCh) |
          for (@hash <- hashCh) {
            for (@depth <<- @(map, "depth")) {
              for (@alsoStoreAsBytes <<- @(map, "alsoStoreAsBytes")) {
                // Get the bit list
                ByteArrayToNybbleList!(hash, 0, depth, [], *nybListCh) |
                for (@nybList <- nybListCh) {
                  if (alsoStoreAsBytes == true) {
                    new ret1, ret2, updateWrapper, retWrapper, updateWrapperBytes in {
                      for (@val, ret <- updateWrapper; _, retBytes <- updateWrapperBytes) {
                          update!(val, *retWrapper) |
                          for (@newVal <- retWrapper) {
                            ret!(newVal) |
                            retBytes!(newVal.toByteArray())
                          }
                      } |
                      TreeHashMapUpdater!((map, "bytes"), nybList, 0, depth, *updateWrapperBytes, hash.slice(depth, 32), *ret1) |
                      TreeHashMapUpdater!(map, nybList, 0, depth, *updateWrapper, hash.slice(depth, 32), *ret2) |
                      for (_ <- ret1; _ <- ret2) {
                        ret!(Nil)
                      }
                    }
                  } else {
                    TreeHashMapUpdater!(map, nybList, 0, depth, *update, hash.slice(depth, 32), *ret)
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

  // depth 1 = 12 maps in tree hash map
  // depth 2 = 12 * 12 = 144 maps in tree hash map
  // etc...

  // WITHDRAW, PURCHASE and CREATE_PURSE can touch the same boxes or
  // purses, we cannot allow concurrency because we want to avoid
  // race conditions

  @(*vault, "WITHDRAW_LOCK")!(Nil) |
  @(*vault, "PURCHASE_LOCK")!(Nil) |

  for (@boxId <= initLocksForBoxCh) {
    @(*vault, "RENEW_LOCK", boxId)!(Nil) |
    @(*vault, "UPDATE_PURSE_PRICE_LOCK", boxId)!(Nil) |
    @(*vault, "UPDATE_PURSE_DATA_LOCK", boxId)!(Nil) |
    @(*vault, "REGISTER_CONTRACT_LOCK", boxId)!(Nil)
  } |

  @(*vault, "CREATE_PURSE_LOCK")!(Nil) |
  for (@contractId <= initLocksForContractCh) {
    @(*vault, "LOCK_LOCK", contractId)!(Nil)
  } |

  TreeHashMap!("init", ${payload.depth || 3}, true, *boxesReadyCh) |
  TreeHashMap!("init", ${payload.depth || 3}, false, *contractsReadyCh) |

  for (@boxesThm <- boxesReadyCh; @contractsThm <- contractsReadyCh) {

    // returns the box if exists
    for (@(boxId, return) <= getBoxCh) {
      new ch1 in {
        TreeHashMap!("get", boxesThm, boxId, *ch1) |
        for (@exists <- ch1) {
          if (exists == "exists") {
            for (@box <<- @(*vault, "boxes", boxId)) {
              @return!(box)
            }
          } else {
            @return!(Nil)
          }
        }
      }
    } |

    // returns the purse if exists AND is associated with box
    for (@(box, contractId, purseId, return) <= getPurseCh) {
      new ch1 in {
        if (box.get(contractId) == Nil) {
          @return!(Nil)
        } else {
          if (box.get(contractId).contains(purseId) == true) {
            getContractPursesThmCh!((contractId, *ch1)) |
            for (@pursesThm <- ch1) {
              TreeHashMap!("get", pursesThm, purseId, return)
            }
          } else {
            @return!(Nil)
          }
        }
      }
    } |

    // returns the tree hash map of the contract's purses if exists
    for (@(contractId, return) <= getContractPursesThmCh) {
      new ch1 in {
        TreeHashMap!("get", contractsThm, contractId, *ch1) |
        for (@exists <- ch1) {
          if (exists == "exists") {
            for (@pursesThm <<- @(*vault, "purses", contractId)) {
              @return!(pursesThm)
            }
          } else {
            @return!(Nil)
          }
        }
      }
    } |

    // returns the tree hash map of the contract's purses data if exists
    for (@(contractId, return) <= getContractPursesDataThmCh) {
      new ch1 in {
        TreeHashMap!("get", contractsThm, contractId, *ch1) |
        for (@exists <- ch1) {
          if (exists == "exists") {
            for (@pursesDataThm <<- @(*vault, "pursesData", contractId)) {
              @return!(pursesDataThm)
            }
          } else {
            @return!(Nil)
          }
        }
      }
    } |
  
    // remove purse in box, if found
    for (@(boxId, contractId, purseId, return) <= removePurseInBoxCh) {
      new ch1 in {
        getBoxCh!((boxId, *ch1)) |
        for (@box <- ch1) {
          if (box == Nil) {
            @return!("error: CRITICAL box not found")
          } else {
            if (box.get(contractId) == Nil) {
              @return!("error: CRITICAL purse not found")
            } else {
              if (box.get(contractId).contains(purseId) == false) {
                @return!("error: CRITICAL purse not found")
              } else {
                for (_ <- @(*vault, "boxes", boxId)) {
                  stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purseId ++ " removed from box") |
                  @(*vault, "boxes", boxId)!(box.set(contractId, box.get(contractId).delete(purseId))) |
                  @return!((true, Nil))
                }
              }
            }
          }
        }
      }
    } |

    // save purse id in box
    for (@(contractId, boxId, purseId, merge, return) <= savePurseInBoxCh) {
      new ch1, ch2, ch3, iterateAndMergePursesCh in {

        getBoxCh!((boxId, *ch1)) |
        getContractPursesThmCh!((contractId, *ch2)) |

        for (@box <- ch1; @pursesThm <- ch2) {
          match (box != Nil, pursesThm != Nil) {
            (true, true) => {
              if (box.get(contractId) == Nil) {
                for (_ <- @(*vault, "boxes", boxId)) {
                  stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purseId ++ " saved to box") |
                  @(*vault, "boxes", boxId)!(box.set(contractId, Set(purseId))) |
                  @return!((true, Nil))
                }
              } else {
                if (box.get(contractId).contains(purseId) == false) {
                  for (@contractConfig <<- @(*vault, "contractConfig", contractId)) {
                    match (contractConfig.get("fungible") == true, merge) {
                      (true, true) => {
                        for (@pursesThm <<- @(*vault, "purses", contractId)) {
                          TreeHashMap!("get", pursesThm, purseId, *ch3) |
                          for (@purse <- ch3) {
                            iterateAndMergePursesCh!((box, purse, pursesThm))
                          }
                        }
                      }
                      _ => {
                        for (_ <- @(*vault, "boxes", boxId)) {
                          stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purseId ++ " saved to box") |
                          @(*vault, "boxes", boxId)!(box.set(
                            contractId,
                            box.get(contractId).union(Set(purseId))
                          )) |
                          @return!((true, Nil))
                        }
                      }
                    }
                  }
                } else {
                  @return!("error: CRITICAL, purse already exists in box")
                }
              }
            }
          }
        } |
        // if contract is fungible, we may find a
        // purse with same .price and .type property
        // if found, then merge and delete current purse
        for (@(box, purse, pursesThm) <- iterateAndMergePursesCh) {
          new tmpCh, itCh in {
            for (ids <= itCh) {
              match *ids {
                Set() => {
                  stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purse.get("id") ++ " saved to box") |
                  for (_ <- @(*vault, "boxes", boxId)) {
                     @(*vault, "boxes", boxId)!(box.set(contractId, Set(purseId))) |
                     @return!((true, Nil))
                  }
                }
                Set(last) => {
                  new ch4, ch5, ch6, ch7 in {
                    TreeHashMap!("get", pursesThm, last, *ch4) |
                    for (@purse2 <- ch4) {
                      match (purse2.get("type") == purse.get("type"), purse2.get("price") == purse.get("price")) {
                        (true, true) => {
                          TreeHashMap!(
                            "set",
                            pursesThm,
                            last,
                            purse2.set("quantity", purse2.get("quantity") + purse.get("quantity")),
                            *ch5
                          ) |
                          TreeHashMap!(
                            "set",
                            pursesThm,
                            purse.get("id"),
                            Nil,
                            *ch6
                          ) |
                          for (@pursesDataThm <<- @(*vault, "pursesData", contractId)) {
                            TreeHashMap!(
                              "set",
                              pursesDataThm,
                              purse.get("id"),
                              Nil,
                              *ch7
                            )
                          } |
                          for (_ <- ch5; _ <- ch6; _ <- ch7) {
                            stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purse.get("id") ++ " merged into purse " ++ purse2.get("id")) |
                            @return!((true, Nil))
                          }
                        }
                        _ => {
                          stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purse.get("id") ++ " saved to box") |
                          for (_ <- @(*vault, "boxes", boxId)) {
                            @(*vault, "boxes", boxId)!(box.set(
                              contractId,
                              box.get(contractId).union(Set(purse.get("id")))
                            )) |
                            @return!((true, Nil))
                          }
                        }
                      }
                    }

                  }
                }
                Set(first ... rest) => {
                  new ch4, ch5, ch6, ch7 in {
                    TreeHashMap!("get", pursesThm, first, *ch4) |
                    for (@purse2 <- ch4) {
                      match (purse2.get("type") == purse.get("type"), purse2.get("price") == purse.get("price")) {
                        (true, true) => {
                          TreeHashMap!(
                            "set",
                            pursesThm,
                            first,
                            purse2.set("quantity", purse2.get("quantity") + purse.get("quantity")),
                            *ch5
                          ) |
                          TreeHashMap!(
                            "set",
                            pursesThm,
                            purse.get("id"),
                            Nil,
                            *ch6
                          ) |
                          for (@pursesDataThm <<- @(*vault, "pursesData", contractId)) {
                            TreeHashMap!(
                              "set",
                              pursesDataThm,
                              purse.get("id"),
                              Nil,
                              *ch7
                            )
                          } |
                          for (_ <- ch5; _ <- ch6; _ <- ch7) {
                            stdout!(contractId ++ "/" ++ boxId ++ " purse " ++ purse.get("id") ++ " merged into purse " ++ purse2.get("id")) |
                            @return!((true, Nil))
                          }
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
            itCh!(box.get(contractId))
          }
        }
      }
    } |

    /*
      makePurseCh
      only place where new purses are created:
      PURCHASE, WITHDRAW, and CREATE_PURSE may call this channel

      depending on if .fungible is true or false, it decides
      which id to give to the new purse, then it creates the
      purse and saves to box
    */
    for (@(contractId, properties, data, merge, return) <= makePurseCh) {
      new ch1, ch2, ch3, ch4, idAndQuantityCh in {
        for (@contractConfig <<- @(*vault, "contractConfig", contractId)) {
          if (contractConfig.get("fungible") == true) {
            for (_ <- @(*vault, "contractConfig", contractId)) {
              @(*vault, "contractConfig", contractId)!(contractConfig.set("counter", contractConfig.get("counter") + 1))
            } |
            idAndQuantityCh!({ "id": "\${n}" %% { "n": contractConfig.get("counter") }, "quantity": properties.get("quantity") })
          } else {
            for (@pursesThm <<- @(*vault, "purses", contractId)) {
              TreeHashMap!("get", pursesThm, properties.get("id"), *ch1) |
              for (@existingPurse <- ch1) {

                // check that nft does not exist
                if (existingPurse == Nil) {
                  if (properties.get("id") == "0") {
                    idAndQuantityCh!({ "id": properties.get("id"), "quantity": properties.get("quantity") })
                  } else {
                    idAndQuantityCh!({ "id": properties.get("id"), "quantity": 1 })
                  }
                } else {

                  // nft with id: "0" is a special nft from which
                  // anyone can mint a nft that does not exist yet
                  // used by dappy name system for example
                  if (properties.get("id") == "0") {
                    TreeHashMap!("get", pursesThm, properties.get("newId"), *ch2) |
                    for (@purseWithNewId <- ch2) {
                      match (properties.get("newId"), purseWithNewId) {
                        (String, Nil) => {
                          idAndQuantityCh!({ "id": properties.get("newId"), "quantity": 1 })
                        }
                        _ => {
                          @return!("error: no .newId in payload or .newId already exists")
                        }
                      }
                    }
                  } else {
                    @return!("error: purse id already exists")
                  }
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
            purse => {
              match (purse, purse.get("id").length() > 0, purse.get("id").length() < 25) {
                ({
                  "quantity": Int,
                  "timestamp": Int,
                  "type": String,
                  "boxId": String,
                  "id": String,
                  "price": Nil \\/ Int
                }, true, true) => {
                  for (@pursesDataThm <<- @(*vault, "pursesData", contractId)) {
                    for (@pursesThm <<- @(*vault, "purses", contractId)) {
                      TreeHashMap!("set", pursesThm, purse.get("id"), purse, *ch3) |
                      TreeHashMap!("set", pursesDataThm, purse.get("id"), data, *ch4)
                    }
                  } |

                  for (_ <- ch3; _ <- ch4) {
                    savePurseInBoxCh!((contractId, purse.get("boxId"), purse.get("id"), merge, return))
                  }
                }
                _ => {
                  @return!("error: invalid purse, one of the following errors: id length must be between length 1 and 24")
                }
              }
            }
          }
        }
      }
    } |

    // ====================================
    // ===== ANY USER / PUBLIC capabilities
    // ====================================

    for (@("PUBLIC_READ_PURSES_AT_INDEX", contractId, i, return) <= entryCh) {
      new ch1 in {
        getContractPursesThmCh!((contractId, *ch1)) |
        for (@pursesThm <- ch1) {
          if (pursesThm == Nil) {
            @return!("error: contract not found")
          } else {
            TreeHashMap!("getValuesAtIndex", pursesThm, i, return)
          }
        }
      }
    } |

    for (@("PUBLIC_READ_CONFIG", contractId, return) <= entryCh) {
      for (@config <<- @(*vault, "contractConfig", contractId)) {
        @return!(config)
      }
    } |

    for (@("PUBLIC_READ_BOX", boxId, return) <= entryCh) {
      new ch1 in {
        getBoxCh!((boxId, *ch1)) |
        for (@box <- ch1) {
          if (box == Nil) {
            @return!("error: box not found")
          } else {
            for (@superKeys <<- @(*vault, "boxesSuperKeys", boxId)) {
              for (@config <<- @(*vault, "boxConfig", boxId)) {
                @return!(config.union({ "superKeys": superKeys, "purses": box, "version": "9.0.0" }))
              }
            }
          }
        }
      }
    } |

    for (@("PUBLIC_READ_PURSE", payload, return) <= entryCh) {
      new ch1 in {
        getContractPursesThmCh!((payload.get("contractId"), *ch1)) |
        for (@pursesThm <- ch1) {
          if (pursesThm == Nil) {
            @return!("error: contract not found")
          } else {
            match payload.get("purseId") {
              String => {
                TreeHashMap!("get", pursesThm, payload.get("purseId"), return)
              }
              _ => {
                @return!("error: payload.purseId must be a string")
              }
            }
          }
        }
      }
    } |

    for (@("PUBLIC_READ_PURSE_DATA", payload, return) <= entryCh) {
      new ch1 in {
        getContractPursesDataThmCh!((payload.get("contractId"), *ch1)) |
        for (@pursesDataThm <- ch1) {
          if (pursesDataThm == Nil) {
            @return!("error: contract not found")
          } else {
            match payload.get("purseId") {
              String => {
                TreeHashMap!("get", pursesDataThm, payload.get("purseId"), return)
              }
              _ => {
                @return!("error: payload.purseId must be a string")
              }
            }
          }
        }
      }
    } |

    for (@("PUBLIC_DELETE_EXPIRED_PURSE", contractId, purseId, return) <= entryCh) {
      for (@config <<- @(*vault, "contractConfig", contractId)) {
        match (config.get("fungible"), purseId == "0", config.get("expires")) {
          (false, false, Int) => {
            new ch1, ch2, ch3, ch4, ch5, ch6, ch7 in {
              getContractPursesThmCh!((contractId, *ch1)) |
              getContractPursesDataThmCh!((contractId, *ch2)) |
              for (@pursesThm <- ch1; @pursesDataThm <- ch2) {
                if (pursesThm == Nil) {
                  @return!("error: contract not found")
                } else {
                  TreeHashMap!("get", pursesThm, purseId, *ch3) |
                  for (@purse <- ch3) {
                    if (purse == Nil) {
                      @return!("error: purse not found")
                    } else {
                      blockData!(*ch4) |
                      for (_, @timestamp, _ <- ch4) {
                        if (timestamp - purse.get("timestamp") > config.get("expires")) {
                          TreeHashMap!("set", pursesThm, purse.get("id"), Nil, *ch5) |
                          TreeHashMap!("set", pursesDataThm, purse.get("id"), Nil, *ch6) |
                          removePurseInBoxCh!((purse.get("boxId"), contractId, purse.get("id"), *ch7)) |
                          for (_ <- ch5; _ <- ch6; _ <- ch7) {
                            @return!((true, Nil))
                          }
                        } else {
                          @return!("error: purse has not expired")
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          _ => {
            @return!("error: contract must not be fungible, and must have .expires property")
          }
        }
      }
    } |

    for (@("PUBLIC_REGISTER_BOX", payload, return) <= entryCh) {
      match (payload.get("boxId"), payload.get("publicKey"), payload.get("boxId").length() > 1, payload.get("boxId").length() < 25) {
        (String, String, true, true) => {
          new ch1, ch2, ch3, ch4, ch5, ch6 in {
            registryLookup!(\`rho:rchain:revVault\`, *ch3) |
            for (@(_, RevVault) <- ch3) {
              revAddress!("fromPublicKey", payload.get("publicKey").hexToBytes(), *ch4) |
              for (@a <- ch4) {
                @RevVault!("findOrCreate", a, *ch5) |
                for (@b <- ch5) {
                  match b {
                    (true, vaultFromPublicKey) => {
                      ch6!(true)
                    }
                    _ => {
                      @return!("error: invalid public key, could not get vault")
                    }
                  }
                }
              }
            } |

            TreeHashMap!("get", boxesThm, payload.get("boxId"), *ch1) |
            for (@existingBox <- ch1; _ <- ch6) {
              if (existingBox == Nil) {
                new boxCh in {
                  TreeHashMap!("set", boxesThm, payload.get("boxId"), "exists", *ch2) |
                  for (_ <- ch2) {
                    @(*vault, "boxes", payload.get("boxId"))!({}) |
                    @(*vault, "boxesSuperKeys", payload.get("boxId"))!(Set()) |
                    @(*vault, "boxConfig", payload.get("boxId"))!({ "publicKey": payload.get("publicKey") }) |
                    @return!((true, bundle+{*boxCh})) |
                    initLocksForBoxCh!(payload.get("boxId")) |
                    initializeOCAPOnBoxCh!((*boxCh, payload.get("boxId")))
                  }
                }
              } else {
                @return!("error: box already exists")
              }
            }
          }
        }
      }
    } |

    for (@(boxCh, boxId) <= initializeOCAPOnBoxCh) {

      for (@("REGISTER_CONTRACT", payload, return) <= @boxCh) {
        for (_ <- @(*vault, "REGISTER_CONTRACT_LOCK", boxId)) {
          new registerContract, ch1, ch2, ch3, ch4, ch5, unlock in {
            for (@result <- unlock) {
              @(*vault, "REGISTER_CONTRACT_LOCK", boxId)!(Nil) |
              @return!(result)
            } |
            match payload {
              { "contractId": String, "fungible": Bool, "fee": Nil \\/ (String, Int), "expires": Nil \\/ Int } => {
                match (payload.get("contractId").length() > 1, payload.get("contractId").length() < 25) {
                  (true, true) => {
                    if (payload.get("expires") == Nil) {
                      registerContract!(Nil)
                    } else {
                      // minimum 2 hours expiration
                      if (payload.get("expires") >= 1000 * 60 * 60 * 2) {
                        registerContract!(Nil)
                      } else {
                        unlock!("error: .expires must be at least 2 hours")
                      }
                    }
                  }
                  _ => {
                    unlock!("error: invalid contract id")
                  }
                }
              }
              _ => {
                unlock!("error: invalid payload")
              }
            } |
            for (_ <- registerContract) {
              TreeHashMap!("get", contractsThm, payload.get("contractId"), *ch1) |
              for (@exists <- ch1) {
                if (exists == Nil) {
                  TreeHashMap!("init", ${payload.contractDepth || 2}, true, *ch2) |
                  TreeHashMap!("init", ${payload.contractDepth || 2}, true, *ch4) |
                  TreeHashMap!("set", contractsThm, payload.get("contractId"), "exists", *ch3) |
                  for (@pursesThm <- ch2; @pursesDataThm <- ch4; _ <- ch3) {

                    for (@superKeys <- @(*vault, "boxesSuperKeys", boxId)) {
                      @(*vault, "boxesSuperKeys", boxId)!(
                        superKeys.union(Set(payload.get("contractId")))
                      )
                    } |

                    // purses tree hash map
                    @(*vault, "purses", payload.get("contractId"))!(pursesThm) |

                    // purses data tree hash map
                    @(*vault, "pursesData", payload.get("contractId"))!(pursesDataThm) |

                    // config
                    @(*vault, "contractConfig", payload.get("contractId"))!(
                      payload.set("locked", false).set("counter", 1).set("version", "9.0.0").set("fee", payload.get("fee"))
                    ) |

                    new superKeyCh in {
                      // return the bundle+ super key
                      unlock!((true, bundle+{*superKeyCh})) |
                      initLocksForContractCh!(payload.get("contractId")) |

                      for (@("LOCK", return2) <= superKeyCh) {
                        for (_ <- @(*vault, "LOCK_LOCK", payload.get("contractId"))) {
                          for (@contractConfig <<- @(*vault, "contractConfig", payload.get("contractId"))) {
                            if (contractConfig.get("locked") == true) {
                              @return2!("error: contract is already locked") |
                              @(*vault, "LOCK_LOCK", payload.get("contractId"))!(Nil)
                            } else {
                              for (_ <- @(*vault, "contractConfig", payload.get("contractId"))) {
                                @(*vault, "contractConfig", payload.get("contractId"))!(contractConfig.set("locked", true)) |
                                @return2!((true, Nil)) |
                                @(*vault, "LOCK_LOCK", payload.get("contractId"))!(Nil)
                              }
                            }
                          }
                        }
                      } |

                      for (@("CREATE_PURSE", createPursePayload, return2) <= superKeyCh) {
                        for (_ <- @(*vault, "CREATE_PURSE_LOCK")) {
                          for (@contractConfig <<- @(*vault, "contractConfig", payload.get("contractId"))) {
                            if (contractConfig.get("locked") == true) {
                              @return2!("error: contract is locked") |
                              @(*vault, "CREATE_PURSE_LOCK")!(Nil)
                            } else {
                              new blockDataCh, ch1, ch2 in {
                                blockData!(*blockDataCh) |
                                for (_, @timestamp, _ <- blockDataCh) {
                                  match (createPursePayload, createPursePayload.get("price") == 0) {
                                    ({
                                      "data": _,
                                      "quantity": Int,
                                      "type": String,
                                      "id": String,
                                      "price": Nil \\/ Int,
                                      "boxId": String
                                    }, false) => {
                                      getBoxCh!((createPursePayload.get("boxId"), *ch1)) |
                                      for (@box <- ch1) {
                                        if (box == Nil) {
                                          @return2!("error: box not found " ++ createPursePayload.get("boxId")) |
                                          @(*vault, "CREATE_PURSE_LOCK")!(Nil)
                                        } else {
                                          makePurseCh!((
                                            payload.get("contractId"),
                                            createPursePayload.delete("data").set("timestamp", timestamp),
                                            createPursePayload.get("data"),
                                            true,
                                            *ch2
                                          )) |
                                          for (@r <- ch2) {
                                            @(*vault, "CREATE_PURSE_LOCK")!(Nil) |
                                            match r {
                                              String => {
                                                @return2!(r)
                                              }
                                              _ => {
                                                @return2!(true)
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                    _ => {
                                      @return2!("error: invalid purse payload") |
                                      @(*vault, "CREATE_PURSE_LOCK")!(Nil)
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
                } else {
                  unlock!("error: contract id already exists")
                }
              }
            }
          }
        }
      } |

      for (@("UPDATE_PURSE_PRICE", payload, return) <= @boxCh) {
        for (_ <- @(*vault, "UPDATE_PURSE_PRICE_LOCK", boxId)) {
          new ch3, ch4, ch5, unlock in {
            for (@result <- unlock) {
              @(*vault, "UPDATE_PURSE_PRICE_LOCK", boxId)!(Nil) |
              @return!(result)
            } |
            match (payload, payload.get("price") == 0) {
              ({ "price": Int \\/ Nil, "contractId": String, "purseId": String }, false) => {
                getBoxCh!((boxId, *ch3)) |
                for (@box <- ch3) {
                  if (box != Nil) {
                    getPurseCh!((box, payload.get("contractId"), payload.get("purseId"), *ch4)) |
                    for (@purse <- ch4) {
                      if (purse != Nil) {
                        for (@pursesThm <<- @(*vault, "purses", payload.get("contractId"))) {
                          TreeHashMap!("set", pursesThm, payload.get("purseId"), purse.set("price", payload.get("price")), *ch5) |
                          for (_ <- ch5) {
                            unlock!((true, Nil))
                          }
                        }
                      } else {
                        unlock!("error: purse not found")
                      }
                    }
                  } else {
                    unlock!("error: CRITICAL box not found")
                  }
                }
              }
              _ => {
                unlock!("error: invalid payload for update price")
              }
            }
          }
        }
      } |

      for (@("UPDATE_PURSE_DATA", payload, return) <= @boxCh) {
        for (_ <- @(*vault, "UPDATE_PURSE_DATA_LOCK", boxId)) {
          new ch3, ch4, ch5, unlock in {
            for (@result <- unlock) {
              @(*vault, "UPDATE_PURSE_DATA_LOCK", boxId)!(Nil) |
              @return!(result)
            } |
            match payload {
              { "data": _, "contractId": String, "purseId": String } => {
                getBoxCh!((boxId, *ch3)) |
                for (@box <- ch3) {
                  if (box != Nil) {
                    getPurseCh!((box, payload.get("contractId"), payload.get("purseId"), *ch4)) |
                    for (@purse <- ch4) {
                      if (box != Nil) {
                        for (@pursesDataThm <<- @(*vault, "pursesData", payload.get("contractId"))) {
                          TreeHashMap!("set", pursesDataThm, payload.get("purseId"), payload.get("data"), *ch5) |
                          for (_ <- ch5) {
                            unlock!((true, Nil))
                          }
                        }
                      } else {
                        unlock!("error: purse not found")
                      }
                    }
                  } else {
                    unlock!("error: CRITICAL box not found")
                  }
                }
              }
              _ => {
                unlock!("error: invalid payload for update data")
              }
            }
          }
        }
      } |

      for (@("RENEW", payload, return) <= @boxCh) {
        for (_ <- @(*vault, "RENEW_LOCK", boxId)) {
          new ch1, ch2, ch3, ch4, renewStep2, ch20, renewStep3, ch30, ch31, ch32, ch33, ch34, ch35, ch36, unlock in {
            for (@result <- unlock) {
              @(*vault, "RENEW_LOCK", boxId)!(Nil) |
              @return!(result)
            } |
            match payload {
              { "contractId": String, "purseId": String, "purseRevAddr": String, "purseAuthKey": _ } => {
                getBoxCh!((boxId, *ch1)) |
                for (@box <- ch1) {
                  if (box != Nil) {
                    getContractPursesThmCh!((payload.get("contractId"), *ch2)) |
                    getPurseCh!((box, payload.get("contractId"), payload.get("purseId"), *ch3)) |

                    for (@pursesThm <- ch2) {
                      if (pursesThm == Nil) {
                        unlock!("error: CRITICAL tree hash map not found")
                      } else {
                        TreeHashMap!("get", pursesThm, "0", *ch4)
                      } |
                      for (@purse <- ch3; @purseZero <- ch4) {
                        for (@contractConfig <<- @(*vault, "contractConfig", payload.get("contractId"))) {
                          match (contractConfig.get("expires"), contractConfig.get("fungible") == false, purse != Nil, purseZero != Nil) {
                            (Int, true, true, true) => {
                              renewStep2!((pursesThm, purseZero, purse, contractConfig.get("expires")))
                            }
                            _ => {
                              unlock!("error: purse 0 not found or contract is fungible=true")
                            }
                          }
                        }
                      }
                    }
                  } else {
                    unlock!("error: CRITICAL box not found")
                  }
                }
              }
              _ => {
                unlock!("error: invalid payload for renew")
              }
            } |

            for (@(pursesThm, purseZero, purse, expires) <- renewStep2) {
              blockData!(*ch20) |
              for (_, @timestamp, _ <- ch20) {
                match expires / 10 {
                  grace => {
                    match purse.get("timestamp") + expires - grace {
                      startOfGracePeriod => {
                        if (timestamp > startOfGracePeriod) {
                          renewStep3!((pursesThm, purseZero, purse, expires))
                        } else {
                          unlock!("error: to soon to renew")
                        }
                      }
                      _ => {
                        unlock!("error: cannot calculate grace period")
                      }
                    }
                  }
                  _ => {
                    unlock!("error: cannot calculate grace period")
                  }
                }
              }
            } |

            for (@(pursesThm, purseZero, purse, expires) <- renewStep3) {
              for (@boxConfig <<- @(*vault, "boxConfig", purseZero.get("boxId"))) {
                registryLookup!(\`rho:rchain:revVault\`, *ch33) |
                for (@(_, RevVault) <- ch33) {
                  @RevVault!("findOrCreate", payload.get("purseRevAddr"), *ch34) |
                  revAddress!("fromPublicKey", boxConfig.get("publicKey").hexToBytes(), *ch32)
                }
              } |

              for (@revAddr <- ch32; @r <- ch34) {
                match r {
                  (true, purseVaultEmitter) => {
                    if (purseZero.get("price") == Nil) {
                      @purseVaultEmitter!("transfer", revAddr, 1, payload.get("purseAuthKey"), *ch35)
                    } else if (purseZero.get("price") == 0) {
                      @purseVaultEmitter!("transfer", revAddr, 1, payload.get("purseAuthKey"), *ch35)
                    } else {
                      @purseVaultEmitter!("transfer", revAddr, purseZero.get("price"), payload.get("purseAuthKey"), *ch35)
                    }
                  }
                  _ => {
                    unlock!("error: could not find vaule from rev address")
                  }
                }
              } |

              for (@paymentResult <- ch35) {
                match paymentResult {
                  (true, Nil) => {
                    TreeHashMap!("set", pursesThm, purse.get("id"), purse.set("timestamp", purse.get("timestamp") + expires), *ch36) |
                    for (_ <- ch36) {
                      unlock!((true, Nil))
                    }
                  }
                  _ => {
                    unlock!("error: failed to execute payment")
                  }
                }
              }
            }
          }
        }
      } |

      for (@("WITHDRAW", payload, return) <= @boxCh) {
        // todo can we have a lock that is only
        // scoped to fromBox and toBox ?
        for (_ <- @(*vault, "WITHDRAW_LOCK")) {
          new ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, proceedWithdrawCh, mergeCh, mergeOkCh, unlock in {
            for (@result <- unlock) {
              @(*vault, "WITHDRAW_LOCK")!(Nil) |
              @return!(result)
            } |
            match payload {
              { "quantity": Int, "contractId": String, "purseId": String, "toBoxId": String, "merge": Bool } => {
                getContractPursesThmCh!((payload.get("contractId"), *ch4)) |
                getBoxCh!((payload.get("toBoxId"), *ch6)) |
                getBoxCh!((boxId, *ch10)) |
                for (@pursesThm <- ch4; @toBox <- ch6; @box <- ch10) {
                  match (pursesThm != Nil, toBox != Nil, box != Nil) {
                    (true, true, true) => {
                      getPurseCh!((box, payload.get("contractId"), payload.get("purseId"), *ch9)) |
                      for (@purse <- ch9) {
                        if (purse == Nil) {
                          unlock!("error: purse does not exist")
                        } else {
                          if (purse.get("id") != "0") {
                            proceedWithdrawCh!((pursesThm, purse))
                          } else {
                            unlock!("error: withdraw from special nft 0 is forbidden")
                          }
                        }
                      }
                    }
                    _ => {
                      unlock!("error: contract or recipient box does not exist")
                    }
                  }
                }
              }
              _ => {
                unlock!("error: invalid payload for withdraw")
              }
            } |

            for (@(pursesThm, purse) <- proceedWithdrawCh) {

              // the withdrawer should not be able to choose if
              // tokens in recipient box will or will not be 
              // merged, except if he withdraws to himself
              mergeCh!(payload.get("merge")) |
              if (payload.get("toBoxId") != boxId) {
                for (_ <- mergeCh) {
                  mergeOkCh!(true)
                }
              } else {
                for (@m <- mergeCh) {
                  mergeOkCh!(m)
                }
              } |

              for (@merge <- mergeOkCh) {
                match (
                  purse.get("quantity") - payload.get("quantity") >= 0,
                  purse.get("quantity") > 0,
                  purse.get("quantity") - payload.get("quantity") > 0
                ) {

                  // ajust quantity in first purse, create a second purse
                  // associated with toBoxId
                  (true, true, true) => {
                    TreeHashMap!("set", pursesThm, payload.get("purseId"), purse.set("quantity", purse.get("quantity") - payload.get("quantity")), *ch5) |
                    for (_ <- ch5) {
                      makePurseCh!((
                        payload.get("contractId"),
                        purse
                          .set("price", Nil)
                          .set("quantity", payload.get("quantity"))
                          .set("boxId", payload.get("toBoxId")),
                        Nil,
                        merge,
                        *unlock
                      ))
                    }
                  }

                  // remove first purse, create a second purse
                  // associated with toBoxId
                  (true, true, false) => {
                    TreeHashMap!("set", pursesThm, payload.get("purseId"), Nil, *ch5) |
                    for (@pursesDataThm <<- @(*vault, "pursesData", payload.get("contractId"))) {
                      TreeHashMap!(
                        "get",
                        pursesDataThm,
                        payload.get("purseId"),
                        *ch7
                      ) |
                      for (_ <- ch5; @data <- ch7) {
                        TreeHashMap!(
                          "set",
                          pursesDataThm,
                          payload.get("purseId"),
                          Nil,
                          *ch11
                        ) |
                        for (_ <- ch11) {
                          removePurseInBoxCh!((boxId, payload.get("contractId"), payload.get("purseId"), *ch8)) |
                          for (@r <- ch8) {
                            match r {
                              String => {
                                unlock!(r)
                              }
                              _ => {
                                makePurseCh!((
                                  payload.get("contractId"),
                                  purse
                                    .set("price", Nil)
                                    .set("boxId", payload.get("toBoxId")),
                                  data,
                                  merge,
                                  *unlock
                                ))
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  _ => {
                    unlock!("error: cannot withdraw, quantity in payload is superior to existing purse quantity")
                  }
                }
              }
            }
          }
        }
      } |

      // keep review from here

      for (@(amount, contractConfig, return2) <= calculateFeeCh) {
        if (contractConfig.get("fee") == Nil) {
          @return2!((amount, 0, Nil))
        } else {
          match amount * contractConfig.get("fee").nth(1) / 100000 {
            feeAmount => {
              new ch1 in {
                revAddress!("fromPublicKey", contractConfig.get("fee").nth(0).hexToBytes(), *ch1) |
                for (@revAddr <- ch1) {
                  @return2!((amount - feeAmount, feeAmount, revAddr))
                }
              }
            }
          }
        }
      } |

      // transfers an amount to a temporary escrow purse
      for (@(emitterRevAddress, emitterPurseAuthKey, amount, return) <= transferToEscrowPurseCh) {
        new ch1, ch2, ch3, ch4, ch5, ch6 in {
          registryLookup!(\`rho:rchain:revVault\`, *ch1) |
          for (@(_, RevVault) <- ch1) {
            @RevVault!("findOrCreate", emitterRevAddress, *ch2) |
            for (@a <- ch2) {
              match a {
                (true, purseVaultEmitter) => {
                  new unf in {
                    @RevVault!("unforgeableAuthKey", *unf, *ch3) |
                    revAddress!("fromUnforgeable", *unf, *ch4) |
                    for (@escrowPurseAuthKey <- ch3; @escrowPurseRevAddr <- ch4) {
                      @RevVault!("findOrCreate", escrowPurseRevAddr, *ch5) |
                      for (@(true, escrowPurseVault) <- ch5) {
                        @purseVaultEmitter!("transfer", escrowPurseRevAddr, amount, emitterPurseAuthKey, *ch6) |
                        for (@escrowTransferResult <- ch6) {
                          match escrowTransferResult {
                            (true, Nil) => {
                              @return!((escrowPurseAuthKey, escrowPurseRevAddr))
                            }
                            _ => {
                              stdout!(escrowTransferResult) |
                              @return!("error: escrow transfer went wrong, invalid rev purse")
                            }
                          }
                        }
                      }
                    }
                  }
                }
                _ => {
                  @return!("error: cannot create purse vault")
                }
              }
            }
          }
        }
      } |

      for (@("PURCHASE", payload, return) <= @boxCh) {
        for (_ <- @(*vault, "PURCHASE_LOCK")) {
          match payload {
            { "quantity": Int, "contractId": String, "merge": Bool, "purseId": String, "newId": Nil \\/ String, "data": _, "purseRevAddr": String, "purseAuthKey": _ } => {
              new ch3, ch4, ch5, ch6, ch7, step2Ch, ch20, ch21, ch22, ch23, ch24, step3Ch, rollbackCh, ch30, ch31, ch32, ch33, ch34, ch35, ch36, ch37, step4Ch, ch40, ch41, ch42, ch43, ch44, ch45, step5Ch, ch50, ch51, ch52, ch53, unlock in {

                for (@result <- unlock) {
                  @return!(result) |
                  @(*vault, "PURCHASE_LOCK")!(Nil)
                } |

                // STEP 1
                // check box, purse
                getBoxCh!((boxId, *ch3)) |
                for (@box <- ch3) {
                  if (box != Nil) {
                    getContractPursesThmCh!((payload.get("contractId"), *ch4)) |
                    getContractPursesDataThmCh!((payload.get("contractId"), *ch5)) |
                    for (@pursesThm <- ch4; @pursesDataThm <- ch5) {
                      if (pursesThm != Nil) {
                        TreeHashMap!("get", pursesThm, payload.get("purseId"), *ch6) |
                        TreeHashMap!("get", pursesDataThm, payload.get("purseId"), *ch7)
                      } else {
                        unlock!("error: contract not found")
                      } |
                      for (@purse <- ch6; @purseData <- ch7) {
                        if (purse != Nil) {
                          step2Ch!((pursesThm, pursesDataThm, purse, purseData))
                        } else {
                          unlock!("error: purse not found")
                        }
                      }
                    }
                  } else {
                    unlock!("error: CRITICAL box not found")
                  }
                } |

                // STEP 2
                // transfer total amount to temporary escrow purse
                // check that both emitter and recipient vault exist
                for (@(pursesThm, pursesDataThm, purse, purseData) <- step2Ch) {
                  match (
                    purse.get("price"),
                    purse.get("quantity") > 0,
                    payload.get("quantity") > 0,
                    purse.get("quantity") >= payload.get("quantity")
                  ) {
                    (Int, true, true, true) => {
                      registryLookup!(\`rho:rchain:revVault\`, *ch20) |

                      for (@boxConfig <<- @(*vault, "boxConfig", purse.get("boxId"))) {
                        revAddress!("fromPublicKey", boxConfig.get("publicKey").hexToBytes(), *ch21)
                      } |

                      for (@contractConfig <<- @(*vault, "contractConfig", payload.get("contractId"))) {
                        calculateFeeCh!((payload.get("quantity") * purse.get("price"), contractConfig, *ch22))
                      } |

                      for (@(_, RevVault) <- ch20; @ownerRevAddress <- ch21; @amountAndFeeAmount <- ch22) {
                        match (
                          payload.get("purseRevAddr"),
                          ownerRevAddress,
                          amountAndFeeAmount.nth(0),
                          amountAndFeeAmount.nth(1),
                          amountAndFeeAmount.nth(2)
                        ) {
                          (emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress) => {
                            @RevVault!("findOrCreate", recipientRevAddress, *ch23) |
                            for (@a <- ch23) {
                              match a {
                                (true, purseVaultRecipient) => {
                                  transferToEscrowPurseCh!((emitterRevAddress, payload.get("purseAuthKey"), amount + feeAmount, *ch24)) |
                                  for (@b <- ch24) {
                                    match b {
                                      String => {
                                        unlock!(b)
                                      }
                                      (escrowPurseAuthKey, escrowPurseRevAddr) => {
                                        step3Ch!((pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress))
                                      }
                                    }
                                  }
                                }
                                _ => {
                                  unlock!("error: could not find or create vaults")
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    _ => {
                      unlock!("error: quantity not available or purse not for sale")
                    }
                  }
                } |

                // STEP 3
                // listen on rollbackCh and prepare to reset state to original
                // if step 4 or 5 fails
                // 
                for (@(pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress) <- step3Ch) {
                  for (@message <- rollbackCh) {
                    TreeHashMap!("set", pursesThm, purse.get("id"), purse, *ch30) |
                    TreeHashMap!("set", pursesDataThm, purse.get("id"), purseData, *ch31) |
                    if (purse.get("quantity") - payload.get("quantity") == 0) {
                      savePurseInBoxCh!((payload.get("contractId"), purse.get("boxId"), purse.get("id"), true, *ch32))
                    } else {
                      // the purse has not been removed from box
                      ch32!((true, Nil))
                    } |
                    for (_ <- ch30; _ <- ch31; @a <- ch32) {
                      match a {
                        String => {
                          stdout!("error: CRITICAL could not rollback after makePurse error") |
                          unlock!("error: CRITICAL could not rollback after makePurse error")
                        }
                        _ => {
                          @RevVault!("findOrCreate", escrowPurseRevAddr, *ch33) |
                          for (@(true, purseVaultEscrow) <- ch33) {
                            @purseVaultEscrow!("transfer", emitterRevAddress, amount + feeAmount, escrowPurseAuthKey, *ch34) |
                            for (@r <- ch34) {
                              match r {
                                (true, Nil) => {
                                  unlock!("error: rollback successful, makePurse error, transaction was rolled backed, emitter purse was reimbursed " ++ message)
                                }
                                _ => {
                                  stdout!(r) |
                                  stdout!("error: CRITICAL, makePurse error, could rollback but could not reimburse after makePurse error" ++ message) |
                                  unlock!("error: CRITICAL, makePurse error, could rollback but could not reimburse after makePurse error" ++ message)
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  } |
                  step4Ch!((pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress))
                } |

                // STEP 4
                // try to makePurse
                for (@(pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress) <- step4Ch) {
                  for (@makePurseResult <- ch43) {
                    match makePurseResult {
                      String => {
                        rollbackCh!(makePurseResult)
                      }
                      _ => {
                        step5Ch!((pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress))
                      }
                    }
                  } |

                  // remove completely purse and create a new one
                  // with same id, id may be changed by makePurse
                  // depending on fungible or not
                  if (purse.get("quantity") - payload.get("quantity") == 0) {
                    TreeHashMap!("set", pursesThm, purse.get("id"), Nil, *ch40) |
                    TreeHashMap!("set", pursesDataThm, purse.get("id"), Nil, *ch41) |
                    removePurseInBoxCh!((purse.get("boxId"), payload.get("contractId"), purse.get("id"), *ch42)) |
                    for (_ <- ch40; _ <- ch41; _ <- ch42) {
                      makePurseCh!((
                        payload.get("contractId"),
                        // keep quantity and type of existing purse
                        purse
                          .set("boxId", boxId)
                          .set("price", Nil)
                          // will only be considered for nft, purchase from purse "0"
                          .set("newId", payload.get("newId")),
                        payload.get("data"),
                        payload.get("merge"),
                        *ch43
                      ))
                    }
                  } else {
                    // just update quantity of current purse, and
                    //  create another one with right quantity
                    TreeHashMap!("set", pursesThm, purse.get("id"), purse.set("quantity", purse.get("quantity") - payload.get("quantity")), *ch40) |

                    // purchase NFT from "0", new timestamp
                    if (purse.get("id") == "0") {
                      blockData!(*ch44) |
                      for (_, @timestamp, _ <- ch44) {
                        ch45!(timestamp)
                      }
                    // purchase ft or NFT not "0"
                    // duplicate timestamp
                    } else {
                      ch45!(purse.get("timestamp"))
                    } |

                    for (@timestamp <- ch45) {
                      for (_ <- ch40) {
                        makePurseCh!((
                          payload.get("contractId"),
                          purse
                            .set("boxId", boxId)
                            .set("quantity", payload.get("quantity"))
                            .set("price", Nil)
                            .set("timestamp", timestamp)
                            // will only be considered for nft, purchase from purse "0"
                            .set("newId", payload.get("newId")),
                          payload.get("data"),
                          payload.get("merge"),
                          *ch43
                        ))
                      }
                    }
                  }
                } |

                // STEP 5
                // everything went ok, do final payment
                for (@(pursesThm, pursesDataThm, purse, purseData, RevVault, escrowPurseRevAddr, escrowPurseAuthKey, emitterRevAddress, recipientRevAddress, amount, feeAmount, feeRevAddress) <- step5Ch) {
                  @RevVault!("findOrCreate", escrowPurseRevAddr, *ch50) |
                  for (@(true, purseVaultEscrow) <- ch50) {
                    @purseVaultEscrow!("transfer", recipientRevAddress, amount, escrowPurseAuthKey, *ch51) |
                    for (@r <- ch51) {
                      match r {
                        (true, Nil) => {
                          if (feeAmount != 0) {
                            @purseVaultEscrow!("transfer", feeRevAddress, feeAmount, escrowPurseAuthKey, *ch53) |
                            for (@transferFeeReturn <- ch53) {
                              match transferFeeReturn {
                                (true, Nil) => {
                                  stdout!("fee transfer successful")
                                }
                                _ => {
                                  stdout!("error: CRITICAL could not transfer fee")
                                }
                              }
                            }
                          } |
                          unlock!((true, Nil))
                        }
                        _ => {
                          stdout!("error: CRITICAL, makePurse went fine, but could not do final transfer") |
                          rollbackCh!("error: CRITICAL, makePurse went fine, but could not do final transfer")
                        }
                      }
                    }
                  }
                }
              }
            }
            _ => {
              @return!("error: invalid payload") |
              @(*vault, "PURCHASE_LOCK", boxId)!(Nil)
            }
          }
        }
      }
    } |

    insertArbitrary!(bundle+{*entryCh}, *entryUriCh) |

    for (entryUri <- entryUriCh) {
      basket!({
        "status": "completed",
        "registryUri": *entryUri
      }) |
      stdout!(("rchain-token master registered at", *entryUri))
    }
  }
}
`;
  };

  var masterTerm = {
  	masterTerm: masterTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var deployTerm_1 = (payload) => {
      return `new basket,
  masterEntryCh,
  registerContractReturnCh,
  sendReturnCh,
  deletePurseReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *masterEntryCh) |

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("REGISTER_CONTRACT", { "contractId": "${payload.contractId}", "fungible": ${payload.fungible}, "fee": ${payload.fee ? `("${payload.fee[0]}", ${payload.fee[1]})` : "Nil"}, "expires": ${payload.expires ? payload.expires : "Nil"} }, *registerContractReturnCh)) |
    for (@r <- registerContractReturnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, superKey) => {
          @(*deployerId, "rchain-token-contract", "${payload.masterRegistryUri}", "${payload.contractId}")!(superKey) |
          basket!({
            "status": "completed",
            "masterRegistryUri": "${payload.masterRegistryUri}",
            "contractId": "${payload.contractId}",
          }) |
          stdout!("completed, contract registered")
        }
      }
    }
  }
}
`;
  };

  var deployTerm = {
  	deployTerm: deployTerm_1
  };

  var createPursesTerm_1 = (payload) => {
    const ids = Object.keys(payload.purses);
    ids.forEach((id) => {
      payload.purses[id].data = payload.data[id] || null;
    });

    let rholang = `new ${ids.map((id, i) => 'channel' + i)} in {`;
    ids.forEach((id, i) => {
      rholang +=
        '\n' +
        `superKey!(("CREATE_PURSE", ${JSON.stringify(payload.purses[id]).replace(
        new RegExp(': null|:null', 'g'),
        ': Nil'
      )}, *channel${i})) |`;
    });
    rholang += '\n';
    rholang += `for (${ids
    .map((p, i) => '@value' + i + ' <- channel' + i)
    .join('; ')}) {\n`;
    rholang += `  stdout!("purses created, check results to see successes/failures") |
  return!({ "status": "completed", "results": {}${ids
    .map((p, i) => `.union({ "${p}": value${i} })`)
    .join('')}})\n`;
    rholang += `}\n}`;

    return `new return, entryCh, readCh, stdout(\`rho:io:stdout\`), deployerId(\`rho:rchain:deployerId\`), lookup(\`rho:registry:lookup\`) in {
    for (superKey <<- @(*deployerId, "rchain-token-contract", "${payload.masterRegistryUri}", "${payload.contractId}")) {
      ${rholang}
    }
  }`;
    /* 
    const ids = Object.keys(payload.purses);
    ids.forEach((id) => {
      payload.purses[id].data = payload.data[id] || null;
    });

    return `new basket,
    returnCh,
    boxCh,
    itCh,
    idsCh,
    resultsCh,
    stdout(\`rho:io:stdout\`),
    deployerId(\`rho:rchain:deployerId\`),
    registryLookup(\`rho:registry:lookup\`)
  in {

    for (superKey <<- @(*deployerId, "rchain-token-contract", "${
      payload.masterRegistryUri
    }", "${payload.contractId}")) {

      for (@ids <- idsCh) {
        for (@i <= itCh) {
          match i {
            ${ids.length} => {
              for (@results <- resultsCh) {
                stdout!("completed, purses created, check results to see errors/successes") |
                basket!({ "status": "completed", "results": results})
              }
            }
            _ => {
              new x in {
                superKey!(("CREATE_PURSE", ${JSON.stringify(
                  payload.purses
                ).replace(
                  new RegExp(': null|:null', 'g'),
                  ': Nil'
                )}.get(ids.nth(i)), *x)) |
                for (@y <- x) {
                  for (@results <- resultsCh) {
                    resultsCh!(results.set(ids.nth(i), y)) |
                    itCh!(i + 1)
                  }
                }
              }
            }
          }
        }
      } |
      idsCh!([${ids.map((id) => `"${id}"`).join(', ')}]) |
      itCh!(0) |
      resultsCh!({})
    }
  }
  `; */
  };

  var createPursesTerm = {
  	createPursesTerm: createPursesTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var lockTerm_1 = (
    payload
  ) => {
    return `new basket,
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (superKey <<- @(*deployerId, "rchain-token-contract", "${payload.masterRegistryUri}", "${payload.contractId}")) {
    superKey!((
      "LOCK",
      *returnCh
    )) |
    for (@r <- returnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          stdout!("completed, contract locked") |
          basket!({ "status": "completed" })
        }
      }
    }
  }
}
`;
  };

  var lockTerm = {
  	lockTerm: lockTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var deleteExpiredPurseTerm_1 = (
    payload
  ) => {
    return `new basket, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      entry!(("PUBLIC_DELETE_EXPIRED_PURSE", "${payload.contractId}", "${payload.purseId}", *x)) |
      for (@r <- x) {
        match r {
          String => {
            basket!({ "status": "failed", "message": r }) |
            stdout!(("failed", r))
          }
          _ => {
            stdout!("completed, expired purses deleted") |
            basket!({ "status": "completed" })
          }
        }
      }
    }
  }
}`;
  };

  var deleteExpiredPurseTerm = {
  	deleteExpiredPurseTerm: deleteExpiredPurseTerm_1
  };

  var readPursesTerm_1 = (payload) => {
    let rholang = `new ${payload.pursesIds.map((id, i) => 'channel' + i)} in {`;
    payload.pursesIds.forEach((p, i) => {
      rholang +=
        '\n' +
        `entry!(("PUBLIC_READ_PURSE", { "contractId": "${payload.contractId}", "purseId": "${p}" }, *channel${i})) |`;
    });
    rholang += '\n';
    rholang += `for (${payload.pursesIds
    .map((p, i) => '@value' + i + ' <- channel' + i)
    .join('; ')}) {\n`;
    rholang += `  return!({}${payload.pursesIds
    .map((p, i) => `.union({ "${p}": value${i} })`)
    .join('')})\n`;
    rholang += `}\n}`;

    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    ${rholang}
  }
}`;
  };

  var readPursesTerm = {
  	readPursesTerm: readPursesTerm_1
  };

  var readAllPursesTerm_1 = (payload) => {
    const base = 12;
    let numberOfIndexes = 0;
    if (payload.depth === 1) {
      numberOfIndexes = base;
    } else if (payload.depth === 2) {
      numberOfIndexes = base * base;
    } else if (payload.depth === 3) {
      numberOfIndexes = base * base * base;
    } else if (payload.depth === 4) {
      numberOfIndexes = base * base * base * base;
    } else if (payload.depth === 5) {
      numberOfIndexes = base * base * base * base * base;
    } else {
      throw new error('depth should be > 0 and < 6');
    }

    const indexes = [];
    for (let i = 0; i < numberOfIndexes; i += 1) {
      indexes.push(i);
    }

    let rholang = `new ${indexes.map((i) => 'channel' + i).join(', ')} in {`;
    indexes.forEach((i) => {
      rholang +=
        '\n' +
        `entry!(("PUBLIC_READ_PURSES_AT_INDEX", "${payload.contractId}", ${i}, *channel${i})) |`;
    });
    rholang += '\n';
    rholang += `for (${indexes
    .map((i) => '@value' + i + ' <- channel' + i)
    .join('; ')}) {\n`;
    rholang += `  return!({}${indexes
    .map((i) => `.union(value${i})`)
    .join('')})\n`;
    rholang += `}\n}`;

    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    ${rholang}
  }
}`;
  };

  var readAllPursesTerm = {
  	readAllPursesTerm: readAllPursesTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var readBoxTerm_1 = (
    payload
  ) => {
    return `new return, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new a in {
      entry!(("PUBLIC_READ_BOX", "${payload.boxId}", *a)) |
      for (@box <- a) {
        return!(box)
      }
    }
  }
}`;
  };

  var readBoxTerm = {
  	readBoxTerm: readBoxTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var readConfigTerm_1 = (
    payload
  ) => {
    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      entry!(("PUBLIC_READ_CONFIG", "${payload.contractId}", *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
  };

  var readConfigTerm = {
  	readConfigTerm: readConfigTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var updatePurseDataTerm_1 = (
    payload
  ) => {
    return `new basket,
  returnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("UPDATE_PURSE_DATA", { "contractId": "${payload.contractId}", "data": "${payload.data}", "purseId": "${payload.purseId}" }, *returnCh)) |
    for (@r <- returnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          basket!({ "status": "completed" }) |
          stdout!("completed, data updated")
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

  var readPursesDataTerm_1 = (payload) => {
    let rholang = `new ${payload.pursesIds.map((id, i) => 'channel' + i)} in {`;
    payload.pursesIds.forEach((p, i) => {
      rholang +=
        '\n' +
        `entry!(("PUBLIC_READ_PURSE_DATA", { "contractId": "${payload.contractId}", "purseId": "${p}" }, *channel${i})) |`;
    });
    rholang += '\n';
    rholang += `for (${payload.pursesIds
    .map((p, i) => '@value' + i + ' <- channel' + i)
    .join('; ')}) {\n`;
    rholang += `  return!({}${payload.pursesIds
    .map((p, i) => `.union({ "${p}": value${i} })`)
    .join('')})\n`;
    rholang += `}\n}`;

    return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    ${rholang}
  }
}`;
  };

  var readPursesDataTerm = {
  	readPursesDataTerm: readPursesDataTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var updatePursePriceTerm_1 = (
    payload
  ) => {
    return `new basket,
  returnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("UPDATE_PURSE_PRICE", { "contractId": "${payload.contractId}", "price": ${payload.price || "Nil"}, "purseId": "${payload.purseId}" }, *returnCh)) |
    for (@r <- returnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          basket!({ "status": "completed" }) |
          stdout!("completed, price updated")
        }
      }
    }
  }
}
`;
  };

  var updatePursePriceTerm = {
  	updatePursePriceTerm: updatePursePriceTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var renewTerm_1 = (
    payload
  ) => {
    return `
new
  basket,
  revVaultCh,
  boxCh,

  returnCh,
  priceCh,
  publicKeyCh,
  purseIdCh,
  contractIdCh,

  revAddressCh,
  contractExistsCh,
  proceed1Ch,
  proceed2Ch,
  registryLookup(\`rho:registry:lookup\`),
  deployerId(\`rho:rchain:deployerId\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`)
in {

  purseIdCh!!("${payload.purseId}") |
  publicKeyCh!!("${payload.publicKey}") |
  contractIdCh!!("${payload.contractId}") |
  priceCh!!(${payload.price || "Nil"}) |

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {

    registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *contractExistsCh) |
    for (_ <- contractExistsCh) {
      proceed1Ch!(Nil)
    } |

    registryLookup!(\`rho:rchain:revVault\`, *revVaultCh) |

    /*
      Create a vault/purse that is just used once (purse)
    */
    for(@(_, *RevVault) <- revVaultCh; _ <- proceed1Ch) {
      new unf, purseRevAddrCh, purseAuthKeyCh, purseVaultCh, deployerRevAddressCh, RevVaultCh, deployerVaultCh, deployerAuthKeyCh in {
        revAddress!("fromUnforgeable", *unf, *purseRevAddrCh) |
        RevVault!("unforgeableAuthKey", *unf, *purseAuthKeyCh) |
        for (@purseAuthKey <- purseAuthKeyCh; @purseRevAddr <- purseRevAddrCh) {

          RevVault!("findOrCreate", purseRevAddr, *purseVaultCh) |

          for (
            @(true, purseVault) <- purseVaultCh;
            @purseId <- purseIdCh;
            @contractId <- contractIdCh;
            @price <- priceCh;
            @publicKey <- publicKeyCh
          ) {

            stdout!({
              "price": price,
              "purseId": purseId,
              "contractId": contractId,
              "publicKey": publicKey
            }) |
            match {
              "price": price,
              "purseId": purseId,
              "contractId": contractId,
              "publicKey": publicKey
            } {
              {
                "price": Int,
                "purseId": String,
                "contractId": String,
                "publicKey": String
              } => {
                proceed2Ch!(Nil)
              }
              _ => {
                basket!({ "status": "failed", "message": "error: invalid payload, cancelled renew and payment" }) |
                stdout!(("failed", "error: invalid payload, cancelled renew and payment"))
              }
            } |

            for (_ <- proceed2Ch) {

              revAddress!("fromPublicKey", publicKey.hexToBytes(), *deployerRevAddressCh) |
              registryLookup!(\`rho:rchain:revVault\`, *RevVaultCh) |
              for (@(_, RevVault) <- RevVaultCh; @deployerRevAddress <- deployerRevAddressCh) {
                
                // send price dust in purse
                @RevVault!("findOrCreate", deployerRevAddress, *deployerVaultCh) |
                @RevVault!("deployerAuthKey", *deployerId, *deployerAuthKeyCh) |
                for (@(true, deployerVault) <- deployerVaultCh; @deployerAuthKey <- deployerAuthKeyCh) {

                  stdout!(("Beginning transfer of ", price, "dust from", deployerRevAddress, "to", purseRevAddr)) |

                  new resultCh, entryCh in {
                    @deployerVault!("transfer", purseRevAddr, price, deployerAuthKey, *resultCh) |
                    for (@result <- resultCh) {

                      stdout!(("Finished transfer of ", price, "dust to", purseRevAddr, "result was:", result)) |
                      match result {
                        (true, Nil) => {
                          boxCh!((
                            "RENEW",
                            {
                              "contractId": contractId,
                              "purseId": purseId,
                              "purseRevAddr": purseRevAddr,
                              "purseAuthKey": purseAuthKey
                            },
                            *returnCh
                          )) |
                          for (@r <- returnCh) {
                            match r {
                              String => {
                                new refundPurseBalanceCh, refundResultCh in {
                                  @purseVault!("balance", *refundPurseBalanceCh) |
                                  for (@balance <- refundPurseBalanceCh) {
                                    if (balance != price) {
                                      stdout!("error: CRITICAL, renew was not successful and balance of purse is now different from price")
                                    } |
                                    @purseVault!("transfer", deployerRevAddress, balance, purseAuthKey, *refundResultCh) |
                                    for (@result <- refundResultCh)  {
                                      match result {
                                        (true, Nil) => {
                                          match "error: renew failed but was able to refund \${balance} " %% { "balance": balance } ++ r {
                                            s => {
                                              basket!({ "status": "failed", "message": s }) |
                                              stdout!(s)
                                            }
                                          }
                                        }
                                        _ => {
                                          stdout!(result) |
                                          match "error: CRITICAL renew failed and was NOT ABLE to refund \${balance} " %% { "balance": balance } ++ r {
                                            s => {
                                              basket!({ "status": "failed", "message": s }) |
                                              stdout!(s)
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              _ => {
                                basket!({ "status": "completed" }) |
                                stdout!("completed, renew successful")
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
}`;
  };

  var renewTerm = {
  	renewTerm: renewTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var purchaseTerm_1 = (
    payload
  ) => {
    return `
new
  basket,
  revVaultCh,
  boxCh,

  returnCh,
  quantityCh,
  mergeCh,
  publicKeyCh,
  priceCh,
  newIdCh,
  dataCh,
  purseIdCh,
  contractIdCh,

  revAddressCh,
  contractExistsCh,
  proceed1Ch,
  proceed2Ch,
  registryLookup(\`rho:registry:lookup\`),
  deployerId(\`rho:rchain:deployerId\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`)
in {

  purseIdCh!!("${payload.purseId}") |
  contractIdCh!!("${payload.contractId}") |
  newIdCh!!("${payload.newId ? payload.newId : ""}") |
  priceCh!!(${payload.price || "Nil"}) |
  mergeCh!!(${payload.merge}) |
  quantityCh!!(${payload.quantity}) |
  publicKeyCh!!("${payload.publicKey}") |
  dataCh!!("${payload.data}") |

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {

    registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *contractExistsCh) |
    for (_ <- contractExistsCh) {
      proceed1Ch!(Nil)
    } |

    registryLookup!(\`rho:rchain:revVault\`, *revVaultCh) |

    /*
      Create a vault/purse that is just used once (purse)
    */
    for(@(_, *RevVault) <- revVaultCh; _ <- proceed1Ch) {
      new unf, purseRevAddrCh, purseAuthKeyCh, purseVaultCh, deployerRevAddressCh, RevVaultCh, deployerVaultCh, deployerAuthKeyCh in {
        revAddress!("fromUnforgeable", *unf, *purseRevAddrCh) |
        RevVault!("unforgeableAuthKey", *unf, *purseAuthKeyCh) |
        for (@purseAuthKey <- purseAuthKeyCh; @purseRevAddr <- purseRevAddrCh) {

          RevVault!("findOrCreate", purseRevAddr, *purseVaultCh) |

          for (
            @(true, purseVault) <- purseVaultCh;
            @publicKey <- publicKeyCh;
            @purseId <- purseIdCh;
            @merge <- mergeCh;
            @contractId <- contractIdCh;
            @price <- priceCh;
            @quantity <- quantityCh;
            @newId <- newIdCh;
            @data <- dataCh
          ) {

            stdout!({
              "publicKey": publicKey,
              "price": price,
              "merge": merge,
              "quantity": quantity,
              "purseId": purseId,
              "contractId": contractId,
              "newId": newId,
            }) |
            match {
              "publicKey": publicKey,
              "price": price,
              "merge": merge,
              "quantity": quantity,
              "purseId": purseId,
              "contractId": contractId,
              "newId": newId,
            } {
              {
                "publicKey": String,
                "price": Int,
                "merge": Bool,
                "quantity": Int,
                "purseId": String,
                "contractId": String,
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

              revAddress!("fromPublicKey", publicKey.hexToBytes(), *deployerRevAddressCh) |
              registryLookup!(\`rho:rchain:revVault\`, *RevVaultCh) |
              for (@(_, RevVault) <- RevVaultCh; @deployerRevAddress <- deployerRevAddressCh) {
                
                // send price * quantity dust in purse
                @RevVault!("findOrCreate", deployerRevAddress, *deployerVaultCh) |
                @RevVault!("deployerAuthKey", *deployerId, *deployerAuthKeyCh) |
                for (@(true, deployerVault) <- deployerVaultCh; @deployerAuthKey <- deployerAuthKeyCh) {

                  stdout!(("Beginning transfer of ", price * quantity, "dust from", deployerRevAddress, "to", purseRevAddr)) |

                  new resultCh, entryCh in {
                    @deployerVault!("transfer", purseRevAddr, price * quantity, deployerAuthKey, *resultCh) |
                    for (@result <- resultCh) {

                      stdout!(("Finished transfer of ", price * quantity, "dust to", purseRevAddr, "result was:", result)) |
                      match result {
                        (true, Nil) => {
                          boxCh!((
                            "PURCHASE",
                            {
                              "contractId": contractId,
                              "purseId": purseId,
                              "data": data,
                              "quantity": quantity,
                              "merge": merge,
                              "newId": newId,
                              "purseRevAddr": purseRevAddr,
                              "purseAuthKey": purseAuthKey
                            },
                            *returnCh
                          )) |
                          for (@r <- returnCh) {
                            match r {
                              String => {
                                new refundPurseBalanceCh, refundResultCh in {
                                  @purseVault!("balance", *refundPurseBalanceCh) |
                                  for (@balance <- refundPurseBalanceCh) {
                                    if (balance != price * quantity) {
                                      stdout!("error: CRITICAL, purchase was not successful and balance of purse is now different from price * quantity")
                                    } |
                                    @purseVault!("transfer", deployerRevAddress, balance, purseAuthKey, *refundResultCh) |
                                    for (@result <- refundResultCh)  {
                                      match result {
                                        (true, Nil) => {
                                          match "error: purchase failed but was able to refund \${balance} " %% { "balance": balance } ++ r {
                                            s => {
                                              basket!({ "status": "failed", "message": s }) |
                                              stdout!(s)
                                            }
                                          }
                                        }
                                        _ => {
                                          stdout!(result) |
                                          match "error: CRITICAL purchase failed and was NOT ABLE to refund \${balance} " %% { "balance": balance } ++ r {
                                            s => {
                                              basket!({ "status": "failed", "message": s }) |
                                              stdout!(s)
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              _ => {
                                basket!({ "status": "completed" }) |
                                stdout!("completed, purchase successful")
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
}`;
  };

  var purchaseTerm = {
  	purchaseTerm: purchaseTerm_1
  };

  /* GENERATED CODE, only edit rholang/*.rho files*/
  var withdrawTerm_1 = (
    payload
  ) => {
    return `new basket,
  withdrawReturnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("WITHDRAW", { "contractId": "${payload.contractId}", "quantity": ${payload.withdrawQuantity}, "toBoxId": "${payload.toBoxId}", "purseId": "${payload.purseId}", "merge": ${payload.merge} }, *withdrawReturnCh)) |
    for (@r <- withdrawReturnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          basket!({ "status": "completed" }) |
          stdout!("completed, withdraw successful")
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

  var VERSION = '9.0.0';

  var constants = {
  	VERSION: VERSION
  };

  // rholang terms
  const { deployBoxTerm: deployBoxTerm$1 } = deployBoxTerm;
  const { masterTerm: masterTerm$1 } = masterTerm;
  const { deployTerm: deployTerm$1 } = deployTerm;
  const { createPursesTerm: createPursesTerm$1 } = createPursesTerm;
  const { lockTerm: lockTerm$1 } = lockTerm;
  const { deleteExpiredPurseTerm: deleteExpiredPurseTerm$1 } = deleteExpiredPurseTerm;
  const { readPursesTerm: readPursesTerm$1 } = readPursesTerm;
  const { readAllPursesTerm: readAllPursesTerm$1 } = readAllPursesTerm;
  const { readBoxTerm: readBoxTerm$1 } = readBoxTerm;
  const { readConfigTerm: readConfigTerm$1 } = readConfigTerm;
  const { updatePurseDataTerm: updatePurseDataTerm$1 } = updatePurseDataTerm;
  const { readPursesDataTerm: readPursesDataTerm$1 } = readPursesDataTerm;
  const { updatePursePriceTerm: updatePursePriceTerm$1 } = updatePursePriceTerm;
  const { renewTerm: renewTerm$1 } = renewTerm;
  const { purchaseTerm: purchaseTerm$1 } = purchaseTerm;
  const { withdrawTerm: withdrawTerm$1 } = withdrawTerm;

  // utils
  const { decodePurses: decodePurses$1 } = decodePurses;

  const { VERSION: VERSION$1 } = constants;

  var src = {
    version: VERSION$1,

    masterTerm: masterTerm$1,
    deployBoxTerm: deployBoxTerm$1,
    deployTerm: deployTerm$1,
    createPursesTerm: createPursesTerm$1,
    lockTerm: lockTerm$1,
    deleteExpiredPurseTerm: deleteExpiredPurseTerm$1,
    updatePurseDataTerm: updatePurseDataTerm$1,
    updatePursePriceTerm: updatePursePriceTerm$1,
    purchaseTerm: purchaseTerm$1,
    renewTerm: renewTerm$1,
    withdrawTerm: withdrawTerm$1,

    readPursesTerm: readPursesTerm$1,
    readAllPursesTerm: readAllPursesTerm$1,
    readBoxTerm: readBoxTerm$1,
    readConfigTerm: readConfigTerm$1,
    readPursesDataTerm: readPursesDataTerm$1,

    // utils
    decodePurses: decodePurses$1,
  };
  var src_1 = src.version;
  var src_2 = src.masterTerm;
  var src_3 = src.deployBoxTerm;
  var src_4 = src.deployTerm;
  var src_5 = src.createPursesTerm;
  var src_6 = src.lockTerm;
  var src_7 = src.deleteExpiredPurseTerm;
  var src_8 = src.updatePurseDataTerm;
  var src_9 = src.updatePursePriceTerm;
  var src_10 = src.purchaseTerm;
  var src_11 = src.renewTerm;
  var src_12 = src.withdrawTerm;
  var src_13 = src.readPursesTerm;
  var src_14 = src.readAllPursesTerm;
  var src_15 = src.readBoxTerm;
  var src_16 = src.readConfigTerm;
  var src_17 = src.readPursesDataTerm;
  var src_18 = src.decodePurses;

  exports.createPursesTerm = src_5;
  exports.decodePurses = src_18;
  exports.default = src;
  exports.deleteExpiredPurseTerm = src_7;
  exports.deployBoxTerm = src_3;
  exports.deployTerm = src_4;
  exports.lockTerm = src_6;
  exports.masterTerm = src_2;
  exports.purchaseTerm = src_10;
  exports.readAllPursesTerm = src_14;
  exports.readBoxTerm = src_15;
  exports.readConfigTerm = src_16;
  exports.readPursesDataTerm = src_17;
  exports.readPursesTerm = src_13;
  exports.renewTerm = src_11;
  exports.updatePurseDataTerm = src_8;
  exports.updatePursePriceTerm = src_9;
  exports.version = src_1;
  exports.withdrawTerm = src_12;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
