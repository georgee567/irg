import type { Metadata } from "next";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";

import PageLoader from "@/components/ui/PageLoader";
import CustomCursor from "@/components/ui/CustomCursor";
import BackToTop from "@/components/ui/BackToTop";
import PageTransition from "@/components/ui/PageTransition";

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
      <body className="bg-black text-white">

        <AuthProvider>

          <SearchProvider>

            <WishlistProvider>

              <CartProvider>

                {/* <PageLoader /> */}

{/* <CustomCursor /> */}

{/* <BackToTop /> */}

{/* 
<PageTransition>
  {children}
</PageTransition>
*/}

{children}
              </CartProvider>

            </WishlistProvider>

          </SearchProvider>

        </AuthProvider>

      </body>
    </html>
  );
}