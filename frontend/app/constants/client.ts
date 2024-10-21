'use client';

import { createPublicClient, createWalletClient, custom, http, PublicClient, WalletClient } from "viem";
import { arbitrumSepolia, hardhat } from "viem/chains";

const isProduction = process.env.NODE_ENV === "production";

export const publicClient: PublicClient = createPublicClient({
    chain: isProduction ? arbitrumSepolia : hardhat,
    transport: http()
});

export const createWalletClientInstance = (): WalletClient => {
    const walletClient = createWalletClient({
        chain: isProduction ? arbitrumSepolia : hardhat,
        transport: custom(window.ethereum!)
    });
    return walletClient;
};
