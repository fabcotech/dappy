import { takeEvery, select, put, all } from 'redux-saga/effects';

import * as fromSettings from '..';
import { rpcs } from '/models/Account';

import { BlockchainAccount } from '/models';
import { Action } from '/store';
import { evmRpc } from '/interProcess';
import { convertToNumber } from '/utils/wallets';

function* executeAccountsCronJobs(action: Action) {
  const evmAccounts: Record<string, BlockchainAccount> = yield select(fromSettings.getEVMAccounts);
  const actions: any[] = [];

  let i = 0;
  const func: any = async () => {
    const a = Object.keys(evmAccounts)[i];
    if (
      !evmAccounts[a].chainId ||
      !rpcs[evmAccounts[a].chainId as string] ||
      !rpcs[evmAccounts[a].chainId as string].length
    ) {
      console.error('Missing RPC, cannot get balance');
      actions.push(
        put(
          fromSettings.updateAccountAction({
            account: {
              ...evmAccounts[a],
              balance: -1,
            },
          })
        )
      );
      if (i === Object.keys(evmAccounts).length - 1) {
        return 'ok';
      }
      i += 1;
      return func();
    }

    try {
      const resp = await evmRpc({
        host: rpcs[evmAccounts[a].chainId as string][0].host,
        path: rpcs[evmAccounts[a].chainId as string][0].path,
        payload: {
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [
            evmAccounts[a].chainId === '137'
              ? '0x51bfacfcE67821EC05d3C9bC9a8BC8300fB29564'
              : '0xF977814e90dA44bFA03b6295A0616a897441aceC',
            'latest',
          ],
          id: 1,
        },
      });
      try {
        const parsed = JSON.parse(resp);
        let balance = parsed.result;
        balance = convertToNumber(balance);
        if (typeof balance !== 'number') {
          throw new Error('Not a number');
        }
        actions.push(
          put(
            fromSettings.updateAccountAction({
              account: {
                ...evmAccounts[a],
                balance: balance / 10 ** 18,
              },
            })
          )
        );
      } catch (err) {
        console.error('Failed to parse response, cannot get balance');
        actions.push(
          put(
            fromSettings.updateAccountAction({
              account: {
                ...evmAccounts[a],
                balance: -1,
              },
            })
          )
        );
      }
    } catch (err) {
      console.error('EVM RPC failed, cannot get balance');
      console.log(err);
      actions.push(
        put(
          fromSettings.updateAccountAction({
            account: {
              ...evmAccounts[a],
              balance: -1,
            },
          })
        )
      );
    }
    if (i === Object.keys(evmAccounts).length - 1) {
      return 'ok';
    }
    i += 1;
    return func();
  };
  yield func();
  yield all(actions);
}

export function* executeAccountsCronJobsSaga() {
  yield takeEvery(fromSettings.EXECUTE_ACCOUNTS_CRON_JOBS, executeAccountsCronJobs);
}
