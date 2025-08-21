import { getWalletClient } from "@wagmi/core";

import { config } from "../main";

import { BrowserProvider } from "ethers";

export const useWagmiSigner = () => {
  return async () => {
    const client = await getWalletClient(config);
    const provider = client
      ? new BrowserProvider(client?.transport)
      : undefined;
    return await provider?.getSigner();
  };
};
