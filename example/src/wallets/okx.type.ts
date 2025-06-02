export interface OkxBitcoinWallet {
  requestAccounts(): Promise<string>;

  getAccounts(): Promise<string[]>;

  getPublicKey(): Promise<string>;

  getBalance(): Promise<string | number>;

  connect(): Promise<{
    address: string;
    publicKey: string;
    compressedPublicKey: string;
  }>;

  disconnect(): Promise<void>;

  signMessage(message: string): Promise<string>;

  sendBitcoin(
    toAddress: string,
    amount: number,
    options?: { feeRate?: number }
  ): Promise<string>;

  on(eventName: string, listener: (...args: unknown[]) => void): void;

  off(eventName: string, listener: (...args: unknown[]) => void): void;
}

export interface OkxWalletInstance {
  isUnlock(): Promise<boolean>;

  isConnected(): boolean;

  request(args: { method: string; params?: unknown[] }): Promise<unknown>;

  on(eventName: string, listener: (...args: unknown[]) => void): void;

  off(eventName: string, listener: (...args: unknown[]) => void): void;

  bitcoin: OkxBitcoinWallet;

  bitcoinTestnet: OkxBitcoinWallet;
}
