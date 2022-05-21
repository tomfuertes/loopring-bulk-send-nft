import * as sdk from "@loopring-web/loopring-sdk";
import { connectProvides } from "@loopring-web/web3-provider";
import LoopringAPI from "./loopring";

import { ChainId, useConnectHook } from "./useConnectHook";

const signatureKeyPairMock = async function (
  exchangeAddress: string,
  accInfo: sdk.AccountInfo,
  _web3: any
) {
  const opts = {
    web3: connectProvides.usedWeb3,
    address: accInfo.owner,
    keySeed:
      accInfo.keySeed ||
      sdk.GlobalAPI.KEY_MESSAGE.replace(
        "${exchangeAddress}",
        exchangeAddress
      ).replace("${nonce}", (accInfo.nonce - 1).toString()),
    walletType: sdk.ConnectorNames.MetaMask,
    accountId: Number(accInfo.accountId),
    chainId: sdk.ChainId.MAINNET,
  };
  console.log(accInfo, opts);
  // debugger; // (sdk.generateKeyPair);
  const eddsaKey = await sdk.generateKeyPair(opts);

  console.log("eddsaKey", eddsaKey);
  return eddsaKey;
};

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
      // web3,
      chainId,
    }: {
      accounts: string;
      provider: any;
      // web3: any;
      chainId: ChainId | "unknown";
    }) => {
      const address = accounts[0];

      // console.log(web3);

      const { exchangeInfo } = await LoopringAPI.exchangeAPI.getExchangeInfo();

      console.log("exchangeInfo", exchangeInfo);
      const { accInfo } = await LoopringAPI.exchangeAPI.getAccount({
        owner: address,
      });

      console.log("accInfo", accInfo);

      const eddsaKey = await signatureKeyPairMock(
        exchangeInfo.exchangeAddress,
        accInfo,
        provider
      );
      console.log("eddsaKey:", eddsaKey.sk);

      console.log("After connect >>,network part done: step2 check account");
    },
  });
}
