const EXPLORER_URL = {
  ethereum: "https://etherscan.io",
  ethereum_sepolia: "https://sepolia.etherscan.io",
  bitcoin: "https://mempool.space",
  bitcoin_testnet: "https://mempool.space/testnet",
};
export const toTxBlockExplorer = (
  networkId: string,
  value: string,
  type: "tx" | "address"
) => {
  return `${
    EXPLORER_URL[networkId as keyof typeof EXPLORER_URL]
  }/${type}/${value}`;
};
