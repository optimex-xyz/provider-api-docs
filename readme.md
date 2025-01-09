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

Using the sessionId response above for init the trade

```bash
POST https://api-dev.bitdex.xyz/trades/initiate

Request Body:
{
  "tradeId": string,
  "sessionId": string,
  "fromUserAddress": string,
  "toUserAddress": string,
  "userRefundAddress": string,
  "creatorPublicKey": string,
  "scriptTimeout": number,
  "tradeTimeout": number,
  "amountIn": string,
  "minAmountOut": string,
  "mpcPubkey": string,
  "solver": string
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
