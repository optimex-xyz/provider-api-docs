import { OptimexIcon } from "../../icons";
import { WalletConnect } from "../WalletConnect";

export const Header = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <OptimexIcon className='w-[138px] h-[32px] my-auto' />
      <WalletConnect />
    </div>
  );
};