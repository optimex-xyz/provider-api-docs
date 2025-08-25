import { getWalletClient } from "@wagmi/core";

import { BrowserProvider } from "ethers";
import { wagmiConfig } from "../main";

export const useWagmiSigner = () => {
  const getSigner = async () => {
    const client = await getWalletClient(wagmiConfig);
    const provider = client
      ? new BrowserProvider(client?.transport)
      : undefined;
    return await provider?.getSigner();
  };
  return { getSigner };
};
