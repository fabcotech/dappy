import { getFirstReadyNode, State } from './reducer';

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
              active: false,
              readyState: 1,
              ssl: true,
            },
            {
              ip: '192.168.0.1',
              host: 'dappy.dev',
              origin: 'user',
              active: true,
              readyState: 1,
              ssl: true,
            },
          ],
        },
      },
    };

    expect(getFirstReadyNode({ settings: state })).toEqual(state.blockchains?.local.nodes[1]);
  });
});
