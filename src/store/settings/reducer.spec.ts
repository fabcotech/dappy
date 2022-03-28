import { getRChainAccounts } from '.';
import { getFirstReadyNode, State, getEVMAccounts } from './reducer';
import { getFakeRChainAccount, getFakeEVMAccount } from '/fakeData';

describe('settings selectors', () => {
  it('getFirstReadyNode', () => {
    const state: Partial<State> = {
      blockchains: {
        foo: {
          chainId: 'local',
          chainName: 'local',
          platform: 'rchain',
          nodes: [],
        },
        local: {
          chainId: 'local',
          chainName: 'local',
          platform: 'rchain',
          nodes: [
            {
              ip: '127.0.0.1',
              host: 'dappy.dev',
              origin: 'user',
              readyState: 1,
              ssl: true,
            },
            {
              ip: '192.168.0.1',
              host: 'dappy.dev',
              origin: 'user',
              readyState: 1,
              ssl: true,
            },
          ],
        },
      },
    };

    expect(getFirstReadyNode({ settings: state })).toEqual(state.blockchains?.local.nodes[1]);
  });

  it('getRChainAccounts', () => {
    const state: Partial<State> = {
      accounts: {
        foo: getFakeEVMAccount(),
        bar: getFakeRChainAccount(),
        baz: getFakeRChainAccount(),
      },
    };

    expect(getRChainAccounts({ settings: state })).toEqual({
      bar: state.accounts!.bar,
      baz: state.accounts!.baz,
    });
  });

  it('getEVMAccounts', () => {
    const state: Partial<State> = {
      accounts: {
        foo: getFakeEVMAccount(),
        bar: getFakeRChainAccount(),
        baz: getFakeRChainAccount(),
      },
    };

    expect(getEVMAccounts({ settings: state })).toEqual({
      foo: state.accounts!.foo,
    });
  });
});
