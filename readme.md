# BitFi API Integration Guide

## Table of Contents
- [Authentication](#authentication)
- [Base URLs](#base-urls)
- [Required Trading Flow](#required-trading-flow)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Token Management](#token-management)
  - [Trading Operations](#trading-operations)
  - [Protocol Information](#protocol-information)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)


## Authentication
All API requests require authentication using an API key in the request headers.

**Header Name:** `x-api-key`

Example:
```http
GET /v1/tokens
x-api-key: your_api_key
```

- Contact @tuent to obtain your API key
- Include the header in all API requests

## Base URLs

- Staging: `https://api-stg.bitdex.xyz`
- Production: `https://api.petafi.xyz`

## Required Trading Flow

### 1. Get Trading Quote
```http
POST /v1/solver/indicative-quote
```
- Should be refreshed every 60 seconds while user is considering the trade
- Quote provides session_id needed for trade initiation
- Rates and fees may change between quotes

### 2. Initiate Trade
```http
POST /v1/trades/initiate
```
- Uses session_id from latest quote
- Returns trade details including approval requirements
- Returns deposit information

### 3. Token Approval (if needed)
- Check need_approve from trade initiation response
- If true:
  1. Submit approval transaction using approve_address and approve_payload
  2. Wait for approval transaction to be confirmed
  3. Proceed to deposit step

### 4. Send Tokens
- Submit deposit transaction using:
  - deposit_address
  - deposit_amount
  - payload
- For native tokens (ETH, etc.):
  - Include value in transaction
- For ERC20 tokens:
  - Set value to 0
  - Tokens transferred through contract call

### 5. Submit Transaction ID (Optional)
```http
POST /v1/trades/{trade_id}/submit-tx
```
- Optional but recommended
- Helps with faster trade processing
- Enables better trade tracking

## Rate Limiting

Currently not specified. Contact support for details about rate limits.


## Endpoints

### Token Management

#### List All Tokens and Pairs
```http
GET /v1/tokens
```

Returns all supported networks, tokens, and available trading pairs.

**Response** `200`
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

### Trading Operations

#### Get Indicative Quote
```http
POST /v1/solver/indicative-quote
```

Get trading quote with current rates. Quotes should be refreshed every 5 seconds.

**Request Body**
```json
{
  "from_token_id": string,
  "to_token_id": string,
  "from_token_amount": string
}
```

**Response** `200`
```json
{
  "data": {
    "session_id": string,
    "best_quote": string,
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

#### Initiate Trade
```http
POST /v1/trades/initiate
```

Start a new trade using a quote session.

**Request Body**
```json
{
  "session_id": string,          // From quote response
  "from_user_address": string,   // Sending address
  "to_user_address": string,     // Receiving address
  "user_refund_address": string, // Refund address if trade fails
  "creator_public_key": string,  // Compressed public key
  "trade_timeout": number,       // Optional, defaults to 2 hours
  "script_timeout": number,      // Optional, defaults to 24 hours
  "amount_in": string,           // Amount in smallest unit
  "min_amount_out": string       // Minimum acceptable output
}
```

**Response** `200`
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
  }
}
```

#### Get Trade Status
```http
GET /v1/trades/{trade_id}
```

Get current status and details of a trade.

**Response** `200`
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

#### Submit Transaction (Optional)
```http
POST /v1/trades/{trade_id}/submit-tx
```

Notify system about completed transfer.

**Request Body**
```json
{
  "tx_id": string  // Transaction ID on asset chain
}
```

**Response** `200`
```json
{
  "data": {
    "msg": string
  }
}
```

### Protocol Information

```http
GET /v1/protocol-info
```

Returns protocol configuration including fees and supported tokens.

**Response** `200`
```json
{
  "data": {
    "config": {
      "protocol_fee": number,
      "tokens": [
        {
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
          "to_token_id": string
        }
      ]
    }
  }
}
```

## Error Handling

[To be added: Common error codes and their meanings]

## Code Examples

### Complete Trading Flow Example

```typescript
// Get quote every 5 seconds while user is deciding
const getQuote = async () => {
  const quote = await api.post('/v1/solver/indicative-quote', {
    from_token_id: "usdt",
    to_token_id: "btc",
    from_token_amount: "1000000" // 1 USDT (6 decimals)
  });
  return quote.data;
};

// Initialize trade once user confirms
const initiateTrade = async (quoteData) => {
  const trade = await api.post('/v1/trades/initiate', {
    session_id: quoteData.session_id,
    from_user_address: "0x...",
    to_user_address: "bc1...",
    user_refund_address: "0x...",
    creator_public_key: "0x...",
    amount_in: "1000000",
    min_amount_out: quoteData.best_quote
  });
  
  const { depositAddress, payload, approveAddress, needApprove, approvePayload } = trade.data;

  // Handle approval if needed
  if (needApprove) {
    const approveTx = await wallet.sendTransaction(
      approveAddress,
      0,
      { data: approvePayload }
    );
    await approveTx.wait();
  }

  // Send the trade transaction
  const value = fromToken.tokenAddress === 'native' 
    ? ethers.parseUnits(amountIn, fromToken.tokenDecimals) 
    : 0n;

  const depositTx = await wallet.sendTransaction(
    depositAddress,
    value,
    {
      data: payload,
    }
  );

  // Optional: Notify about transaction
  await api.post(`/v1/trades/${trade.data.trade_id}/submit-tx`, {
    tx_id: depositTx.hash
  });

  return depositTx;
};
```
