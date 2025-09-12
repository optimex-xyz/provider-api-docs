import { Link } from "react-router-dom";
import { OptimexIcon } from "../../icons";
import { WalletConnect } from "../WalletConnect";

export const Header = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <Link to="/">
        <OptimexIcon className="w-[138px] h-[32px] my-auto" />
      </Link>
      <WalletConnect />
    </div>
  );
};
