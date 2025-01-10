# BitDEX API Integration Guide

## Authentication
- We require the apiToken on query string for tracking and authorization the origin of request. Please contact @tuent for get the apiToken

## Endpoint
https://api-stg.bitdex.xyz

## Bitfi API

### List All Tokens
GET `/tokens`

Response 200:

```json
{
  "data": [
    {
      "id": number,
      "network_id": string,
      "token_id": string,
      "network_name": string,
      "network_symbol": string,
      "network_type": string,
      "token_name": string,
      "token_symbol": string,
      "token_address": string,
      "token_decimals": number,
      "token_logo_uri": string,
      "network_logo_uri": string
    }
  ],
  "trace_id": string
}
```
---

### Get Indicative Quote
POST `/solver/indicative-quote`

Request Body:
```json
{
  "from_token_id": string,
  "to_token_id": string,
  "from_token_amount": string
}
```

Response 200:
```json
{
  "data": {
    "session_id": string,
    "best_quote": string,
    "pmm_finalists": [
      {
        "pmm_id": string,
        "pmm_receiving_address": string
      }
    ]
  },
  "trace_id": string
}
```
> Should refresh the indicative quote each 5s for make sure you get the latest quote from PMM

---
### Initiate Trade

POST `/trades/initiate`

Request Body:
```json
{
  "session_id": string, // from api `/solver/indicative-quote`
  "from_user_address": string,
  "to_user_address": string,
  "user_refund_address": string,
  "creator_public_key": string, // compressed public key of user
  "trade_timeout": number, // timestamp (seconds) PMM can not make payment after this. Normally is 2 hours, Optional
  "script_timeout": number, //  timestamp (seconds) User will be above to claim the fund back after this time. Normally is 24 hours, Optional
  "amount_in": string, // use ethers.parseUnits, then toString()
  "min_amount_out": string  // use ethers.parseUnits, then toString()
}
```

Response 200:
```json
{
  "data": {
    "trade_id": string,
    "deposit_address": string,
    "deposit_amount": string,
    "payload": string,
    "approve_address": string,
    "need_approve": boolean,
    "approve_payload": string
  },
  "trace_id": string
}
```

- After got the response, start transfer correct token/amount to the deposit_address. And then the bitfi process will be triggered automatically
---
### Notify Bitfi after transfer (optional)
POST `/trades/${trade_id}/submit-tx`

Request Body:
```json
{
  "tx_id": string // transaction_id asset chain
}
```

Response 200:
```json
{
  "data": {
    "msg": string
  },
  "trace_id": string
}
```
---

### Get Trade Information
GET `/trades/{trade_id}`

Response 200:
```json
{
  "data": {
    "id": number,
    "trade_id": string,
    "status": string,
    "timestamp": number,
    "from_user_address": string,
    "to_user_address": string,
    "events": [
      {
        "trade_id": string,
        "action": string,
        "tx_id": string,
        "block_number": number,
        "timestamp": number,
        "input_data": object
      }
    ]
  },
  "trace_id": string
}
```
