import { useQuery } from "@tanstack/react-query";
import type { IGetAvailableTokensResponse } from "../services/type";
import Service from "../services/SwapService";
import { QUERY_KEYS } from "../constants";

export const useListTokens = () => {
  return useQuery<IGetAvailableTokensResponse, Error>({
    queryKey: [QUERY_KEYS.TOKENS],
    queryFn: () => Service.getAvailableTokens(),
  });
};
