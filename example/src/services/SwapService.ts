import axios, { AxiosError } from "axios";
import { API_KEY, BASE_URL } from "../config";

export interface SwapQuote {
  session_id: string;
  best_quote: string;
  best_quote_after_fees: string;
  protocol_fee: number;
  pmm_finalists: Array<{
    pmm_id: string;
    pmm_receiving_address: string;
  }>;
}

export interface TokenInfo {
  token_id: string;
  token_symbol: string;
  token_decimals: number;
  network_name: string;
  token_address: string;
  network_type: "BTC" | "EVM";
  network_id: string;
}

export interface InitiateTradeResponse {
  trade_id: string;
  deposit_address: string;
  payload: string;
}

export interface SwapTrade {
  trade_id: string;
  status: "pending" | "completed" | "failed";
  inputToken: string;
  outputToken: string;
  inputAmount: string;
  outputAmount: string;
  timestamp: number;
}

interface InitTradePayload {
  from_token_id: string;
  to_token_id: string;
  from_user_address: string;
  to_user_address: string;
  user_refund_address: string;
  user_refund_pubkey: string;
  creator_public_key: string;
  from_wallet_address: string;
  affiliate_info: Array<{
    provider: string;
    rate: string;
    receiver: string;
    network: string;
  }>;
  session_id: string;
  amount_in: string;
  min_amount_out: string;
}

export class SwapService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    try {
      const response = await axios({
        method,
        url,
        headers,
        data: body,
      });

      return response.data.data || response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            `HTTP error! status: ${error.response?.status}`
        );
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during the swap operation"
      );
    }
  }

  async getQuote(payload: {
    from_token_id: string;
    to_token_id: string;
    from_token_amount: string;
    affiliate_fee_bps: string;
  }): Promise<SwapQuote> {
    return this.request<SwapQuote>(
      "/v1/solver/indicative-quote",
      "POST",
      payload
    );
  }

  async initiateTrade(
    payload: InitTradePayload
  ): Promise<InitiateTradeResponse> {
    const data = await this.request<InitiateTradeResponse>(
      "/v1/trades/initiate",
      "POST",
      payload
    );
    return data;
  }

  async getTradeStatus(tradeId: string): Promise<SwapTrade> {
    return this.request<SwapTrade>(`/v1/trades/${tradeId}`);
  }

  async getAvailableTokens(): Promise<TokenInfo[]> {
    const data = await this.request<{ tokens: TokenInfo[] }>("/v1/tokens");
    return data.tokens;
  }
}

const Service = new SwapService(API_KEY, BASE_URL);

export default Service;
