import React from "react";
import { provider } from "web3-core";
import {
  walletServices,
  Commands,
  ErrorType,
  ProcessingType,
} from "@loopring-web/web3-provider";
export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,
}
export function useConnectHook({
  // handleChainChanged,
  handleConnect,
  handleAccountDisconnect,
  handleError,
  handleProcessing,
}: {
  handleProcessing?: (props: {
    type: keyof typeof ProcessingType;
    opts: any;
  }) => void;
  handleError?: (props: {
    type: keyof typeof ErrorType;
    errorObj: any;
  }) => void;
  // handleChainChanged?: (chainId: string) => void,
  handleConnect?: (prosp: {
    accounts: string;
    provider: provider;
    chainId: ChainId | 5;
  }) => void;
  handleAccountDisconnect?: () => void;
}) {
  const subject = React.useMemo(() => walletServices.onSocket(), []);
  React.useEffect(() => {
    const subscription = subject.subscribe(
      ({ data, status }: { status: keyof typeof Commands; data?: any }) => {
        switch (status) {
          case "Error":
            if (handleError) {
              handleError(data);
            }
            break;
          case "Processing":
            if (handleProcessing) {
              handleProcessing(data);
            }
            break;
          // case 'ChangeNetwork':
          //     // {chainId} = data ? data : {chainId: undefined};
          //     handleChainChanged ? handleChainChanged(data.chainId) : undefined;
          //     break
          case "ConnectWallet": // provider, accounts, chainId, networkId
            console.log("data", data);
            const { accounts, provider, chainId } = data
              ? data
              : {
                  accounts: undefined,
                  provider: undefined,
                  chainId: 5,
                };
            if (handleConnect) {
              console.log("chainid", chainId);
              handleConnect({ accounts, provider, chainId });
            }
            break;
          case "DisConnect":
            if (handleAccountDisconnect) {
              handleAccountDisconnect();
            }
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [subject]);
}
