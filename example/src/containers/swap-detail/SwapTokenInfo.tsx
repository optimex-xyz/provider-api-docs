import { SwapTokenBalance } from "../../components/SwapTokenBalance";
import { useFindToken } from "../../hooks";
import type { ISwapDetail } from "../../services/type";

interface SwapOverviewProps {
  swapData: ISwapDetail;
}
export const SwapTokenInfo = ({ swapData }: SwapOverviewProps) => {
  const { data: fromToken } = useFindToken(
    swapData.from_token.token_id,
    swapData.from_token.chain
  );
  const { data: toToken } = useFindToken(
    swapData.to_token.token_id,
    swapData.to_token.chain
  );
  if (!fromToken || !toToken) return null;
  return (
    <div className="flex gap-4 w-full">
      <SwapTokenBalance
        label="From"
        className="flex-1"
        token={fromToken}
        amount={swapData.amount_before_fees || swapData.amount_after_fees}
      />
      <SwapTokenBalance
        label="To"
        className="flex-1"
        token={toToken}
        amount={swapData.receiving_amount}
      />
    </div>
  );
};
