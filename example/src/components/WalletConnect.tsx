import React, { useCallback, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import { SUPPORTED_NETWORK, IS_TESTNET } from "../config";
import { useWallet } from "../context";
import { truncateAddress } from "../utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import { BTCIcon } from "../icons";
import { unisatWallet } from "../wallets/UnisatWallet";
import { LogOut } from "lucide-react";
import { useBtcBalance } from "../hooks";
import { ethers } from "ethers";

interface WalletConnectProps {}

interface BTCWalletSectionProps {
  btcAddress: string;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

interface ChainButtonProps {
  chain: any;
  onClick: () => void;
}

interface AccountButtonProps {
  account: any;
  onClick: () => void;
}

const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const BTCWalletSection: React.FC<BTCWalletSectionProps> = ({
  btcAddress,
  onConnect,
  onDisconnect,
}) => {
  const { data: btcBalance } = useBtcBalance(btcAddress);

  return (
    <div className="flex gap-1">
      {btcAddress && (
        <div className="text-black flex items-center gap-2 text-md font-bold">
          BTC: {truncateAddress(btcAddress)}
        </div>
      )}
      {btcAddress && (
        <Button
          onClick={() => (btcAddress ? onDisconnect() : onConnect())}
          variant="outline"
        >
          <BTCIcon />
          {IS_TESTNET ? "BTC Testnet" : "BTC"}
        </Button>
      )}
      <Button
        onClick={() => (btcAddress ? onDisconnect() : onConnect())}
        variant="outline"
      >
        {btcAddress
          ? `${truncateAddress(btcAddress)} (${ethers.formatUnits(
              BigInt(btcBalance || 0),
              8
            )} ${IS_TESTNET ? "tBTC" : "BTC"})`
          : "Connect BTC Wallet"}
        {btcAddress && <LogOut />}
      </Button>
    </div>
  );
};

const ChainButton: React.FC<ChainButtonProps> = ({ chain, onClick }) => (
  <Button
    variant="outline"
    onClick={onClick}
    className="flex items-center gap-2"
  >
    {chain.hasIcon && (
      <div
        className="size-5 rounded-full overflow-hidden mr-1"
        style={{ background: chain.iconBackground }}
      >
        {chain.iconUrl && (
          <img
            alt={chain.name ?? "Chain icon"}
            src={chain.iconUrl}
            className="size-full"
          />
        )}
      </div>
    )}
    {chain.name}
  </Button>
);

const AccountButton: React.FC<AccountButtonProps> = ({ account, onClick }) => (
  <Button variant="outline" onClick={onClick}>
    {account.displayName}
    {account.displayBalance && ` (${account.displayBalance})`}
  </Button>
);

// EVM Wallet Section Component
const EVMWalletSection = () => (
  <ConnectButton.Custom>
    {({
      account,
      chain,
      openAccountModal,
      openChainModal,
      openConnectModal,
      authenticationStatus,
      mounted,
    }) => {
      const ready = mounted && authenticationStatus !== "loading";
      const connected = ready && account && chain;

      if (!connected) {
        return (
          <Button variant="outline" onClick={openConnectModal}>
            Connect EVM Wallet
          </Button>
        );
      }

      if (chain.unsupported) {
        return (
          <Button variant="destructive" onClick={openChainModal}>
            Wrong network
          </Button>
        );
      }

      return (
        <div className="flex gap-1">
          <ChainButton chain={chain} onClick={openChainModal} />
          <AccountButton account={account} onClick={openAccountModal} />
        </div>
      );
    }}
  </ConnectButton.Custom>
);

export const WalletConnect: React.FC<WalletConnectProps> = () => {
  const { setBtcWallet, btcAddress } = useWallet();

  const connectBTCWallet = useCallback(async () => {
    try {
      const network = IS_TESTNET
        ? SUPPORTED_NETWORK.BTC_TESTNET
        : SUPPORTED_NETWORK.BTC;
      const { address, compressedPublicKey = "" } = await unisatWallet.connect(
        network
      );
      setBtcWallet(address, compressedPublicKey);
    } catch (error) {
      console.warn("Error connecting BTC wallet:", error);
    }
  }, [setBtcWallet]);

  // Auto reconnect BTC wallet
  useEffect(() => {
    connectBTCWallet();
  }, []);

  const disconnectBTCWallet = async () => {
    try {
      setBtcWallet("", "");
      unisatWallet.disconnect();
    } catch (error) {
      // Silent fail for disconnect
      console.warn("Error disconnecting BTC wallet:", error);
    }
  };

  return (
    <div className="flex gap-4">
      <BTCWalletSection
        btcAddress={btcAddress}
        onConnect={connectBTCWallet}
        onDisconnect={disconnectBTCWallet}
      />

      <EVMWalletSection />
    </div>
  );
};
