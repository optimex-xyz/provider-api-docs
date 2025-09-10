import { useQuery } from "@tanstack/react-query";
import { BTCService } from "../services";

const BTC_BALANCE_QUERY_KEY = "btcBalance";

export const useBtcBalance = (btcAddress: string) => {
  return useQuery({
    queryKey: [BTC_BALANCE_QUERY_KEY, btcAddress],
    queryFn: async () => {
      const data = await BTCService.getBalance(btcAddress);
      return data;
    },
    enabled: !!btcAddress,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
};
