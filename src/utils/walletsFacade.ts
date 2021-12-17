import rc from 'rchain-toolkit';

const rchainFacade = {
  signTransaction: (payload: { timestamp: number; term: string; phloLimit: number; phloPrice: number; validAfterBlockNumber: number; }, privateKey: string) => {
    const dd = rc.utils.getDeployOptions(
      'secp256k1',
      payload.timestamp,
      payload.term,
      privateKey,
      rc.utils.publicKeyFromPrivateKey(privateKey),
      payload.phloPrice,
      payload.phloLimit,
      // todo change to -1
      payload.validAfterBlockNumber || 1
    );

    return dd;
  },
  signTransferTransaction: (payload: { timestamp: number; phloLimit: number; phloPrice: number; validAfterBlockNumber: number; from: string; to: string; amount: number; }, privateKey: string) => {
    const term = `new
    basket,
    rl(\`rho:registry:lookup\`),
    RevVaultCh,
    stdout(\`rho:io:stdout\`)
  in {

  rl!(\`rho:rchain:revVault\`, *RevVaultCh) |
  for (@(_, RevVault) <- RevVaultCh) {
    stdout!(("Started transfer")) |
    match (
      "${payload.from}",
      "${payload.to}",
      ${payload.amount}
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
}`
    const dd = rc.utils.getDeployOptions(
      'secp256k1',
      payload.timestamp,
      term,
      privateKey,
      rc.utils.publicKeyFromPrivateKey(privateKey),
      payload.phloPrice,
      payload.phloLimit,
      // todo change to -1
      payload.validAfterBlockNumber || 1
    );

    return dd;
  },
  publicKeyFromPrivateKey: (privateKey: string) => {
    return rc.utils.publicKeyFromPrivateKey(privateKey)
  }, 
  addressFromPublicKey: (publicKey: string) => {
    return rc.utils.revAddressFromPublicKey(publicKey);
  },
}

const ethereumFacade = {
  signTransaction: (payload: {
    to: string;
    nonce: string;
    gasLimit: string;
    gasPrice: string;
    value: any;
    data: any;
    chainId: string;
  }, privateKey: string) => {
    return null;
  },
  signTransferTransaction: (payload: {
    to: string;
    nonce: string;
    gasLimit: string;
    gasPrice: string;
    value: string;
    data: any;
    chainId: string;
  }, privateKey: string) => {
    return null;
  },
  publicKeyFromPrivateKey: (privateKey: string) => {
    return rc.utils.publicKeyFromPrivateKey(privateKey)
  }, 
  addressFromPublicKey: (publicKey: string) => {
    return rc.utils.ethAddressFromPublicKey(publicKey);
  },
}

export const facade = {
  rchain: rchainFacade,
  ethereum: ethereumFacade,
}