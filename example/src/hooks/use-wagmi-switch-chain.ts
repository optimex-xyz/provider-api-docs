import { getChainId, switchChain as wagmiSwitchChain } from "@wagmi/core";
import { wagmiConfig } from "../main";
import type { TokenInfo } from "../services/SwapService";
import { delay } from "../utils";

export const useWagmiSwitchChain = () => {
  const switchChain = async (token: TokenInfo) => {
    const id = Number(token.chain_id);
    const currentChainId = getChainId(wagmiConfig);
    if (currentChainId === id || token.network_type !== "EVM") return;
    await wagmiSwitchChain(wagmiConfig, { chainId: id as any });
    //TODO: remove this delay
    await delay(1500);
  };
  return { switchChain };
};
