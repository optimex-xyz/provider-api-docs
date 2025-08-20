import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";

import "./index.css";
import App from "./App.tsx";
import { WalletProvider } from "./context/index.tsx";
import "@rainbow-me/rainbowkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// Ensure root element exists
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const queryClient = new QueryClient();

const root = createRoot(rootElement);

// Wrap the app with all providers
const AppWithProviders = () => (
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);

root.render(<AppWithProviders />);
