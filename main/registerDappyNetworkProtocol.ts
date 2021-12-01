import { Session } from 'electron';
import { Store } from 'redux';

import { DappyBrowserView } from './models';
import * as fromBlockchainsMain from './store/blockchains';
import * as fromSettingsMain from './store/settings';
import { performMultiRequest } from './performMultiRequest';

import { splitSearch } from '../src/utils/splitSearch';
import { getNodeIndex } from '../src/utils/getNodeIndex';

/* browser process - main process */
export const registerDappyNetworkProtocol = (
  dappyBrowserView: DappyBrowserView,
  session: Session,
  store: Store
) => {
  session.protocol.registerBufferProtocol('dappynetwork', (request, callback) => {
    let chainId;
    try {
      chainId = splitSearch(dappyBrowserView.dappyDomain).chainId;
    } catch (err) {
      console.log('[dappynetwork://] could not find blockchain id ' + dappyBrowserView.dappyDomain);
      callback(null);
      return;
    }
    const settings = fromSettingsMain.getSettings(store.getState());
    const blockchains = fromBlockchainsMain.getBlockchains(store.getState());
    if (!blockchains[chainId]) {
      console.log('[dappynetwork://] unknown blockchain ' + chainId);
      callback(null)
      return;
    }

    let indexes = blockchains[chainId].nodes
      .filter((n) => n.active && n.readyState === 1)
      .map(getNodeIndex);

    if (request.url === "dappynetwork:///explore-deploys") {
      let data = {};
      try {
        data = JSON.parse(request.headers.Data);
      } catch (err) { }
      performMultiRequest(
        {
          type: 'explore-deploy-x',
          body: data,
        },
        {
          chainId: chainId,
          urls: indexes,
          resolverMode: settings.resolverMode,
          resolverAccuracy: settings.resolverAccuracy,
          resolverAbsolute: settings.resolverAbsolute,
          multiCallId: 'useless',
          comparer: (res: any) => {
            return res;
          },
        },
        blockchains
      ).then(multiCallResult => {
        const json = JSON.parse(multiCallResult.result.data);
        if (!json.success) {
          callback(json.error);
          return;
        }
        callback({
          mimeType: 'application/json',
          data: Buffer.from(JSON.stringify(json.data)),
        });
      }).catch(err => {
        console.log('[dappynetwork://] multi-request /explore-deploys failed');
        callback(null);
        console.log(err)
      })
    } else if (request.url === 'dappynetwork:///api/explore-deploy') {
      performMultiRequest(
        {
          type: 'api/explore-deploy',
          body: { term: request.headers.Data },
        },
        {
          chainId: chainId,
          urls: indexes,
          resolverMode: settings.resolverMode,
          resolverAccuracy: settings.resolverAccuracy,
          resolverAbsolute: settings.resolverAbsolute,
          multiCallId: 'useless',
          comparer: (res: any) => {
            return res;
          },
        },
        blockchains
      ).then(multiCallResult => {
        const json = JSON.parse(multiCallResult.result.data);
        if (!json.success) {
          callback(json.error);
          return;
        }
        callback({
          mimeType: 'application/json',
          data: Buffer.from(JSON.stringify(json.data)),
        });
      }).catch(err => {
        console.log('[dappynetwork://] multi-request /api/explore-deploy failed');
        callback(null);
        console.log(err)
      })
    } else if (request.url === 'dappynetwork:///api/data-at-name') {
      console.log('dappynetwork:///api/data-at-name')
      let data = {};
      try {
        data = JSON.parse(request.headers.Data);
      } catch (err) { }
      performMultiRequest(
        {
          type: 'api/data-at-name',
          body: data,
        },
        {
          chainId: chainId,
          urls: indexes,
          resolverMode: settings.resolverMode,
          resolverAccuracy: settings.resolverAccuracy,
          resolverAbsolute: settings.resolverAbsolute,
          multiCallId: 'useless',
          comparer: (res: any) => {
            return res;
          },
        },
        blockchains
      ).then(multiCallResult => {
        const json = JSON.parse(multiCallResult.result.data);
        if (!json.success) {
          callback(json.error);
          return;
        }
        callback({
          mimeType: 'application/json',
          data: Buffer.from(JSON.stringify(json.data)),
        });
      }).catch(err => {
        console.log('[dappynetwork://] multi-request /api/data-at-name failed');
        callback(null);
        console.log(err)
      })
    } else if (request.url === 'dappynetwork:///api/prepare-deploy') {
      console.log('dappynetwork:///api/prepare-deploy')
      let data = {};
      try {
        data = JSON.parse(request.headers.Data);
      } catch (err) { }
      performMultiRequest(
        {
          type: 'api/prepare-deploy',
          body: data,
        },
        {
          chainId: chainId,
          urls: indexes,
          resolverMode: settings.resolverMode,
          resolverAccuracy: settings.resolverAccuracy,
          resolverAbsolute: settings.resolverAbsolute,
          multiCallId: 'useless',
          comparer: (res: any) => {
            return res;
          },
        },
        blockchains
      ).then(multiCallResult => {
        const json = JSON.parse(multiCallResult.result.data);
        if (!json.success) {
          callback(json.error);
          return;
        }
        callback({
          mimeType: 'application/json',
          data: Buffer.from(JSON.stringify(json.data)),
        });
      }).catch(err => {
        console.log('[dappynetwork://] multi-request /api/prepare-deploy failed');
        callback(null);
        console.log(err)
      })
    } else if (request.url.startsWith('dappynetwork:///api/blocks/')) {
      console.log('dappynetwork:///api/blocks/x')
      let data = {};
      try {
        data = JSON.parse(request.headers.Data);
      } catch (err) { }
      performMultiRequest(
        {
          type: request.url.replace('dappynetwork://', ''),
          body: data,
        },
        {
          chainId: chainId,
          urls: indexes,
          resolverMode: settings.resolverMode,
          resolverAccuracy: settings.resolverAccuracy,
          resolverAbsolute: settings.resolverAbsolute,
          multiCallId: 'useless',
          comparer: (res: any) => {
            return res;
          },
        },
        blockchains
      ).then(multiCallResult => {
        const json = JSON.parse(multiCallResult.result.data);
        if (!json.success) {
          callback(json.error);
          return;
        }
        callback({
          mimeType: 'application/json',
          data: Buffer.from(JSON.stringify(json.data)),
        });
      }).catch(err => {
        console.log('[dappynetwork://] multi-request /api/blocks/ failed');
        callback(null);
        console.log(err)
      })
    } else {
      console.log('[dappynetwork://] unknown multi-request ' + request.url);
      callback(null)
    }
  });
};