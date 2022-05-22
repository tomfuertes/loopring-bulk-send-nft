const accounts: Array<string> = [
  // "0x000000000000000000000000000000000000dead",
  // "nftspike.loopring.eth",
];

export default () => {
  let account: string = accounts.shift()!;
  while (!!account && !!localStorage.getItem(account)) {
    account = accounts.shift()!;
  }
  return account;
};
