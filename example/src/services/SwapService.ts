import axios, { AxiosError } from "axios";
import { API_KEY, BASE_URL } from "../config";
import type {
  IGetAvailableTokensResponse,
  InitiateTradeResponse,
  InitTradePayload,
  ISwapDetail,
  SwapQuote,
} from "./type";
import type { IGetQuotePayload } from "./type";

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

  async getQuote(payload: IGetQuotePayload): Promise<SwapQuote> {
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

  async getTradeStatus(tradeId: string): Promise<ISwapDetail> {
    return this.request<ISwapDetail>(`/v1/trades/${tradeId}`);
  }

  async getAvailableTokens(): Promise<IGetAvailableTokensResponse> {
    const data = await this.request<IGetAvailableTokensResponse>("/v1/tokens");
    return data;
  }

  async submitTx(payload: { tx_id: string; trade_id: string }): Promise<void> {
    return this.request<void>(
      `/v1/trades/${payload.trade_id}/submit-tx`,
      "POST",
      payload
    );
  }
}

const Service = new SwapService(API_KEY, BASE_URL);

export default Service;
