import React from "react";
import "./styles.css";
import { useConnect } from "./useConnect";
import { walletServices, connectProvides } from "@loopring-web/web3-provider";

export default function App() {
  useConnect();
  const metaMask = async () => {
    walletServices.sendDisconnect("", "should new provider");
    await connectProvides.MetaMask({});
  };
  // const walletConnect = async () => {
  //   walletServices.sendDisconnect("", "should new provider");
  //   await connectProvides.WalletConnect({ account: undefined, darkMode: true });
  // };
  // const coinbase = async () => {
  //   walletServices.sendDisconnect("", "should new provider");
  //   await connectProvides.Coinbase({});
  // };
  const disconnect = () => {
    walletServices.sendDisconnect("", "disconnect");
  };
  return (
    <div className="App">
      <h1>Hello React</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={metaMask}>
          <img
            src="https://static.loopring.io/assets/svg/meta-mask.svg"
            alt="MetaMask"
            height="36"
          />
        </button>
        {/* <button onClick={walletConnect}>
          <img
            src="https://static.loopring.io/assets/svg/wallet-connect.svg"
            alt="walletConnect"
            height="36"
          />
        </button>
        <button onClick={coinbase}>
          <img
            src="https://static.loopring.io/assets/svg/coinbase-wallet.svg"
            alt="MetaMask"
            height="36"
          />
        </button> */}
        <button onClick={disconnect}>disconnect</button>
      </div>
    </div>
  );
}
