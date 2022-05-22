# loopring-bulk-send-nft

Why? I needed a quick way to send single NFTs ?from a pack? to multiple addresses (e.g., twitter or reddit giveaway) via metamask and didn't want to use the modal to copy/paste a bunch.

1) Have a single NFT in your profile
2) Populate `./src/accounts.ts` with a list accounts (`"0x1337420...", "demo.loopring.eth"`)
3) `npm start`
4) Click Metamask -> Sign
5) Sign messages as they popup and iterate through the array in `./accounts.ts`
