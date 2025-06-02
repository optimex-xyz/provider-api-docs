import type { OkxWalletInstance } from "./okx.type";

declare global {
  interface Window {
    okxwallet?: OkxWalletInstance;
  }
}
