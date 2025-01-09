# BitDEX API Integration Guide

## Authentication
- We require the apiToken on query string for tracking and authorization the origin of request. Please contact @tuent for get the apiToken

## Token Operations

### List All Tokens
```bash
GET https://api-dev.bitdex.xyz/tokens

Response 200:
{
  "data": [
    {
      "id": number,
      "networkId": string,
      "tokenId": string,
      "networkName": string, 
      "networkSymbol": string,
      "networkType": string,
      "tokenName": string,
      "tokenSymbol": string,
      "tokenAddress": string,
      "tokenDecimals": number,
      "tokenLogoUri": string,
      "networkLogoUri": string
    }
  ],
  "traceId": string
}
```

### Get Token Information
```bash
GET https://api-dev.bitdex.xyz/tokens/{symbol}

Response 200:
{
  "data": {
    "id": string,
    "symbol": string,
    "name": string,
    "image": string,
    "currentPrice": number,
    "marketCap": number
  },
  "traceId": string
}
```

## Trading Operations

### Get Indicative Quote
```bash
POST https://api-dev.bitdex.xyz/solver/indicative-quote

Request Body:
{
  "fromTokenId": string,
  "toTokenId": string, 
  "fromTokenAmount": string
}

Response 200:
{
  "data": {
    "solverAddress": string,
    "sessionId": string,
    "bestQuote": string,
    "pmmFinalists": [
      {
        "pmmId": string,
        "pmmReceivingAddress": string
      }
    ]
  },
  "traceId": string
}
```

> Should refresh the indicative quote each 5s for make sure you get the latest quote from PMM

### Initiate Trade
1. Construct tradeInfo flow the bellow format
```typescript
export const processAddress = (address: string, networkType: string) => {
  switch (networkType.toUpperCase()) {
    case 'BTC':
    case 'TBTC':
    case 'SOLANA':
      return ethers.toUtf8Bytes(address)
    case 'EVM':
      return ethers.hexlify(address)

    default:
      throw new Error(`Unsupported network: ${networkType}`)
  }
}

export function getTradeInfo(
  amountIn: bigint,
  fromUserAddress: string,
  fromToken: IToken,
  toUserAddress: string,
  toToken: IToken
): ITypes.TradeInfoStruct {
  return {
    amountIn,
    fromChain: [
      processAddress(fromUserAddress, fromToken.networkType),
      ethers.toUtf8Bytes(fromToken.networkId),
      ethers.toUtf8Bytes(fromToken.tokenAddress),
    ],
    toChain: [
      processAddress(toUserAddress, toToken.networkType),
      ethers.toUtf8Bytes(toToken.networkId),
      ethers.toUtf8Bytes(toToken.tokenAddress),
    ],
  }
}

```

2. Gen the tradeId follow the below sample logic

```typescript
export function getTradeId(sessionId: bigint, solverAddress: string, tradeInfo: ITypes.TradeInfoStruct): string {
  const encodedData: string = abiCoder.encode(
    ['uint256', 'address', 'tuple(uint256,bytes[3],bytes[3])'],
    [sessionId, solverAddress, [tradeInfo.amountIn, tradeInfo.fromChain, tradeInfo.toChain]]
  )

  return sha256(encodedData)
}
```

3. Get the current MPC public key directly from the l2 contract
```
rpc: https://bitfi-ledger-testnet.alt.technology
contract: 0x67d96Bbd0Dd191525510163D753bA3FdE485f0ee
ABI: {
    inputs: [],
    name: "getCurrentPubkey",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  }
```

```bash
POST https://api-dev.bitdex.xyz/trades/initiate

Request Body:
{
  "tradeId": string,
  "sessionId": string,
  "fromUserAddress": string,
  "toUserAddress": string,
  "userRefundAddress": string,
  "creatorPublicKey": string, // compressed public key of user
  "tradeTimeout": number, // timestamp (seconds) PMM can not make payment after this. Normally is 2 hours
  "scriptTimeout": number, //  timestamp (seconds) User will be above to claim the fund back after this time. Normally is 24 hours
  "amountIn": string,
  "minAmountOut": string,
  "mpcPubkey": string,
  "solver": string // Solver address
}

Response 200:
{
  "data": {
    "depositAddress": string,
    "depositAmount": string,
    "payload": string,
    "approveAddress": string,
    "needApprove": boolean,
    "approvePayload": string
  },
  "traceId": string
}
```

- After got the response, start transfer correct token/amount to the depositAddress. And then the bitfi process will be triggered automatically 

### Get Trade Information
```bash
GET https://api-dev.bitdex.xyz/trades/{tradeId}

Response 200:
{
  "data": {
    "id": number,
    "tradeId": string,
    "status": string,
    "timestamp": number,
    "fromUserAddress": string,
    "toUserAddress": string,
    "events": [
      {
        "tradeId": string,
        "action": string,
        "txId": string,
        "blockNumber": number,
        "timestamp": number,
        "inputData": object
      }
    ]
  },
  "traceId": string
}
```
