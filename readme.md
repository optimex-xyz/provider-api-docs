# BitDEX API Integration Guide

## Authentication
- We require the `x-api-key` on header for tracking and authorization the origin of request. Please contact @tuent for get the `x-api-key`

## Endpoint
https://api-stg.bitdex.xyz

## Bitfi API

### List All Tokens
GET `/v1/tokens`

Response 200:

```json
{
  "data": {
    "supported_networks": [
      {
        "network_id": string,    // e.g., "ethereum", "bitcoin"
        "name": string,          // e.g., "Ethereum", "Bitcoin"
        "symbol": string,        // e.g., "ETH", "BTC"
        "type": string,          // e.g., "EVM", "UTXO"
        "logo_uri": string       // Network logo URL
      }
    ],
    "tokens": [
      {
        "network_id": string,        // e.g., "ethereum", "solana"
        "token_id": string,          // e.g., "usdt" (same across networks)
        "network_name": string,      // e.g., "Ethereum", "Solana"
        "network_symbol": string,    // e.g., "ETH", "SOL"
        "network_type": string,      // e.g., "EVM", "SOL"
        "token_name": string,        // e.g., "Tether USD"
        "token_symbol": string,      // e.g., "USDT"
        "token_address": string,     // Contract/mint address
        "token_decimals": number,    // e.g., 6 for USDT
        "token_logo_uri": string,    // Token logo URL
        "network_logo_uri": string   // Network logo URL
      }
    ],
    "pairs": [
      {
        "from_token_id": string,     // e.g., "usdt"
        "to_token_id": string,       // e.g., "btc"
        "is_active": boolean         // Whether pair is available for trading
      }
    ]
  }
}
```
---

### Get Indicative Quote
POST `/v1/solver/indicative-quote`

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
    "solver_address": string,
    "protocol_fee": number,
    "pmm_finalists": [
      {
        "pmm_id": string,
        "pmm_receiving_address": string
      }
    ]
  }
}
```
> Should refresh the indicative quote each 5s for make sure you get the latest quote from PMM

---
### Initiate Trade

POST `/v1/trades/initiate`

Request Body:
```json
{
  "session_id": string, // from api `/solver/indicative-quote`
  "from_user_address": string,
  "to_user_address": string,
  "user_refund_address": string,
  "creator_public_key": string, // compressed public key of user
  "trade_timeout": number, // Optional, timestamp (seconds) PMM can not make payment after this. Normally is 2 hours,
  "script_timeout": number, //  Optional, timestamp (seconds) User will be above to claim the fund back after this time. Normally is 24 hours
  "amount_in": string, // use ethers.parseUnits, then toString()
  "min_amount_out": string  // use ethers.parseUnits, then toString()
}
```

Response 200:
```json
{
  "data": {
    "trade_id": string,        // Trade ID
    "deposit_address": string, // Address to send tokens to
    "deposit_amount": string,  // Amount of tokens to send
    "payload": string,        // Transaction payload
    "approve_address": string, // Contract address that needs approval (if required)
    "need_approve": boolean,   // Flag indicating if approval is needed
    "approve_payload": string  // Payload for approval transaction, should be same as ERC20 allowance
  }
}
```

- First, check if token approval is needed via `need_approve` ( `approve_address`, `approve_payload` )
- After approval is complete (or if not needed), proceed with sending tokens ( `deposit_address`, `deposit_amount`, `payload` )

notes:
- For native tokens (like ETH): include value in the transaction
- For ERC20 tokens: value = 0, tokens are transferred through smart contract call in payload
- Always wait for approval transaction to complete before proceeding with deposit
- Use the correct network when sending transactions
- You can track transaction status using the `/v1/trades/{trade_id}` API

Example code:
```ts
const { depositAddress, payload, approveAddress, needApprove, approvePayload } =
  await initTradeMutation.mutateAsync(initPayload)

if (needApprove) {
  const approveTx = await wallet.sendTransaction(approveAddress, 0, { data: approvePayload })

  const assetProvider = getProvider(fromToken.networkId)

  await assetProvider.waitForTransaction(approveTx)
}

const value = fromToken.tokenAddress === 'native' ? ethers.parseUnits(amountIn, fromToken.tokenDecimals) : 0n

const depositTxId = await wallet.sendTransaction(
  depositAddress,
  value,
  {
    data: payload,
  },
  fromToken.networkId
)
```

---
### Notify Bitfi after transfer (optional)
POST `/v1/trades/${trade_id}/submit-tx`

Request Body:
```json
{
  "tx_id": string // transaction_id asset chain, with 0x prefix
}
```

Response 200:
```json
{
  "data": {
    "msg": string
  },
}
```
---

### Get Trade Information
GET `/v1/trades/{trade_id}`

Response 200:
```json
{
  "data": {
    "id": number,
    "trade_id": string,
    "session_id": string,
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
  }
}
```
---

### Get Trade Information
GET `/v1/protocol-info`

Response 200:
```json
{
  "data": {
    "config": {
      "protocol_fee": number,
      "tokens": [
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
      "token_pairs": [
        {
          "from_token_id": string,
          "to_token_id": string,
        }
      ]
    }
  }
}
```
