import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import RainbowKitAndWagmiProvider from "./RainbowKitAndWagmiProvider";
import Navigation from "./components/shared/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FruitMood",
  description: "Generate your fruit!",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className={inter.className}>
        <RainbowKitAndWagmiProvider>
          <Navigation />
          <main>{children}</main>
        </RainbowKitAndWagmiProvider>
      </body>
    </html>
  );
}
