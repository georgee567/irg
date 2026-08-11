import type { Metadata } from "next";
import { Inter, Bodoni_Moda } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";

import PublicLayout from "@/components/layout/PublicLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const heading = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IRG | Luxury Fashion",
  description: "Luxury Fashion & Streetwear by IRG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${heading.variable} bg-black text-white`}>

        <AuthProvider>

          <SearchProvider>

            <WishlistProvider>

              <CartProvider>

                <PublicLayout>{children}</PublicLayout>
              </CartProvider>

            </WishlistProvider>

          </SearchProvider>

        </AuthProvider>

      </body>
    </html>
  );
}