# BitDEX API Integration Guide

## Authentication
- We require the apiToken on query string for tracking and authorization the origin of request. Please contact @tuent for get the apiToken

## Token Operations

### List All Tokens
GET `/tokens`

Response 200:

```json
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
---


## Trading Operations

### Get Indicative Quote
POST `/solver/indicative-quote`

Request Body:
```json
{
  "fromTokenId": string,
  "toTokenId": string,
  "fromTokenAmount": string
}
```

Response 200:

```json
{
  "data": {
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

---
### Initiate Trade

POST `/trades/initiate`

Request Body:
```json
{
  "sessionId": string, // from api `/solver/indicative-quote`
  "fromUserAddress": string,
  "toUserAddress": string,
  "userRefundAddress": string,
  "creatorPublicKey": string, // compressed public key of user
  "tradeTimeout": number, // timestamp (seconds) PMM can not make payment after this. Normally is 2 hours, Optinal
  "scriptTimeout": number, //  timestamp (seconds) User will be above to claim the fund back after this time. Normally is 24 hours, Optinal
  "amountIn": string, // use ethers.parseUnits, then toString()
  "minAmountOut": string,  // use ethers.parseUnits, then toString()
}
```

Response 200:
```json
{
  "data": {
    "tradeId": string,
    "depositAddress": string,
    "depositAmount": string,
    "payload": string,
    "approveAddress": string,
    "needApprove": boolean,
    "approvePayload": string,
  },
  "traceId": string
}
```

- After got the response, start transfer correct token/amount to the depositAddress. And then the bitfi process will be triggered automatically
---
### Notify Bitfi after transfer ( optinal )
POST `/trades/${tradeId}/submit-tx`

Request Body:
```json
{
  "txId": string, // transactionId asset chain
}
```

Response 200:
```json
{
  "data": {
    "msg": string
  },
  "traceId": string
}
```
---

### Get Trade Information
GET `/trades/{tradeId}`

Response 200:

```json
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
