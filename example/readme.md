# Optimex Provider API Integration Demo

## 🚀 Project Overview

This is a **React-based web application** that demonstrates how to integrate with the **Optimex Provider API** for cross-chain token swapping. The application allows users to swap tokens between different blockchain networks (e.g., Ethereum to Bitcoin, Bitcoin to Ethereum)

### 🌐 Supported Networks

The application currently supports the following blockchain networks:

- **Bitcoin** (Mainnet & Testnet)
- **Ethereum** (Mainnet & Sepolia Testnet)

**Supported Token Types:**

- **Bitcoin**: BTC, tBTC
- **Ethereum**: ETH, USDT, USDC, and other ERC20 tokens
- **Cross-chain pairs**: BTC ↔ ETH, BTC ↔ USDT, etc.

**Network Configuration:**

- Testnet mode for development and testing
- Mainnet mode for production use
- Automatic RPC endpoint selection based on network choice

## 📋 Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **pnpm** (recommended) or **npm** or **yarn**

### Required Accounts & API Keys

- **Optimex API Key**: You'll need an API key to interact with the Optimex Protocol
- **Wallet**: MetaMask or other EVM wallet for testing
- **Bitcoin Wallet**: Unisat or similar for Bitcoin network testing

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone <repository-url>
cd provider-api-docs/example
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

The application is configured through environment variables loaded from `.env` files. The configuration is automatically loaded by the `src/config/index.ts` file.

**Required Configuration Changes:**

1. **Update API Key**: Replace `"your-api-key-here"` with your actual Optimex API key
2. **Choose Network**: Set `VITE_IS_TESTNET` to `"true"` for testing or `"false"` for mainnet
3. **Update Base URL**: Modify `VITE_OPTIMEX_BASE_URL` for your preferred endpoint

**Environment Variables:**

The application uses the following environment variables (all prefixed with `VITE_`):

```bash
# Network Configuration
VITE_IS_TESTNET=true
VITE_OPTIMEX_BASE_URL=https://provider-stg.bitdex.xyz

# API Configuration
VITE_OPTIMEX_API_KEY=your-api-key-here

# Fee and Affiliate Settings
VITE_FEE_IN_BPS=25 (0.25%)
VITE_AFFILIATE_RECEIVER_ADDRESS=0x53beBc978F5AfC70aC3bFfaD7bbD88A351123723
VITE_AFFILIATE_PROVIDER=optimex-provider

# Timeout Settings
VITE_TRADE_TIMEOUT=240 // 4h
VITE_SCRIPT_TIMEOUT=1440 // 24h. If VITE_SCRIPT_TIMEOUT is set to less than 8 hours, the trade will fail.
```

**Configuration:**

The application uses environment variables that can be configured through a `.env` file. You can copy `.env.example` to `.env` and update the values as needed.

**Optional Customizations:**

- **Fee Settings**: Adjust `VITE_FEE_IN_BPS` for different affiliate fee rates
- **Affiliate Info**: Update `VITE_AFFILIATE_RECEIVER_ADDRESS` and `VITE_AFFILIATE_PROVIDER` with your own affiliate details
- **Timeouts**: Adjust `VITE_TRADE_TIMEOUT` and `VITE_SCRIPT_TIMEOUT` as needed

### 4. Start Development Server

```bash
# Start the development server
pnpm dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

The application will be available at: `http://localhost:3000`

### 5. Build for Production

```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```

## 🧪 Testing the Application

### 1. Connect Your Wallet

1. Click the "Connect Wallet" button
2. Choose your preferred wallet (MetaMask, WalletConnect, etc.)
3. Approve the connection

### 2. Select Tokens

1. Choose the token you want to swap **From Token**
2. Choose the token you want to swap **To Token**
3. Enter the amount you want to swap

### 3. Get Quote

- The application will automatically fetch quotes
- Quotes refresh every 30 seconds
- Review the estimated output amount

### 4. Execute Swap

1. Click "Swap" to confirm
2. Approve the transaction in your wallet
3. Wait for confirmation

### API Integration

The application integrates with the Optimex Protocol API through the following endpoints:

- `GET /v1/tokens` - List available tokens and pairs
- `POST /v1/solver/indicative-quote` - Get trading quotes
- `POST /v1/trades/initiate` - Initiate trades
- `POST /v1/trades/{trade_id}/submit-tx` - Submit transaction IDs
- `GET /v1/trades/{trade_id}` - Get trade status

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to fetch" errors

- Check your internet connection
- Verify the API key is correct
- Ensure the API endpoint is accessible

#### 2. Wallet connection issues

- Make sure your wallet extension is installed
- Try refreshing the page
- Check if the wallet is unlocked

### Optimex Protocol

- [API Documentation](../readme.md)
