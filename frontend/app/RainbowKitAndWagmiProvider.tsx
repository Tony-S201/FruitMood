'use client';

// Style
import '@rainbow-me/rainbowkit/styles.css';

// RainbowKit, Wagmi and ReactQuery
import { darkTheme, RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

// Chains from wagmi
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    hardhat
  } from 'wagmi/chains';

// TypeScript interface
interface RainbowKitProviderProps {
    children: React.ReactNode;
}

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  chains: [mainnet, polygon, optimism, arbitrum, base, hardhat],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const RainbowKitAndWagmiProvider: React.FC<RainbowKitProviderProps> = ({children}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: "#00000",
          borderRadius: "small",
        })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default RainbowKitAndWagmiProvider