import { useState, useEffect, useCallback } from "react";
import type { TokenInfo } from "../services/SwapService";
import { DEFAULT_TOKENS, SUPPORTED_NETWORK } from "../config";
import { isBtcChain } from "../utils";

interface UseSwapFormProps {
  tokens: TokenInfo[] | undefined;
  btcAddress: string;
  evmAddress: string;
}

interface UseSwapFormReturn {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  amount: string;
  setAmount: (amount: string) => void;
  setFromToken: (token: TokenInfo | null) => void;
  setToToken: (token: TokenInfo | null) => void;
  resetForm: () => void;
  isFromBtc: boolean;
  isToBtc: boolean;
  swapTokens: () => void;
}

export const useSwapForm = ({
  tokens,
}: UseSwapFormProps): UseSwapFormReturn => {
  const [fromToken, setFromToken] = useState<TokenInfo | null>(null);
  const [toToken, setToToken] = useState<TokenInfo | null>(null);
  const [amount, setAmount] = useState<string>("");

  const findTokenByPriority = useCallback(
    (tokenIds: string[]): TokenInfo | null => {
      if (!tokens) return null;

      for (const tokenId of tokenIds) {
        const token = tokens.find((token) => token.token_id === tokenId);
        if (token) return token;
      }
      return null;
    },
    [tokens]
  );

  // Auto-select default tokens when available
  useEffect(() => {
    if (tokens && tokens.length > 0) {
      const btcToken = findTokenByPriority(DEFAULT_TOKENS.BTC);
      const ethToken = findTokenByPriority(DEFAULT_TOKENS.ETH);

      if (btcToken && ethToken) {
        setFromToken(btcToken);
        setToToken(ethToken);
      }
    }
  }, [tokens, findTokenByPriority]);

  const resetForm = useCallback(() => {
    setAmount("");
  }, []);

  const swapTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount("");
  }, [fromToken, toToken]);

  const isFromBtc = isBtcChain(fromToken?.network_id);
  const isToBtc = isBtcChain(toToken?.network_id);

  return {
    fromToken,
    toToken,
    amount,
    setAmount,
    setFromToken,
    setToToken,
    resetForm,
    isFromBtc,
    isToBtc,
    swapTokens,
  };
};
