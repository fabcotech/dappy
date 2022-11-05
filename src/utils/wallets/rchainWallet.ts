import * as rchainToolkit from '@fabcotech/rchain-toolkit';

import { Wallet } from './wallet';

interface RChainTransaction {
  timestamp: number;
  phloLimit: number;
  phloPrice: number;
  shardId: string;
  validAfterBlockNumber: number;
  term: string;
}

interface RChainSignedTransaction {
  data: any;
  deployer: string;
  signature: string;
  sigAlgorithm: 'secp256k1';
}

export const rchainWallet: Wallet<RChainTransaction, RChainSignedTransaction> = {
  signTransaction: (tx, privateKey) => {
    const dd = rchainToolkit.utils.getDeployOptions({
      timestamp: tx.timestamp,
      term: tx.term,
      privateKey,
      shardId: tx.shardId,
      phloPrice: tx.phloPrice,
      phloLimit: tx.phloLimit,
      // todo change to -1
      validAfterBlockNumber: tx.validAfterBlockNumber || 1,
    });

    return dd;
  },
  publicKeyFromPrivateKey: (privateKey: string) => {
    return rchainToolkit.utils.publicKeyFromPrivateKey(privateKey);
  },
  addressFromPublicKey: (publicKey: string) => {
    return rchainToolkit.utils.revAddressFromPublicKey(publicKey);
  },
};

interface CreateTransferTermArgs {
  from: string;
  to: string;
  amount: number;
}

export const createTranferTerm = ({ from, to, amount }: CreateTransferTermArgs) => `new
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
