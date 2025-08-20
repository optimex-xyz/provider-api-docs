import React from "react";
import type { TokenInfo } from "../services/SwapService";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { TokenDialog } from "./TokenDialog";
import { IS_TESTNET, SUPPORTED_NETWORK } from "../config";
import { isBtcChain, truncateAddress } from "../utils";
import { useWallet } from "../context";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { unisatWallet } from "../wallets/UnisatWallet";

interface TokenSelectProps {
  tokens: TokenInfo[];
  value: TokenInfo | null;
  onTokenChange: (token: TokenInfo | null) => void;
  placeholder?: string;
  label: string;
  onAmountChange?: (amount: string) => void;
  amount?: string;
  networkId: string;
  walletAddress: string;
}

export const TokenSelect: React.FC<TokenSelectProps> = ({
  tokens,
  onTokenChange,
  value,
  label,
  onAmountChange,
  amount,
  networkId,
  walletAddress,
}) => {
  const { setBtcWallet } = useWallet();
  const { openConnectModal } = useConnectModal();
  const handleBTCConnect = async () => {
    const network = IS_TESTNET
      ? SUPPORTED_NETWORK.BTC_TESTNET
      : SUPPORTED_NETWORK.BTC;
    const { address, compressedPublicKey = "" } = await unisatWallet.connect(
      network
    );
    setBtcWallet(address, compressedPublicKey);
  };
  const handleEVMConnect = () => {
    openConnectModal?.();
  };

  const handleConnectWallet = () => {
    console.log({ networkId });
    if (isBtcChain(networkId)) {
      handleBTCConnect();
    } else {
      handleEVMConnect();
    }
  };
  return (
    <div className="flex flex-col gap-6 bg-white/4 p-4 rounded-sm">
      <label className="text-white/48 text-sm">{label}</label>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={value?.token_logo_uri}
            alt={value?.token_symbol}
            width={32}
            height={32}
          />

          <TokenDialog
            trigger={
              <div className="flex gap-1 cursor-pointer">
                <p>{value?.token_symbol}</p>
                <p className="text-white/48">({value?.network_name})</p>
              </div>
            }
            tokens={tokens}
            onSelect={onTokenChange}
          />
        </div>
        {walletAddress ? (
          <Button variant="outline" size="sm" className="text-sm font-light">
            {truncateAddress(walletAddress)}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-light"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </Button>
        )}
      </div>
      <Separator />
      <div>
        <Input
          value={amount}
          disabled={!onAmountChange}
          placeholder="0"
          className="dark:text-xl border-none outline-none focus-visible:ring-0 dark:bg-transparent"
          onChange={(e) => onAmountChange?.(e.target.value)}
        />
      </div>
    </div>
  );
};
