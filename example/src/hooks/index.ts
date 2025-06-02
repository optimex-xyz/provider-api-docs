import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import Service, {
  type SwapQuote,
  type TokenInfo,
} from "../services/SwapService";
import { FEE_IN_BPS } from "../config";

export const useAvailableTokens = () => {
  return useQuery<TokenInfo[], Error>({
    queryKey: ["tokens"],
    queryFn: () => Service.getAvailableTokens(),
  });
};

export const useSwapQuote = (
  fromToken: TokenInfo | null,
  toToken: TokenInfo | null,
  amount: string
) => {
  return useQuery<SwapQuote | null, Error>({
    queryKey: ["quote", fromToken?.token_id, toToken?.token_id, amount],
    queryFn: async () => {
      if (!fromToken || !toToken || !amount) return null;
      const amountInWei = ethers
        .parseUnits(amount, fromToken.token_decimals)
        .toString();
      return Service.getQuote({
        from_token_id: fromToken.token_id,
        to_token_id: toToken.token_id,
        from_token_amount: amountInWei,
        affiliate_fee_bps: FEE_IN_BPS,
      });
    },
    enabled: Boolean(fromToken && toToken && amount),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // 30 seconds
  });
};
