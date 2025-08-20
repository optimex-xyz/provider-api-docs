import { useQuery } from "@tanstack/react-query";
import type { TokenInfo } from "../services/SwapService";
import Service from "../services/SwapService";

export const useListTokens = () => {
  return useQuery<TokenInfo[], Error>({
    queryKey: ["tokens"],
    queryFn: () => Service.getAvailableTokens(),
  });
};
