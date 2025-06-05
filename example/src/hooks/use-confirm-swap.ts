import { useSendTransaction } from "wagmi";
import {
  AFFILIATE_INFO,
  CHAIN_ID,
  SCRIPT_TIMEOUT,
  SUPPORTED_NETWORK,
  TRADE_TIMEOUT,
} from "../config";
import { useWallet } from "../context";
import Service, {
  type SwapQuote,
  type TokenInfo,
} from "../services/SwapService";
import { okxWallet } from "../components/WalletConnect";
import { ethers } from "ethers";
import { getFeeRate } from "../utils";

const isNeedApprove = (fromToken: TokenInfo) => {
  return (
    fromToken.network_type === "EVM" && fromToken.token_address !== "native"
  );
};

const approveToken = async (fromToken: TokenInfo, vaultAddress: string) => {
  // check allowance and approve token for erc20
};

export const useConfirmSwap = () => {
  const { btcAddress, evmAddress, btcPublicKey } = useWallet();
  const { sendTransactionAsync } = useSendTransaction();

  return async ({
    fromToken,
    toToken,
    quote,
    amount,
  }: {
    fromToken: TokenInfo;
    toToken: TokenInfo;
    quote: SwapQuote;
    amount: string;
  }) => {
    const amountIn = ethers
      .parseUnits(amount, fromToken.token_decimals)
      .toString();
    const isFromBtc = fromToken.network_type === "BTC";
    const isToBtc = toToken.network_type === "BTC";

    const fromUserPublicKey = isFromBtc ? btcPublicKey : evmAddress;
    const fromUserAddress = isFromBtc ? btcAddress : evmAddress;
    const toUserAddress = isToBtc ? btcAddress : evmAddress;

    const data = await Service.initiateTrade({
      from_token_id: fromToken.token_id,
      to_token_id: toToken.token_id,
      from_user_address: fromUserPublicKey,
      to_user_address: toUserAddress,
      user_refund_address: fromUserAddress,
      user_refund_pubkey: fromUserPublicKey,
      creator_public_key: fromUserPublicKey,
      from_wallet_address: fromUserAddress,
      affiliate_info: AFFILIATE_INFO,
      session_id: quote?.session_id,
      amount_in: amountIn,
      min_amount_out: quote?.best_quote_after_fees,
      trade_timeout: TRADE_TIMEOUT
        ? Math.floor(Date.now() / 1000) + TRADE_TIMEOUT * 60
        : undefined,
      script_timeout: SCRIPT_TIMEOUT
        ? Math.floor(Date.now() / 1000) + SCRIPT_TIMEOUT * 60
        : undefined,
    });

    if (isNeedApprove(fromToken)) {
      await approveToken(fromToken, data.deposit_address);
    }

    let txHash = "";
    // send token to vault
    if (isFromBtc) {
      const feeRate = await getFeeRate(fromToken?.network_id);
      txHash = await okxWallet.sendTransaction(
        data.deposit_address,
        Number(amountIn),
        fromToken?.network_id,
        { feeRate }
      );
    } else {
      txHash = await sendTransactionAsync({
        value: fromToken?.token_address === "native" ? amountIn : 0,
        to: data.deposit_address,
        chainId: CHAIN_ID[fromToken?.network_id as SUPPORTED_NETWORK],
        data: data.payload,
      } as any);
    }

    try {
      await Service.submitTx({ tx_id: txHash, trade_id: data.trade_id });
    } catch (error) {
      console.error("submit tx error", error);
    }
    return { tradeId: data.trade_id, txHash };
  };
};
