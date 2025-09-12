import type { ISwapDetail } from "../../services/type";
import { SwapTokenInfo } from "./SwapTokenInfo";
import { SwapRate } from "./SwapRate";
import { SwapStatus } from "./SwapStatus";
import { WalletAddress } from "./WalletAddress";
import { MinAmount } from "./MinAmount";

interface SwapDetailProps {
  data: ISwapDetail;
}

export const SwapDetail = ({ data }: SwapDetailProps) => {
  return (
    <div className="flex flex-col w-full justify-center items-center gap-4">
      <SwapTokenInfo swapData={data} />
      <SwapRate data={data} />
      <MinAmount data={data} />
      <WalletAddress swapData={data} />
      <SwapStatus data={data} />
    </div>
  );
};
