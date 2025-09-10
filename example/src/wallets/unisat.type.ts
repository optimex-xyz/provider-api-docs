export interface UnisatEventMap {
  accountsChanged: string[];
  networkChanged: string;
}

interface UnisatBalance {
  confirmed: number;
  unconfirmed: number;
  total: number;
}

interface UnisatInscription {
  inscriptionId: string;
  inscriptionNumber: string;
  address: string;
  outputValue: string;
  content: string;
  contentLength: string;
  contentType: string;
  preview: string;
  timestamp: number;
  offset: number;
  genesisTransaction: string;
  location: string;
}

export interface UnisatProvider {
  isBinance?: boolean;
  requestAccounts(): Promise<string[]>;

  getAccounts(): Promise<string[]>;

  getNetwork(): Promise<string>;

  switchNetwork(network: string): Promise<void>;

  getChain(): Promise<{
    enum: string;
    name: string;
    network: string;
  }>;

  switchChain(chain: string): Promise<{
    enum: string;
    name: string;
    network: string;
  }>;

  getPublicKey(): Promise<string>;

  getBalance(): Promise<UnisatBalance>;

  getInscriptions(
    cursor: number,
    size: number
  ): Promise<{
    total: number;
    list: UnisatInscription[];
  }>;

  sendBitcoin(
    toAddress: string,
    satoshis: number,
    options?: {
      feeRate?: number;
      memo?: string;
      memos?: string[];
    }
  ): Promise<string>;

  sendInscription(
    address: string,
    inscriptionId: string,
    options?: {
      feeRate?: number;
    }
  ): Promise<{
    txid: string;
  }>;

  signMessage(
    message: string,
    type?: "ecdsa" | "bip322-simple"
  ): Promise<string>;

  pushTx(options: { rawtx: string }): Promise<string>;

  signPsbt(
    psbtHex: string,
    options?: {
      autoFinalized?: boolean;
      toSignInputs?: Array<{
        index: number;
        address?: string;
        publicKey?: string;
        sighashTypes?: number[];
        disableTweakSigner?: boolean;
        useTweakedSigner?: boolean;
      }>;
    }
  ): Promise<string>;

  signPsbts(psbtHexs: string[], options?: object[]): Promise<string[]>;

  pushPsbt(psbtHex: string): Promise<string>;
}

export interface UnisatWalletOptions {
  network?: string;
  feeRate?: number;
}
