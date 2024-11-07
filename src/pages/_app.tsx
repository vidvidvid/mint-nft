import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Toaster } from "@/components/ui/toaster";
import { alchemyService } from "@/lib/alchemy";
import { useEffect, useState } from "react";
import { getConfig } from "@/wagmi";

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [wagmiConfig, setWagmiConfig] = useState(getConfig()); // Initial config with dummy endpoint

  useEffect(() => {
    const initializeConfig = async () => {
      await alchemyService.initialize();
      setWagmiConfig(getConfig()); // Get updated config with real endpoint
    };

    initializeConfig();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider showRecentTransactions={true}>
          <Component {...pageProps} />
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
