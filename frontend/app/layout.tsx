import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import RainbowKitAndWagmiProvider from "./RainbowKitAndWagmiProvider";
import Navigation from "./components/shared/navigation";
import Footer from "./components/shared/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FruitFable",
  description: "Generate your fruit!",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RainbowKitAndWagmiProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </RainbowKitAndWagmiProvider>
      </body>
    </html>
  );
}
