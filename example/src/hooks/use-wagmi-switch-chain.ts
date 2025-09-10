import { getChainId, switchChain as wagmiSwitchChain } from "@wagmi/core";
import { wagmiConfig } from "../main";
import type { TokenInfo } from "../services/SwapService";
import { delay } from "../utils";
import { CHAIN_ID, SUPPORTED_NETWORK } from "../config";

export const useWagmiSwitchChain = () => {
  const switchChain = async (token: TokenInfo) => {
    let id = Number(token.chain_id);
    // TODO: Remove this once we have a chain_id in token
    if (!id) {
      id = CHAIN_ID[token.network_id as SUPPORTED_NETWORK]!;
    }
    const currentChainId = getChainId(wagmiConfig);
    if (currentChainId === id || token.network_type !== "EVM") return;
    await wagmiSwitchChain(wagmiConfig, { chainId: id as any });
    //TODO: remove this delay
    await delay(1500);
  };
  return { switchChain };
};
