import { useQuery } from "@tanstack/react-query";
import type { SwapQuote, TokenInfo } from "../services/SwapService";
import { ethers } from "ethers";
import Service from "../services/SwapService";
import { FEE_IN_BPS } from "../config";

export const useGetQuote = ({
  fromToken,
  toToken,
  amount,
  from_user_address,
  to_user_address,
  user_refund_address,
}: {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  amount: string;
  from_user_address: string;
  to_user_address: string;
  user_refund_address: string;
}) => {
  return useQuery<SwapQuote | null, Error>({
    queryKey: ["quote", fromToken?.token_id, toToken?.token_id, amount],
    queryFn: async () => {
      if (!fromToken || !toToken || !amount) return null;
      const amountInWei = ethers
        .parseUnits(amount, fromToken.token_decimals)
        .toString();
      return Service.getQuote({
        from_token_id: fromToken.token_id || "",
        to_token_id: toToken.token_id || "",
        from_token_amount: amountInWei,
        affiliate_fee_bps: FEE_IN_BPS,
        from_user_address,
        to_user_address,
        user_refund_address,
      });
    },
    enabled: !!fromToken && !!toToken && +amount > 0,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // 30 seconds
  });
};
