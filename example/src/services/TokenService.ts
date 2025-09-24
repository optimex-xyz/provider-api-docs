import axios, { AxiosError } from "axios";
import { API_KEY, BASE_URL, BE_BASE_URL } from "../config";
import type { SwapQuote } from "./type";
import type { IGetQuotePayload } from "./type";

export interface IGetTokenPricePayload {
  tokenSymbol: string;
}

export interface IGetTokenPriceResponse {
  current_price: number;
  symbol: string;
}

export class BeDappService {
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

  async getTokenPrice(
    payload: IGetTokenPricePayload
  ): Promise<IGetTokenPriceResponse> {
    return this.request<IGetTokenPriceResponse>(
      `/v1/tokens/${payload.tokenSymbol}`,
      "GET"
    );
  }
}

const BeDappServiceAPI = new BeDappService(API_KEY, BE_BASE_URL);

export default BeDappServiceAPI;
