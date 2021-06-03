
export type ResolutionLevel = "1" | "2";

/*
  This file contains the logic of how the multirequests should be made
  to the nodes/members of a dappy network, and what synchrony constraint
  we should apply to the anwsers received (= does the multirequest fail
  or succeed)

  level 1 prioritizes speed over accuracy, asking only few network members
  and expecting the same answer
  used for get-balance, get-data-at-name, explore-deploys by dapps (tipboard,
  personal pages etc)

  level 2 prioritizes accuracy over speed, it is an ultra accurate
  multirequest level that allows
  - just one different response over the whole network (1-20 network members)
  - two different responses over the whole networj (21-n network members)
  used for name system (= DNS lookups)

  examples:
  (1) network of 4 members:
    level 1: query only 2 members, and expect 100% (2) of identical answers
    level 2: query 4 members, and expect 100% (4) of identical answers

  (2) network of 8 members:
    level 1: query only 3 members, and expect 100% (3) of identical answers
    level 2: query 8 members, and expect at least 76% (7/8) of identical answers

  resolverAbsolute = number of successful nodes/network members requests to receive,
    requests will continue being made until this number is reached

  resolverAccuracy = synchronization constraints / percentage of identical
    answers required among successful answers. When [resolverAbsolute] is reached,
    answers are checked against [resolverAccuracy]

*/

const LEVELS = {
  "1": {
    "0": { resolverAccuracy: 100, resolverAbsolute: 1 }, // will fail
    "1": { resolverAccuracy: 100, resolverAbsolute: 1 },
    "2": { resolverAccuracy: 100, resolverAbsolute: 2 },
    "3": { resolverAccuracy: 100, resolverAbsolute: 2 },
    "4": { resolverAccuracy: 100, resolverAbsolute: 2 },
    "5": { resolverAccuracy: 100, resolverAbsolute: 2 },
    "6": { resolverAccuracy: 100, resolverAbsolute: 3 },
    "7": { resolverAccuracy: 100, resolverAbsolute: 3 },
    "8": { resolverAccuracy: 100, resolverAbsolute: 3 },
    "9": { resolverAccuracy: 100, resolverAbsolute: 3 },
    "10": { resolverAccuracy: 100, resolverAbsolute: 4 },
    "11": { resolverAccuracy: 100, resolverAbsolute: 4 },
    "12": { resolverAccuracy: 100, resolverAbsolute: 4 },
  },
  "2": {
    "0": { resolverAccuracy: 100, resolverAbsolute: 1 }, // will fail
    "1": { resolverAccuracy: 100, resolverAbsolute: 1 },
    "2": { resolverAccuracy: 100, resolverAbsolute: 2 },
    "3": { resolverAccuracy: 100, resolverAbsolute: 3 },
    "4": { resolverAccuracy: 100, resolverAbsolute: 4 },
    "5": { resolverAccuracy: 61, resolverAbsolute: 5 }, //  61% = at least      4/5 =   aaaa/b
    "6": { resolverAccuracy: 67, resolverAbsolute: 6 }, //  67% = at least      5/6 =   aaaaa/b
    "7": { resolverAccuracy: 72, resolverAbsolute: 7 }, //  72% = at least      6/7 =   aaaaaa/b
    "8": { resolverAccuracy: 76, resolverAbsolute: 8 }, //  76% = at least      7/8 =   aaaaaaa/b
    "9": { resolverAccuracy: 78, resolverAbsolute: 9 }, //  78% = at least      8/9 =   aaaaaaaa/b
    "10": { resolverAccuracy: 81, resolverAbsolute: 10 }, // 81% = at least    9/10 =   aaaaaaaaa/b
    "11": { resolverAccuracy: 82, resolverAbsolute: 11 }, // 82% = at least   10/11 =   aaaaaaaaaa/b
    "12": { resolverAccuracy: 84, resolverAbsolute: 12 }, // 84% = at least   11/12 =   aaaaaaaaaaa/b
  }
}

export const getResolverParamters = (level: ResolutionLevel, networkSize: number): { resolverAccuracy: number, resolverAbsolute: number } => {
  let p: { resolverAccuracy: number, resolverAbsolute: number } | undefined = undefined;
  if (level === "1") {
    // cannot do otherwsie than as "1", why ?
    p = LEVELS["1"][networkSize.toString() as "1"];
    if (p === undefined) {
      if (networkSize < 20) {
        p = { resolverAccuracy: 100, resolverAbsolute: 4 };
      } else {
        p = { resolverAccuracy: 100, resolverAbsolute: Math.floor(networkSize / 5) };
      }
    }
  } else if (level === "2") {
    // cannot do otherwsie than as "1", why ?
    p = LEVELS["2"][networkSize.toString() as "1"];
    if (p === undefined) {
      if (networkSize < 20) {
        // tolerates 1 different answer aaaaaaaa.../b
        p = { resolverAccuracy: 100 - Math.ceil((100/networkSize)) - 0.001, resolverAbsolute: networkSize };
      } else {
        // tolerates 2 different answers aaaaaaaa.../bb
        p = { resolverAccuracy:  100 - Math.ceil((100/(networkSize / 2))) - 0.001, resolverAbsolute: Math.floor(networkSize / 5) };
      }
    }
  } else {
    throw new Error("level has to be either '1' or '2'")
  }

  return p;
}