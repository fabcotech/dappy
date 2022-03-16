import { NamePacket, ReturnCode, RR } from "/models/FakeDappyLookup";

const dappyLookup = {

  // host: pro.dappy, type: 'TXT'

  lookup: (host: string, type: string, cacheHandler?: any) => {
    return {
      version: "1",
      type: 'response',
      rcode: ReturnCode.NOERROR,
      id: 0,
      flags: 0,
      questions: [{
        "name": "dappy.tech",
        "type": "A",
        "class": "IN"
      }],
      answers: [
        {
            "name": "dappy.tech",
            "type": "A",
            "ttl": 3600,
            "class": "IN",
            "data": "46.101.211.203"
        }
      ],
      additionals: [],
      authorities: [],
    } as NamePacket;
  }
}

export default dappyLookup;