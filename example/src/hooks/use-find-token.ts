import { useQuery } from "@tanstack/react-query";
import { useListTokens } from "./use-tokens";
import { QUERY_KEYS } from "../constants";

export const useFindToken = (tokenId: string, chainId: string) => {
  const { data } = useListTokens();
  return useQuery({
    queryKey: [QUERY_KEYS.TOKEN, tokenId, chainId],
    queryFn: () => {
      return data?.tokens.find(
        (token) => token.token_id === tokenId && token.network_id === chainId
      );
    },
    enabled: !!data,
  });
};
