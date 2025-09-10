import { useQuery } from "@tanstack/react-query";
import type { IGetAvailableTokensResponse } from "../services/SwapService";
import Service from "../services/SwapService";

export const useListTokens = () => {
  return useQuery<IGetAvailableTokensResponse, Error>({
    queryKey: ["tokens"],
    queryFn: () => Service.getAvailableTokens(),
  });
};
