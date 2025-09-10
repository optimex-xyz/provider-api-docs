export const IS_TESTNET = import.meta.env.VITE_IS_TESTNET === "true";

export const API_KEY = import.meta.env.VITE_OPTIMEX_API_KEY;

export const TRADE_TIMEOUT = Number(import.meta.env.VITE_TRADE_TIMEOUT);
export const SCRIPT_TIMEOUT = Number(import.meta.env.VITE_SCRIPT_TIMEOUT);

export const BASE_URL = import.meta.env.VITE_OPTIMEX_BASE_URL;

export const FEE_IN_BPS = import.meta.env.VITE_FEE_IN_BPS;

export const AFFILIATE_INFO = [
  {
    provider: import.meta.env.VITE_AFFILIATE_PROVIDER,
    rate: FEE_IN_BPS,
    receiver: import.meta.env.VITE_AFFILIATE_RECEIVER_ADDRESS,
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

export const DEFAULT_FEE_RATE_SETTINGS = {
  multiple_fee_rate: 1.5,
  max_fee_rate: 10,
  default_fee_rate: 3,
};

export const RPC_URL: Partial<Record<SUPPORTED_NETWORK, string>> = {
  [SUPPORTED_NETWORK.ETHEREUM]: "https://eth-mainnet.public.blastapi.io",
  [SUPPORTED_NETWORK.ETHEREUM_SEPOLIA]:
    "https://eth-sepolia.public.blastapi.io",
};

export const DEFAULT_TOKENS = {
  BTC: ["tBTC", "BTC"],
  ETH: ["ETH"],
};

export const NATIVE_TOKEN_ADDRESS = "native";
