import { TokenNetwork } from "./TokenNetwork";
import type { TokenInfo } from "../services/type";
import { cn } from "../lib/utils";
import { Block } from "./Block";
import { SkeletonWrapper } from "./SkeletonWrapper";
import { formatTokenAmount } from "../utils";

interface TokenAmountProps {
  token: TokenInfo;
  amount: string;
  label: React.ReactNode;
  className?: string;
}
export const SwapTokenBalance = ({
  token,
  amount,
  label,
  className,
}: TokenAmountProps) => {
  if (!token) return null;
  const amountFormatted = formatTokenAmount(amount, token.token_decimals);
  return (
    <Block className={cn("space-y-4", className)}>
      <p>{label}</p>
      <TokenNetwork token={token} />
      <div className="flex items-center gap-2">
        <SkeletonWrapper isLoading={+amount === 0}>
          <p>{amountFormatted}</p>
        </SkeletonWrapper>
        <p className="text-white/48"> {token.token_symbol}</p>
      </div>
    </Block>
  );
};
