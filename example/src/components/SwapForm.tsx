import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { type TokenInfo } from "../services/SwapService";
import { TokenSelect } from "./TokenSelect";
import { useAvailableTokens, useSwapQuote } from "../hooks";
import { useConfirmSwap } from "../hooks/use-confirm-swap";

interface SwapFormProps {}

export const SwapForm: React.FC<SwapFormProps> = ({}) => {
  const [fromToken, setFromToken] = useState<TokenInfo | null>(null);
  const [toToken, setToToken] = useState<TokenInfo | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState(false);

  const resetForm = () => {
    setAmount("");
  };

  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { data: tokens } = useAvailableTokens();
  useEffect(() => {
    if (tokens) {
      // find btc to eth
      const btcToken =
        tokens.find((token) => token.token_id === "tBTC") ||
        tokens.find((token) => token.token_id === "BTC");
      const ethToken = tokens.find((token) => token.token_id === "ETH");
      if (btcToken && ethToken) {
        setFromToken(btcToken);
        setToToken(ethToken);
      }
    }
  }, [tokens]);

  const {
    data: quote,
    isLoading: isQuoteLoading,
    error: quoteError,
  } = useSwapQuote(fromToken, toToken, amount);

  const showToast = (type: "success" | "error", message: string) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const confirmSwap = useConfirmSwap();
  const handleSwap = async () => {
    if (!quote || !fromToken || !toToken || !amount) return;

    setIsSwapping(true);
    try {
      const { tradeId, txHash } = await confirmSwap({
        fromToken,
        toToken,
        quote,
        amount,
      });
      console.log({ tradeId, txHash });
      showToast("success", `Trade ID: ${tradeId}, TxHash: ${txHash}`);
      resetForm();
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="p-6 border border-gray-200 w-full rounded-lg shadow-lg flex flex-col gap-4">
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-md text-white z-50 animate-slideIn ${
            toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toastMessage.message}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-medium text-white">Amount</label>
        <div className="flex gap-2 items-center">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-2 py-2 border border-gray-200 rounded-md text-base focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-white">From Token</label>
        <TokenSelect
          tokens={tokens ?? []}
          value={fromToken}
          onChange={setFromToken}
          placeholder="Select token to send"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-white">To Token</label>
        <TokenSelect
          tokens={tokens ?? []}
          value={toToken}
          onChange={setToToken}
          placeholder="Select token to receive"
        />
      </div>

      {quoteError && (
        <div className="text-red-600 text-sm">Error: {quoteError.message}</div>
      )}
      {quote && toToken && (
        <div>
          Est.Output:{" "}
          {Number(
            ethers.formatUnits(
              quote.best_quote_after_fees,
              toToken.token_decimals
            )
          ).toFixed(8)}{" "}
          {toToken.token_symbol}
        </div>
      )}

      <button
        className={`btn btn-primary ${
          isSwapping || isQuoteLoading ? "loading" : ""
        }`}
        onClick={handleSwap}
        disabled={
          !fromToken ||
          !toToken ||
          !amount ||
          !quote ||
          isSwapping ||
          isQuoteLoading
        }
      >
        {isSwapping ? "Swapping..." : "Swap"}
      </button>
    </div>
  );
};
