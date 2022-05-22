import * as sdk from "@loopring-web/loopring-sdk";
import { connectProvides } from "@loopring-web/web3-provider";
import LoopringAPI from "./loopring";

import sendTo from "./accounts";

import { ChainId, useConnectHook } from "./useConnectHook";

const signatureKeyPairMock = async function (
  exchangeAddress: string,
  accInfo: sdk.AccountInfo
) {
  console.log("accInfo", accInfo);
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
    chainId: sdk.ChainId.GOERLI,
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

      const { exchangeInfo } = await LoopringAPI.exchangeAPI.getExchangeInfo();

      console.log("exchangeInfo", exchangeInfo);
      const { accInfo } = await LoopringAPI.exchangeAPI.getAccount({
        owner: address,
      });

      console.log("accInfo", accInfo);

      const eddsaKey = await signatureKeyPairMock(
        exchangeInfo.exchangeAddress,
        accInfo
      );
      console.log("eddsaKey:", eddsaKey.sk);

      const { apiKey } = await LoopringAPI.userAPI.getUserApiKey(
        {
          accountId: accInfo.accountId,
        },
        eddsaKey.sk
      );

      console.log("apiKey:", apiKey);

      const { userNFTBalances } = await LoopringAPI.userAPI.getUserNFTBalances(
        { accountId: accInfo.accountId, limit: 20 },
        apiKey
      );

      console.log(userNFTBalances);

      let transferAccount: string = "";
      for (const nft of userNFTBalances) {
        console.log("nft", nft);
        console.log("sendTo", sendTo);

        while ((transferAccount = sendTo.shift()!)) {
          console.log("transferAccount", transferAccount);

          if (transferAccount.endsWith(".eth")) {
            const res = await LoopringAPI.walletAPI.getAddressByENS({
              fullName: transferAccount,
            });
            if (res.address) {
              transferAccount = res.address.toString();
            } else {
              console.error("ens not found: transferAccount", transferAccount);
            }
          }

          const storageId = await LoopringAPI.userAPI.getNextStorageId(
            {
              accountId: accInfo.accountId,
              sellTokenId: nft.tokenId,
            },
            apiKey
          );

          console.log(storageId);

          const fee = await LoopringAPI.userAPI.getNFTOffchainFeeAmt(
            {
              accountId: accInfo.accountId,
              requestType: sdk.OffchainNFTFeeReqType.NFT_TRANSFER,
              amount: "0",
            },
            apiKey
          );

          console.log("fee:", fee);
          // const opts = ;

          // console.log("opts", opts);

          const transferResult = await LoopringAPI.userAPI.submitNFTInTransfer({
            request: {
              exchange: exchangeInfo.exchangeAddress,
              fromAccountId: accInfo.accountId,
              fromAddress: accInfo.owner,
              toAccountId: 0, // toAccountId is not required, input 0 as default
              toAddress: transferAccount!,
              token: {
                tokenId: nft.tokenId,
                nftData: nft.nftData!,
                amount: "1",
              },
              maxFee: {
                tokenId: 0,
                amount: fee.fees["ETH"].fee,
              },
              storageId: storageId.offchainId,
              validUntil: Math.round(Date.now() / 1000) + 30 * 86400,
            },
            web3: connectProvides.usedWeb3!,
            chainId: sdk.ChainId.GOERLI,
            walletType: sdk.ConnectorNames.MetaMask,
            eddsaKey: eddsaKey.sk,
            apiKey,
          });
          console.log("transfer Result:", transferResult);
          // localStorage.setItem(transferAccount, "true");
        }
      }

      console.log("After connect >>,network part done: step2 check account");
    },
  });
}
