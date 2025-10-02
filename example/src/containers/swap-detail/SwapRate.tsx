import { ArrowRightLeft, Percent } from "lucide-react";
import type { ISwapDetail } from "../../services/type";
import { useMemo } from "react";
import { ethers } from "ethers";
import { useFindToken } from "../../hooks";
import { Block, IconLabel } from "../../components";
import { SkeletonWrapper } from "../../components/SkeletonWrapper";

interface SwapRateProps {
  data: ISwapDetail;
}
export const SwapRate = ({ data }: SwapRateProps) => {
  const { data: fromToken } = useFindToken(
    data.from_token.token_id,
    data.from_token.chain
  );
  console.log("🚀 ~ SwapRate ~ fromToken:", fromToken);
  const { data: toToken } = useFindToken(
    data.to_token.token_id,
    data.to_token.chain
  );
  // console.log("🚀 ~ SwapRate ~ toToken:", toToken);
  const exchangeRate = useMemo(() => {
    const _amountIn = +ethers.formatUnits(
      data.amount_before_fees || data.amount_after_fees,
      fromToken?.token_decimals
    );

    const _amountOut = +ethers.formatUnits(
      data.best_indicative_quote,
      toToken?.token_decimals
    );
    console.log("🚀 ~ SwapRate ~ _amountOut:", _amountOut);
    const rate = _amountOut / _amountIn;
    return rate;
  }, [
    data.amount_after_fees,
    data.best_indicative_quote,
    fromToken?.token_decimals,
    toToken?.token_decimals,
  ]);
  return (
    <Block className="flex w-full justify-between">
      <IconLabel icon={<Percent className="size-4" />} label="Rate" />
      <SkeletonWrapper
        isLoading={!Number.isFinite(exchangeRate)}
        className="w-24"
      >
        <div className="flex items-center gap-2">
          1 {fromToken?.token_symbol} <ArrowRightLeft className="size-4" />
          {exchangeRate} {toToken?.token_symbol}
        </div>
      </SkeletonWrapper>
    </Block>
  );
};
