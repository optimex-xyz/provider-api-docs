import { useFindToken } from "../../hooks";
import type { ISwapDetail, IToToken } from "../../services/type";
import { truncateAddress } from "../../utils";
import { Block } from "../../components";
import { CopyToClipboard } from "../../components/CopyToClipboard";

const WalletAddressItem = ({
  label,
  address,
  token,
}: {
  label: string;
  address: string;
  token: IToToken;
}) => {
  const { data: tokenInfo } = useFindToken(token.token_id, token.chain);
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img
          src={tokenInfo?.network_logo_uri}
          alt={tokenInfo?.network_name}
          className="size-4"
        />
        <p>{label}</p>
      </div>
      <div className="flex items-center gap-2">
        <p>{truncateAddress(address)}</p>
        <CopyToClipboard text={address} />
      </div>
    </div>
  );
};

interface WalletAddressProps {
  swapData: ISwapDetail;
}
export const WalletAddress = ({ swapData }: WalletAddressProps) => {
  return (
    <Block className="flex flex-col w-full justify-between space-y-4">
      <WalletAddressItem
        token={swapData.from_token}
        label="Sending address"
        address={swapData.from_user_address}
      />
      <WalletAddressItem
        token={swapData.to_token}
        label="Receiving address"
        address={swapData.user_receiving_address}
      />
    </Block>
  );
};
