'use client';

// Style
import '@rainbow-me/rainbowkit/styles.css';

// RainbowKit, Wagmi and ReactQuery
import { darkTheme, RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

// Chains from wagmi
import {
    hardhat
  } from 'wagmi/chains';

// TypeScript interface
interface RainbowKitProviderProps {
    children: React.ReactNode;
}

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(),
  },
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