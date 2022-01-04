import rc from 'rchain-toolkit';

import { Wallet } from './wallet';

interface RChainTransactionBase {
  timestamp: number;
  phloLimit: number;
  phloPrice: number;
  validAfterBlockNumber: number;
}

interface RChainTermTransaction extends RChainTransactionBase {
  term: string;
}

interface RChainTransferTransaction extends RChainTransactionBase {
  from: string;
  to: string;
  amount: number;
}

export const rchainWallet: Wallet<RChainTermTransaction, RChainTransferTransaction> = {
  signTransaction: (tx, privateKey) => {
    const dd = rc.utils.getDeployOptions(
      'secp256k1',
      tx.timestamp,
      tx.term,
      privateKey,
      rc.utils.publicKeyFromPrivateKey(privateKey),
      tx.phloPrice,
      tx.phloLimit,
      // todo change to -1
      tx.validAfterBlockNumber || 1
    );

    return dd;
  },
  signTransferTransaction: (tx, privateKey) => {
    const dd = rc.utils.getDeployOptions(
      'secp256k1',
      tx.timestamp,
      createTranferTerm(tx),
      privateKey,
      rc.utils.publicKeyFromPrivateKey(privateKey),
      tx.phloPrice,
      tx.phloLimit,
      // todo change to -1
      tx.validAfterBlockNumber || 1
    );

    return dd;
  },
  publicKeyFromPrivateKey: (privateKey: string) => {
    return rc.utils.publicKeyFromPrivateKey(privateKey);
  },
  addressFromPublicKey: (publicKey: string) => {
    return rc.utils.revAddressFromPublicKey(publicKey);
  },
};

const createTranferTerm = ({ from, to, amount }: RChainTransferTransaction) => `new
    basket,
    rl(\`rho:registry:lookup\`),
    RevVaultCh,
    stdout(\`rho:io:stdout\`)
  in {

  rl!(\`rho:rchain:revVault\`, *RevVaultCh) |
  for (@(_, RevVault) <- RevVaultCh) {
    stdout!(("Started transfer")) |
    match (
      "${from}",
      "${to}",
      ${amount}
    ) {
      (from, to, amount) => {

        new vaultCh, vaultTo, revVaultkeyCh, deployerId(\`rho:rchain:deployerId\`) in {
          @RevVault!("findOrCreate", from, *vaultCh) |
          @RevVault!("findOrCreate", to, *vaultTo) |
          @RevVault!("deployerAuthKey", *deployerId, *revVaultkeyCh) |
          for (@result <- vaultCh; key <- revVaultkeyCh; _ <- vaultTo) {
            stdout!(result) |
            match result {
              (true, vault) => {
                stdout!(("Beginning transfer of " , amount , " dust from " , from , " to " , to)) |
                new resultCh in {
                  @vault!("transfer", to, amount, *key, *resultCh) |
                  for (@result2 <- resultCh) {
                    stdout!(result2) |
                    match result2 {
                      (true, Nil) => {
                        stdout!(("Finished transfer of " , amount , " dusts to " , to)) |
                        basket!({ "status": "completed" })
                      }
                      _ => {
                        stdout!("Failed to transfer REV (vault transfer)") |
                        basket!({ "status": "failed", "message": "Failed to transfer REV (vault transfer)" })
                      }
                    }
                  }
                }
              }
              _ => {
                stdout!("Failed to transfer REV (vault not found)") |
                basket!({ "status": "failed", "message": "Failed to transfer REV (vault not found)" })
              }
            }
          }
        }
      }
    }
  }
}`;
