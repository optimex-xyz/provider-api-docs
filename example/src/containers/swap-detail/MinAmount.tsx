import type { ISwapDetail } from "../../services/type";

import { Block, IconLabel } from "../../components";
import { HandCoins } from "lucide-react";
import { SkeletonWrapper } from "../../components/SkeletonWrapper";
import { ethers } from "ethers";
import { useFindToken } from "../../hooks";

interface MinAmountProps {
  data: ISwapDetail;
}
export const MinAmount = ({ data }: MinAmountProps) => {
  const { data: toToken } = useFindToken(
    data.to_token.token_id,
    data.to_token.chain
  );
  return (
    <Block className="flex w-full items-center justify-between">
      <IconLabel
        icon={<HandCoins className="size-4" />}
        label="Min. received amount"
      />
      <SkeletonWrapper isLoading={!data.min_amount_out}>
        <p>
          {ethers.formatUnits(data.min_amount_out, toToken?.token_decimals)}{" "}
          {toToken?.token_symbol}
        </p>
      </SkeletonWrapper>
    </Block>
  );
};
