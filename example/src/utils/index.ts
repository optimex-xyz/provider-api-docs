import axios from "axios";
import { SUPPORTED_NETWORK } from "../config";

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

export const getFeeRate = async (networkId: string) => {
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
