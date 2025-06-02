import { SUPPORTED_NETWORK } from "../config";

export class OkxWallet {
  name = "OKX Wallet";
  private connectedAddresses: Record<string, string> = {};
  private compressedPublicKeys: Record<string, string> = {};
  private currentNetwork: string | null = null;
  private disconnecting = false;

  private download(): void {
    throw new Error(
      'OKX Wallet is not installed! <a target="_blank" class="underline" href="https://www.okx.com/download">Download wallet</a>'
    );
  }

  private checkWalletAvailability(): void {
    if (!this.isInstalled()) {
      this.download();
    }
  }

  async getAddress(networkId: string): Promise<string> {
    if (!this.isInstalled()) {
      this.download();
    }

    if (!window.okxwallet) {
      throw new Error("Provider is not available");
    }

    if (!networkId) return "";

    if (networkId === SUPPORTED_NETWORK.BTC) {
      const address = (await window.okxwallet.bitcoin.getAccounts())[0];
      this.connectedAddresses[networkId] = address;
      this.compressedPublicKeys[networkId] =
        await window.okxwallet.bitcoin.getPublicKey();
      return address;
    }

    if (networkId === SUPPORTED_NETWORK.BTC_TESTNET) {
      const data = await window.okxwallet.bitcoinTestnet.connect();
      const address = data.address;
      this.connectedAddresses[networkId] = address;
      this.compressedPublicKeys[networkId] = data.compressedPublicKey;
      return address;
    }
    return this.connectedAddresses[networkId];
  }

  isInstalled(): boolean {
    return (
      typeof window !== "undefined" &&
      "okxwallet" in window &&
      window.okxwallet !== undefined
    );
  }

  async connectByNetwork(networkId: string) {
    switch (networkId) {
      case SUPPORTED_NETWORK.BTC: {
        return await window.okxwallet!.bitcoin.connect();
      }
      case SUPPORTED_NETWORK.BTC_TESTNET: {
        return await window.okxwallet!.bitcoinTestnet.connect();
      }
      default: {
        throw new Error("provider is not available");
      }
    }
  }

  async connect(networkId: string): Promise<{
    address: string;
    compressedPublicKey: string;
  }> {
    this.checkWalletAvailability();
    this.currentNetwork = networkId;

    let resp = await this.connectByNetwork(networkId);
    // sometime okx return null => throw error => user try again => always failed.
    // => call disconnect && connect again will resolve
    if (resp === null) await this.disconnect(networkId);
    resp = await this.connectByNetwork(networkId);

    const { address, compressedPublicKey } = resp;
    this.connectedAddresses[networkId] = address;
    this.compressedPublicKeys[networkId] = compressedPublicKey;

    return { address, compressedPublicKey };
  }

  async disconnect(networkId?: string): Promise<void> {
    if (this.disconnecting) return;
    this.disconnecting = true;
    if (!this.isInstalled()) {
      this.download();
    }

    if (networkId) {
      await this.disconnectNetwork(networkId);
    } else if (this.currentNetwork) {
      await this.disconnectNetwork(this.currentNetwork);
    }
    this.currentNetwork = null;
    if (networkId && this.connectedAddresses[networkId]) {
      delete this.connectedAddresses[networkId];
    }
    if (networkId && this.compressedPublicKeys[networkId]) {
      delete this.compressedPublicKeys[networkId];
    }
    this.disconnecting = false;
  }

  private async disconnectNetwork(network: string): Promise<void> {
    if (network === SUPPORTED_NETWORK.BTC) {
      await window.okxwallet!.bitcoin.disconnect?.();
      return;
    }

    if (network === SUPPORTED_NETWORK.BTC_TESTNET) {
      await window.okxwallet!.bitcoinTestnet.disconnect?.();
      return;
    }
  }

  async sendTransaction(
    toAddress: string,
    amount: number | bigint,
    networkId: string,
    options?: { feeRate?: number }
  ): Promise<string> {
    if (!this.isInstalled()) {
      this.download();
    }
    if (!window.okxwallet) {
      throw new Error("Provider is not available");
    }
    const okxOptions = options as { feeRate?: number };

    switch (networkId) {
      case SUPPORTED_NETWORK.BTC:
        return window.okxwallet!.bitcoin.sendBitcoin(
          toAddress,
          Number(amount),
          okxOptions
        );
      case SUPPORTED_NETWORK.BTC_TESTNET:
        return window.okxwallet!.bitcoinTestnet.sendBitcoin(
          toAddress,
          Number(amount),
          okxOptions
        );
      default: {
        throw new Error(`Unsupported network: ${networkId}`);
      }
    }
  }

  async getCompressedPublicKey(networkId: string): Promise<string> {
    if (!this.isInstalled()) {
      this.download();
    }

    if (!window.okxwallet) {
      throw new Error("Provider is not available");
    }

    if (this.compressedPublicKeys[networkId]) {
      return this.compressedPublicKeys[networkId];
    }

    switch (networkId) {
      case SUPPORTED_NETWORK.BTC: {
        const { compressedPublicKey } =
          await window.okxwallet.bitcoin.connect();
        this.compressedPublicKeys[networkId] = compressedPublicKey;
        return this.compressedPublicKeys[networkId];
      }
      case SUPPORTED_NETWORK.BTC_TESTNET: {
        const { compressedPublicKey } =
          await window.okxwallet.bitcoinTestnet.connect();
        this.compressedPublicKeys[networkId] = compressedPublicKey;
        return this.compressedPublicKeys[networkId];
      }
      default: {
        throw new Error("Provider is not available");
      }
    }
  }
}
