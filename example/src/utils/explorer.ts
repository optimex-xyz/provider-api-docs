const EXPLORER_URL = {
  ethereum: "https://etherscan.io",
  ethereum_sepolia: "https://sepolia.etherscan.io",
  bitcoin: "https://mempool.space",
  bitcoin_testnet: "https://mempool.space/testnet4",
  base: "https://basescan.org",
  base_sepolia: "https://sepolia.basescan.org",
  optimism: "https://optimistic.etherscan.io",
  optimism_sepolia: "https://sepolia-optimism.etherscan.io",
  arbitrum: "https://arbiscan.io",
  arbitrum_sepolia: "https://sepolia.arbiscan.io",
  bsc: "https://bscscan.com",
  bsc_testnet: "https://testnet.bscscan.com",
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
