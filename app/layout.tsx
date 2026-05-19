import { CoinBalance } from "@/components/CoinBalance";
import { CoinsProvider } from "@/components/CoinsProvider";
import type { Metadata } from "next";
import { Libre_Baskerville, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const serif = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Press Dernocrat Daily | A Parody News Source",
  description:
    "Press Dernocrat Daily — parody Sonoma County headlines and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <CoinsProvider>
          <CoinBalance />
          {children}
        </CoinsProvider>
      </body>
    </html>
  );
}
