import axios from "axios";
import { DEFAULT_FEE_RATE_SETTINGS, SUPPORTED_NETWORK } from "../config";
import type { TokenInfo } from "../services/type";
import { ethers } from "ethers";
import { IS_TRADE_TIMEOUT } from "../constants/debug";

export const truncateAddress = (
  str: string,
  startLength = 6,
  endLength = 6
) => {
  if (!str) return "";
  return str.length > startLength + endLength
    ? `${str.slice(0, startLength)}...${str.slice(-endLength)}`
    : str;
};

export const getBtcFeeRateMempool = async (networkId: string) => {
  try {
    const isTestnet = networkId === SUPPORTED_NETWORK.BTC_TESTNET;
    const response = await axios.get(
      isTestnet
        ? "https://mempool.space/testnet/api/v1/fees/recommended"
        : "https://mempool.space/api/v1/fees/recommended"
    );
    // Use the half-hour fee estimate (sat/vB) for a good balance between speed and cost
    return response.data.halfHourFee * 1.2; // add 20% buffer, you can change it
  } catch (error) {
    return 3;
  }
};

export const getBtcFeeRateBlockStream = async (
  networkId: string,
  defaultFeeRate: number
) => {
  const isTestnet = networkId === SUPPORTED_NETWORK.BTC_TESTNET;
  const url = isTestnet
    ? "https://blockstream.info/testnet"
    : "https://blockstream.info";
  const { data } = await axios.get(`${url}/api/fee-estimates`, {
    timeout: 5000,
  });
  return Number(
    Math.max(
      data["3"] || defaultFeeRate,
      data["2"] || defaultFeeRate,
      data["1"] || defaultFeeRate
    )
  );
};

export const getBtcFeeRate = async (networkId: string): Promise<number> => {
  let feeRate;
  const { default_fee_rate, max_fee_rate } = DEFAULT_FEE_RATE_SETTINGS;
  try {
    feeRate = await getBtcFeeRateMempool(networkId);
  } catch (error) {
    console.error("Cannot get fee rate from mempool", error);
  }
  try {
    if (!feeRate)
      feeRate = await getBtcFeeRateBlockStream(networkId, default_fee_rate);
  } catch (error) {
    console.error("Cannot get fee rate from blockstream", error);
  }
  if (!feeRate) return default_fee_rate;
  return feeRate >= max_fee_rate ? default_fee_rate : feeRate;
};

export const isBtcChain = (
  networkId: SUPPORTED_NETWORK | string | undefined
) => {
  return (
    networkId === SUPPORTED_NETWORK.BTC ||
    networkId === SUPPORTED_NETWORK.BTC_TESTNET
  );
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getAmountOutAfterSlippage = ({
  amountOut,
  slippage,
  toToken,
}: {
  amountOut: string;
  slippage: number;
  toToken: TokenInfo;
}) => {
  try {
    const SCALE = BigInt(10 ** toToken.token_decimals);
    const amountBN = BigInt(amountOut);
    const factor = BigInt(Math.floor((1 - slippage / 100) * Number(SCALE)));
    const minAmountBN = (amountBN * factor) / SCALE;
    if (IS_TRADE_TIMEOUT) {
      return (minAmountBN * BigInt(2)).toString();
    }
    return minAmountBN.toString();
  } catch {
    return amountOut;
  }
};

export const formatTokenAmount = (
  amount: string,
  decimals: number | undefined
): string => {
  if (!decimals) return amount;
  try {
    const formatted = ethers.formatUnits(amount, decimals);
    // Truncate to maximum 8 decimal places
    const parts = formatted.split(".");
    if (parts.length === 2 && parts[1].length > 8) {
      return parts[0] + "." + parts[1].substring(0, 8);
    }
    return formatted;
  } catch {
    return amount;
  }
};
