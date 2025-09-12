import { useMemo, useState } from "react";
import type { NetworkInfo, TokenInfo } from "../services/type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { TokenNetwork } from "./TokenNetwork";

interface TokenDialogProps {
  trigger: React.ReactNode;
  tokens: TokenInfo[];
  onSelect: (token: TokenInfo) => void;
  networks: NetworkInfo[];
  tokenSelected: TokenInfo | null;
}

const ALL_NETWORK_OPTION: NetworkInfo = {
  network_id: "All",
  name: "All Chains",
  logo_uri: "/icons/all-network.svg",
  symbol: "",
  type: "",
};
const TokenItem = ({
  token,
  onSelect,
  isSelected,
}: {
  token: TokenInfo;
  onSelect: (token: TokenInfo) => void;
  isSelected: boolean;
}) => {
  return (
    <div
      className={`flex p-2 items-center gap-4 hover:bg-white/9 rounded-sm cursor-pointer ${
        isSelected ? "bg-white/9" : ""
      }`}
      onClick={() => onSelect(token)}
    >
      <TokenNetwork token={token} />
      <div>
        <p className="text-white">{token.token_name}</p>
        <p className="text-white/48 text-xs">{token.token_symbol}</p>
      </div>
    </div>
  );
};

const NetworkItem = ({
  network,
  onSelect,
  isSelected,
}: {
  network: NetworkInfo;
  onSelect: (network: NetworkInfo) => void;
  isSelected: boolean;
}) => {
  return (
    <div
      className={`flex p-2 items-center gap-2 hover:bg-white/9 rounded-sm cursor-pointer ${
        isSelected ? "bg-white/9" : ""
      }`}
      onClick={() => onSelect(network)}
    >
      <img
        src={network.logo_uri}
        alt={network.name}
        width={32}
        height={32}
        className="rounded-full"
      />
      <p className="text-white">{network.name}</p>
    </div>
  );
};

export const TokenDialog: React.FC<TokenDialogProps> = ({
  trigger,
  tokens,
  onSelect,
  networks,
  tokenSelected,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkInfo | null>(
    ALL_NETWORK_OPTION
  );

  const listTokens = useMemo(() => {
    if (selectedNetwork?.network_id === ALL_NETWORK_OPTION.network_id)
      return tokens;
    return tokens.filter(
      (token) => token.network_id === selectedNetwork?.network_id
    );
  }, [selectedNetwork]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={() => setOpen(true)} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="">
          <DialogTitle className="text-xl font-thin mt-2 pl-3">
            Select a Token
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex gap-4 border-t border-white/20 px-2">
          <div className="mt-2 space-y-1">
            <NetworkItem
              key="all"
              network={ALL_NETWORK_OPTION}
              onSelect={() => {
                setSelectedNetwork(ALL_NETWORK_OPTION);
              }}
              isSelected={
                selectedNetwork?.network_id === ALL_NETWORK_OPTION.network_id
              }
            />
            {networks.map((network) => (
              <NetworkItem
                key={network.network_id}
                network={network}
                onSelect={() => {
                  setSelectedNetwork(network);
                }}
                isSelected={selectedNetwork?.network_id === network.network_id}
              />
            ))}
          </div>
          <div className="mt-2 space-y-1 border-l flex-1 border-white/20 pl-4 h-[40vh] overflow-y-auto">
            {listTokens.map((token) => (
              <TokenItem
                key={token.token_id}
                token={token}
                onSelect={() => {
                  onSelect(token);
                  setOpen(false);
                }}
                isSelected={tokenSelected?.token_id === token.token_id}
              />
            ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
