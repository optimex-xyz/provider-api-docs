import { BTC_API_ENDPOINTS } from "../config";
import axios from "axios";
const API_TIMEOUT = 5000;

class BtcService {
  async getBalance(
    address: string,
    networkId = "testnet" as keyof typeof BTC_API_ENDPOINTS
  ) {
    try {
      const res = await axios.get(
        `${BTC_API_ENDPOINTS[networkId]}/address/${address}`,
        {
          timeout: API_TIMEOUT,
        }
      );
      const confirmedBalance =
        res.data.chain_stats?.funded_txo_sum -
          res.data.chain_stats?.spent_txo_sum || 0;

      return Math.max(0, confirmedBalance);
    } catch {
      return 0;
    }
  }
  async getPrice(networkId = "testnet" as keyof typeof BTC_API_ENDPOINTS) {
    try {
      const res = await axios.get(`${BTC_API_ENDPOINTS[networkId]}/prices`, {
        timeout: API_TIMEOUT,
      });
      return res.data.USD;
    } catch {
      return 0;
    }
  }
}

const BTCService = new BtcService();

export { BTCService };
