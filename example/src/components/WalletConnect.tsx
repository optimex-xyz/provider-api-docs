import React, { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { OkxWallet } from "../wallets/OkxWallet";
import { SUPPORTED_NETWORK, IS_TESTNET } from "../config";
import { useWallet } from "../context";
import { truncateAddress } from "../utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface WalletConnectProps {}

export const okxWallet = new OkxWallet();

export const WalletConnect: React.FC<WalletConnectProps> = ({}) => {
  const { setBtcWallet, btcAddress } = useWallet();

  const connectBTCWallet = async (throwError = true) => {
    try {
      const { address, compressedPublicKey } = await okxWallet.connect(
        IS_TESTNET ? SUPPORTED_NETWORK.BTC_TESTNET : SUPPORTED_NETWORK.BTC
      );
      setBtcWallet(address, compressedPublicKey);
    } catch (error) {
      if (!throwError) return;
      toast.error(
        error instanceof Error ? error.message : "Unknown error occurred",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  const disconnectBTCWallet = async () => {
    try {
      setBtcWallet("", "");
      okxWallet.disconnect();
    } catch (error) {}
  };

  // auto reconnect btc
  useEffect(() => {
    connectBTCWallet(false);
  }, []);

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <p className="text-md text-center font-medium text-gray-700 mb-6">
        Connect your wallet to start swapping
      </p>
      <div className="flex flex-col items-center gap-4 justify-center">
        <div className="flex gap-2">
          {btcAddress && (
            <div className="text-black flex items-center gap-2 text-md font-bold">
              BTC: {truncateAddress(btcAddress)}
            </div>
          )}
          <button
            onClick={() =>
              btcAddress ? disconnectBTCWallet() : connectBTCWallet()
            }
            className="px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-[12px] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {btcAddress ? "Disconnect" : "Connect BTC (OKX)"}
          </button>
        </div>

        <ConnectButton label="Connect EVM" />
      </div>
    </div>
  );
};
