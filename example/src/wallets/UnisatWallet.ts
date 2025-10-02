import { SUPPORTED_NETWORK } from "../config";

import type { UnisatProvider } from "./unisat.type";

const WALLET_NAME = "Unisat Wallet";
const DOWNLOAD_URL = "https://unisat.io/download";

export class UnisatWallet {
  public readonly name = WALLET_NAME;
  private connectedAddresses: Record<string, string> = {};
  private provider: UnisatProvider | null = null;

  constructor() {
    this.initialize();
  }

  private getWalletProvider(): UnisatProvider | null {
    return window.unisat_wallet || null;
  }

  private initialize(): void {
    if (!this.provider) {
      this.provider = this.getWalletProvider();
    }
  }

  private ensureProvider(): UnisatProvider {
    if (!this.provider) {
      this.initialize();
      if (!this.provider) {
        throw new Error("Provider not initialized");
      }
    }
    return this.provider;
  }

  isInstalled(): boolean {
    return typeof window.unisat_wallet !== "undefined";
  }

  private download(): never {
    throw new Error(
      `Wallet ${this.name} is not installed. Please download from ${DOWNLOAD_URL}`
    );
  }

  async connect(
    networkId: string
  ): Promise<{ address: string; compressedPublicKey: string | undefined }> {
    if (!this.isInstalled()) {
      this.download();
    }

    const provider = this.ensureProvider();

    let accounts = await provider.requestAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }

    const currentNetwork = await provider.getNetwork();
    const targetNetwork = this.getTargetNetwork(networkId);

    if (currentNetwork !== targetNetwork) {
      await provider.switchNetwork(targetNetwork);
      accounts = await provider.requestAccounts();
    }
    if (networkId === SUPPORTED_NETWORK.BTC_TESTNET) {
      const currentChain = await provider.getChain();
      if (currentChain.enum !== "BITCOIN_TESTNET4") {
        await provider.switchChain("BITCOIN_TESTNET4");
      }
    }

    const publicKey = await provider.getPublicKey();
    this.connectedAddresses[networkId] = accounts[0];

    return {
      address: accounts[0],
      compressedPublicKey: publicKey,
    };
  }

  async disconnect(networkId?: string): Promise<void> {
    if (!networkId) {
      throw new Error("Network ID is required for disconnection");
    }

    if (this.provider) {
      this.provider = null;
      delete this.connectedAddresses[networkId];
    }
  }

  async getAddress(networkId: string): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error("UniSat Wallet is not installed");
    }

    const provider = this.ensureProvider();
    const accounts = await provider.getAccounts();

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }

    this.connectedAddresses[networkId] = accounts[0];
    return accounts[0];
  }

  async getCompressedPublicKey(networkId?: string): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error("UniSat Wallet is not installed");
    }

    if (!networkId) {
      throw new Error("Network ID is required");
    }

    const provider = this.ensureProvider();

    try {
      return await provider.getPublicKey();
    } catch (error) {
      throw new Error(
        `Failed to get public key: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async sendTransaction(
    toAddress: string,
    amount: number | bigint,
    options?: { feeRate?: number }
  ): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error("UniSat Wallet is not installed");
    }

    if (!toAddress) {
      throw new Error("Recipient address is required");
    }

    const provider = this.ensureProvider();

    try {
      return await provider.sendBitcoin(toAddress, Number(amount), {
        feeRate: options?.feeRate,
      });
    } catch (error) {
      throw new Error(
        `Failed to send transaction: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async signMessage(message: string, networkId?: string): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error("UniSat Wallet is not installed");
    }

    if (!message) {
      throw new Error("Message is required");
    }

    if (!networkId) {
      throw new Error("Network ID is required");
    }

    const provider = this.ensureProvider();

    try {
      return await provider.signMessage(message);
    } catch (error) {
      throw new Error(
        `Failed to sign message: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async signPsbt(
    psbt: string,
    options?: {
      autoFinalized?: boolean;
      toSignInputs?: Array<{
        index: number;
        address?: string;
        publicKey?: string;
        sighashTypes?: number[];
      }>;
    }
  ): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error("UniSat Wallet is not installed");
    }

    if (!psbt) {
      throw new Error("PSBT data is required");
    }

    const provider = this.ensureProvider();

    try {
      return await provider.signPsbt(psbt, options);
    } catch (error) {
      throw new Error(
        `Failed to sign PSBT: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private getTargetNetwork(networkId: string): string {
    return networkId === SUPPORTED_NETWORK.BTC_TESTNET ? "testnet" : "livenet";
  }

  getConnectedAddresses(): Record<string, string> {
    return { ...this.connectedAddresses };
  }

  isConnected(networkId: string): boolean {
    return networkId in this.connectedAddresses;
  }
}

export const unisatWallet = new UnisatWallet();
