import { useSendTransaction, type Config } from "wagmi";
import {
  AFFILIATE_INFO,
  CHAIN_ID,
  DEFAULT_SLIPPAGE,
  NATIVE_TOKEN_ADDRESS,
  SCRIPT_TIMEOUT,
  SUPPORTED_NETWORK,
  TRADE_TIMEOUT,
} from "../config";
import { useWallet } from "../context";
import Service from "../services/SwapService";
import { ethers } from "ethers";
import { getAmountOutAfterSlippage, getBtcFeeRate, isBtcChain } from "../utils";
import { unisatWallet } from "../wallets/UnisatWallet";
import ERC20_ABI from "../../../abis/asset-chain/ERC20.json";
import { useWagmiSigner } from "./use-wagmi-singer";
import { useWagmiSwitchChain } from "./use-wagmi-switch-chain";
import type { SendTransactionMutateAsync } from "wagmi/query";
import type { SwapQuote, TokenInfo } from "../services/type";

interface ApproveTokenParams {
  walletAddress: string;
  token: TokenInfo;
  spenderAddress: string;
  amount: bigint;
  signer: ethers.JsonRpcSigner | undefined;
}

interface ConfirmSwapParams {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  quote: SwapQuote;
  amount: string;
}

interface ConfirmSwapResult {
  tradeId: string;
  txHash: string;
}

const isNeedApprove = (fromToken: TokenInfo): boolean => {
  return (
    fromToken.network_type === "EVM" &&
    fromToken.token_address !== NATIVE_TOKEN_ADDRESS
  );
};

const getTradeTimeoutTimestamp = (): {
  trade_timeout: number;
  script_timeout: number;
} => {
  const now = Math.floor(Date.now() / 1000);
  return {
    trade_timeout: now + TRADE_TIMEOUT * 60,
    script_timeout: now + SCRIPT_TIMEOUT * 60,
  };
};

const approveToken = async ({
  walletAddress,
  token,
  spenderAddress,
  amount,
  signer,
}: ApproveTokenParams): Promise<void> => {
  if (!signer) {
    throw new Error("Signer is required for token approval");
  }

  const erc20Contract = new ethers.Contract(
    token.token_address,
    ERC20_ABI,
    signer
  );

  try {
    const allowance = await erc20Contract.allowance(
      walletAddress,
      spenderAddress
    );

    if (allowance < amount) {
      const tx = await erc20Contract.approve(spenderAddress, ethers.MaxUint256);
      const receipt = await tx?.wait();
      console.log("approveToken receipt:", receipt);
    }

    // Verify allowance after approval
    const newAllowance = await erc20Contract.allowance(
      walletAddress,
      spenderAddress
    );
    if (newAllowance < amount) {
      throw new Error(
        "Token approval failed - insufficient allowance after approval"
      );
    }
  } catch (error) {
    throw new Error(
      `Token approval failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

const sendBtcTransaction = async (
  depositAddress: string,
  amount: bigint,
  networkId: string
): Promise<string> => {
  try {
    const feeRate = await getBtcFeeRate(networkId);
    return await unisatWallet.sendTransaction(depositAddress, Number(amount), {
      feeRate,
    });
  } catch (error) {
    throw new Error(
      `BTC transaction failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

const sendEvmTransaction = async (
  sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>,
  depositAddress: string,
  amount: bigint,
  fromToken: TokenInfo,
  payload: string
): Promise<string> => {
  try {
    console.log(
      "🚀 ~ sendEvmTransaction ~ sendTransactionAsync:",
      CHAIN_ID[fromToken.network_id as SUPPORTED_NETWORK]
    );
    return await sendTransactionAsync({
      value: fromToken.token_address === "native" ? amount : 0,
      to: depositAddress,
      chainId: CHAIN_ID[fromToken.network_id as SUPPORTED_NETWORK],
      data: payload,
    } as any);
  } catch (error) {
    throw new Error(
      `EVM transaction failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

const submitTransaction = async (
  txHash: string,
  tradeId: string
): Promise<void> => {
  try {
    await Service.submitTx({ tx_id: txHash, trade_id: tradeId });
  } catch (error) {
    console.error("Failed to submit transaction:", error);
  }
};

export const useConfirmSwap = () => {
  const { btcAddress, evmAddress, btcPublicKey } = useWallet();
  const { sendTransactionAsync } = useSendTransaction();
  const { getSigner } = useWagmiSigner();
  const { switchChain } = useWagmiSwitchChain();
  const confirmSwap = async ({
    fromToken,
    toToken,
    quote,
    amount,
  }: ConfirmSwapParams): Promise<ConfirmSwapResult> => {
    try {
      const amountIn = ethers.parseUnits(amount, fromToken.token_decimals);

      const isFromBtc = isBtcChain(fromToken.network_id);
      const isToBtc = isBtcChain(toToken.network_id);

      const fromUserPublicKey = isFromBtc ? btcPublicKey : evmAddress;
      const fromUserAddress = isFromBtc ? btcAddress : evmAddress;
      const toUserAddress = isToBtc ? btcAddress : evmAddress;

      if (!fromUserAddress) {
        throw new Error("Missing from wallet address");
      }
      if (!toUserAddress) {
        throw new Error("Missing to wallet address");
      }

      // Initiate trade
      const { trade_timeout, script_timeout } = getTradeTimeoutTimestamp();
      const tradeData = await Service.initiateTrade({
        from_token_id: fromToken.token_id,
        to_token_id: toToken.token_id,
        from_user_address: fromUserAddress,
        to_user_address: toUserAddress,
        user_refund_address: fromUserAddress,
        user_refund_pubkey: fromUserPublicKey,
        creator_public_key: fromUserPublicKey,
        from_wallet_address: fromUserAddress,
        affiliate_info: AFFILIATE_INFO,
        session_id: quote?.session_id,
        amount_in: amountIn.toString(),
        min_amount_out: getAmountOutAfterSlippage({
          amountOut: quote?.best_quote_after_fees,
          slippage: DEFAULT_SLIPPAGE,
          toToken,
        }),
        trade_timeout,
        script_timeout,
      });

      if (isToBtc) {
        await switchChain(fromToken);
      }
      if (isNeedApprove(fromToken)) {
        const signer = await getSigner();
        await approveToken({
          walletAddress: fromUserAddress,
          token: fromToken,
          spenderAddress: tradeData.deposit_address,
          amount: amountIn,
          signer,
        });
      }

      let txHash: string;
      if (isFromBtc) {
        txHash = await sendBtcTransaction(
          tradeData.deposit_address,
          amountIn,
          fromToken.network_id
        );
      } else {
        txHash = await sendEvmTransaction(
          sendTransactionAsync,
          tradeData.deposit_address,
          amountIn,
          fromToken,
          tradeData.payload
        );
      }

      await submitTransaction(txHash, tradeData.trade_id);
      return {
        tradeId: tradeData.trade_id,
        txHash,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`${errorMessage}`);
    }
  };

  return { confirmSwap };
};
