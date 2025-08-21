import { createContext, useContext, useState } from "react";
import type { ReactNode, FC } from "react";
import { useAccount, useDisconnect } from "wagmi";

// Types for wallet information
interface WalletState {
  btcAddress: string;
  btcPublicKey: string;
  evmAddress: string;
}

interface WalletContextType {
  btcAddress: string;
  btcPublicKey: string;
  evmAddress: string;
  setBtcWallet: (address: string, publicKey: string) => void;
  clearWallets: () => void;
  isConnected: boolean;
  disconnect: () => void;
}

// Initial state
const initialWalletState: WalletState = {
  btcAddress: "",
  btcPublicKey: "",
  evmAddress: "",
};

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Provider component
interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  const [walletState, setWalletState] =
    useState<WalletState>(initialWalletState);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const setBtcWallet = (address: string, publicKey: string) => {
    setWalletState((prev) => ({
      ...prev,
      btcAddress: address,
      btcPublicKey: publicKey,
    }));
  };

  const clearWallets = () => {
    setWalletState(initialWalletState);
    disconnect();
  };

  const value = {
    setBtcWallet,
    clearWallets,
    isConnected,
    disconnect,
    ...walletState,
    evmAddress: address as string,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// Custom hook for using the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
