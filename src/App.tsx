import React, { ChangeEvent, useState } from "react";
import "./styles.css";
import { useConnect } from "./useConnect";
import { walletServices, connectProvides } from "@loopring-web/web3-provider";

const accounts: Array<string> = [];

export default function App() {
  useConnect(accounts);
  console.log("rendered", new Date());
  const [sendTo, sendToProvider] = React.useState<string[]>(accounts);

  // const history = [];

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

  const queueAccounts = (event: ChangeEvent<HTMLTextAreaElement>) => {
    // debugger;
    const list = [
      ...new Set<string>(
        event.target.value
          .split("\n")
          .map((account) => account && account.trim())
          .filter(Boolean)
          .map((account) => account.replace(/[,\s]/g, ""))
      ),
    ];
    accounts.length = 0;
    accounts.push(...list);
    sendToProvider(list);
  };
  const AccountList = () => {
    return (
      <ul>
        {sendTo.map((account) => (
          <li key={account}>{account}</li>
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

        {AccountList()}
      </div>
    </div>
  );
}
