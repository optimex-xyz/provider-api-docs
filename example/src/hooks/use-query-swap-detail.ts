import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Service from "../services/SwapService";
import { QUERY_KEYS } from "../constants";
import { DURATIONS } from "../constants/duration";

export const useQuerySwapDetail = () => {
  const { tradeId } = useParams();
  const tradeDetail = useQuery({
    queryKey: [QUERY_KEYS.SWAP_DETAIL, tradeId],
    queryFn: () => Service.getTradeStatus(tradeId || ""),
    refetchInterval: DURATIONS.FIVE_SECONDS,
    enabled: !!tradeId,
  });
  return tradeDetail;
};
