'use client';

import { createPublicClient, createWalletClient, custom, http } from "viem";
import { arbitrumSepolia, hardhat } from "viem/chains";

const isProduction = process.env.NODE_ENV === "production";

export const publicClient = createPublicClient({
    chain: isProduction ? arbitrumSepolia : hardhat,
    transport: http()
});

export const walletClient = createWalletClient({
    chain: isProduction ? arbitrumSepolia : hardhat,
    transport: custom(window.ethereum!)
});
