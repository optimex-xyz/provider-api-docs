import type { ISwapDetail } from "../../services/type";

import { Block, IconLabel } from "../../components";
import { HandCoins } from "lucide-react";
import { SkeletonWrapper } from "../../components/SkeletonWrapper";

interface MinAmountProps {
  data: ISwapDetail;
}
export const MinAmount = ({ data }: MinAmountProps) => {
  return (
    <Block className="flex w-full items-center justify-between">
      <IconLabel
        icon={<HandCoins className="size-4" />}
        label="Min. received amount"
      />
      <SkeletonWrapper isLoading={!data.min_amount_out}>
        <p>{data.min_amount_out}</p>
      </SkeletonWrapper>
    </Block>
  );
};
