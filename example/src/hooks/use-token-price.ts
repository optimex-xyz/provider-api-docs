import { useQuery } from "@tanstack/react-query";
import BeDappServiceAPI from "../services/TokenService";

export const useTokenPrice = ({ tokenSymbol }: { tokenSymbol: string }) => {
  return useQuery({
    queryKey: ["tokenPrice", tokenSymbol],
    queryFn: () => BeDappServiceAPI.getTokenPrice({ tokenSymbol }),
  });
};
