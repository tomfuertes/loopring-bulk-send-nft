import React, { ChangeEvent, useState } from "react";
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

  const [accounts, accountsProvider] = React.useState<string[]>([]);

  const queueAccounts = (event: ChangeEvent<HTMLTextAreaElement>) => {
    // debugger;
    accountsProvider(
      event.target.value
        .split("\n")
        .map((account) => account && account.trim())
        .filter(Boolean)
        .map((account) => account.replace(/[,\s]/g, ""))
    );
  };
  const AccountList = () => {
    return (
      <ul>
        {accounts.map((account) => (
          <li>{account}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="App">
      <h1>Hello React</h1>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <textarea onChange={queueAccounts}></textarea>

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

        <AccountList />
      </div>
    </div>
  );
}
