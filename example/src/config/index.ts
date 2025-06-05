export const IS_TESTNET = true;

export const API_KEY = "your-api-key-here";

export const TRADE_TIMEOUT = 10; // mins
export const SCRIPT_TIMEOUT = 60; // mins

export const BASE_URL = IS_TESTNET
  ? "https://provider-stg.bitdex.xyz"
  : "https://ks-provider.optimex.xyz";

export const FEE_IN_BPS = "25"; // 0.25%

export const AFFILIATE_INFO = [
  {
    provider: "KyberSwap",
    rate: FEE_IN_BPS,
    receiver: "0x53beBc978F5AfC70aC3bFfaD7bbD88A351123723",
    network: "ethereum",
  },
];

export enum SUPPORTED_NETWORK {
  BTC = "bitcoin",
  BTC_TESTNET = "bitcoin_testnet",
  ETHEREUM = "ethereum",
  ETHEREUM_SEPOLIA = "ethereum_sepolia",
}

export const CHAIN_ID: Partial<Record<SUPPORTED_NETWORK, number>> = {
  [SUPPORTED_NETWORK.ETHEREUM]: 1,
  [SUPPORTED_NETWORK.ETHEREUM_SEPOLIA]: 11155111,
};
