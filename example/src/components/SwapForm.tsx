import React, { useState } from "react";
import { TokenSelect } from "./TokenSelect";
import { useListTokens, useDebounce, useGetQuote } from "../hooks";
import { useConfirmSwap } from "../hooks/use-confirm-swap";
import { Button } from "./ui/button";
import { useWallet } from "../context";
import { toast } from "react-toastify";
import { useSwapForm } from "../hooks/use-swap-form";
import { Loading } from "./Loading";
import { AppError } from "./AppError";
import { ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatTokenAmount } from "../utils";

interface SwapFormProps {
  className?: string;
}

export const SwapForm: React.FC<SwapFormProps> = ({ className }) => {
  const navigate = useNavigate();
  const { btcAddress, evmAddress, btcPublicKey } = useWallet();
  const { data, isLoading: isTokensLoading } = useListTokens();
  const {
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
  } = useSwapForm({ tokens: data?.tokens, btcAddress, evmAddress });

  const debouncedAmount = useDebounce(amount, 500);

  const {
    data: quote,
    isLoading: isQuoteLoading,
    error: quoteError,
  } = useGetQuote({
    fromToken,
    toToken,
    amount: debouncedAmount,
    from_user_address: isFromBtc ? btcAddress : evmAddress,
    to_user_address: isFromBtc ? evmAddress : btcAddress,
    user_refund_address: isFromBtc ? btcPublicKey : evmAddress,
    user_refund_pubkey: isFromBtc ? btcPublicKey : evmAddress,
  });
  const amountOut =
    quote && toToken
      ? formatTokenAmount(quote.best_quote_after_fees, toToken.token_decimals)
      : "0";
  const { confirmSwap } = useConfirmSwap();
  const [isSwapping, setIsSwapping] = useState(false);
  const handleSwap = async () => {
    if (isDisabled) return;

    setIsSwapping(true);
    try {
      const { tradeId, txHash } = await confirmSwap({
        fromToken,
        toToken,
        quote,
        amount,
      });

      console.log({ tradeId, txHash });
      navigate(`/swap/${tradeId}`);
      resetForm();
    } catch (error) {
      console.error("Swap failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsSwapping(false);
    }
  };

  const isDisabled =
    !fromToken ||
    !toToken ||
    !amount ||
    !quote ||
    isSwapping ||
    isQuoteLoading ||
    isTokensLoading;

  const getButtonText = () => {
    if (isTokensLoading) return "Loading Tokens...";
    if (isQuoteLoading) return "Fetching Quote...";
    if (quoteError) return quoteError.message;
    if (isSwapping) return "Swapping...";
    if (!fromToken || !toToken) return "Select Tokens";
    if (!amount) return "Enter Amount";
    if (!quote) return "Get Quote";
    return "Swap";
  };

  if (isTokensLoading) return <Loading message="Loading..." />;
  if (!data?.tokens || !data?.supported_networks)
    return <AppError message="No tokens available. Please try again later." />;

  return (
    <div className={`flex-1 w-full flex justify-center ${className || ""}`}>
      <div className="w-[32rem] mt-20 space-y-2 h-fit">
        <TokenSelect
          tokens={data?.tokens}
          value={fromToken}
          onTokenChange={setFromToken}
          label="From Token"
          onAmountChange={setAmount}
          networkId={fromToken?.network_id ?? ""}
          walletAddress={isFromBtc ? btcAddress : evmAddress}
          amount={amount}
          networks={data?.supported_networks}
        />

        <div className="flex justify-center absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1">
          <Button
            variant="outline"
            size="sm"
            onClick={swapTokens}
            disabled={!fromToken || !toToken}
            className="rounded-full w-10 h-10 p-0 border-white/20 hover:border-white/40"
            title="Swap tokens"
          >
            <ArrowDownUp />
          </Button>
        </div>

        <TokenSelect
          tokens={data?.tokens}
          value={toToken}
          onTokenChange={setToToken}
          label="To Token"
          amount={amountOut}
          networkId={toToken?.network_id ?? ""}
          walletAddress={isToBtc ? btcAddress : evmAddress}
          networks={data?.supported_networks}
        />
        <Button
          size="lg"
          className="w-full bg-amber-600 hover:bg-amber-700 rounded-sm h-12 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSwap}
          disabled={isDisabled}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
