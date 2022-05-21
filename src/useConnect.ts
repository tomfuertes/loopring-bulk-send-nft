import * as sdk from "@loopring-web/loopring-sdk";

import { ChainId, useConnectHook } from "./useConnectHook";

export function useConnect() {
  useConnectHook({
    handleAccountDisconnect: () => {
      console.log("handleAccountDisconnect:");

      // await sleep(REFRESH_RATE)
    },
    handleProcessing: ({ opts }: { type: any; opts: any }) => {
      console.log(opts);
    },
    handleError: (props: { type: any; opts?: any }) => {
      console.log("---> handleError:", props);
    },
    handleConnect: async ({
      accounts,
      provider,
      chainId,
    }: {
      accounts: string;
      provider: any;
      chainId: ChainId | "unknown";
    }) => {
      const accAddress = accounts[0];
      // console.log(provider, accounts, accAddress, chainId);

      // console.log(loopring);

      console.log(
        "After connect >>,network part start: step1 networkUpdate",
        accAddress
      );

      const opts = {
        web3: provider,
        address: accAddress,
        keySeed: sdk.GlobalAPI.KEY_MESSAGE.replace(
          "${exchangeAddress}",
          "0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4"
        ).replace("${nonce}", (0).toString()),
        walletType: sdk.ConnectorNames.MetaMask,
        chainId: sdk.ChainId.MAINNET,
      };
      console.log(opts);
      const eddsaKey = await sdk.generateKeyPair(opts);

      console.log(eddsaKey);
      console.log("After connect >>,network part done: step2 check account");
    },
  });
}
