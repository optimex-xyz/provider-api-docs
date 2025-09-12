import { Loading } from "../components/Loading";
import { SwapDetail } from "../containers/swap-detail";
import { useQuerySwapDetail } from "../hooks";

export const SwapDetailPage = () => {
  const { data, isLoading } = useQuerySwapDetail();
  if (isLoading || !data) return <Loading message="Loading..." />;
  return (
    <div className="w-[36rem] mx-auto mt-20">
      <SwapDetail data={data} />
    </div>
  );
};
