import type { Metadata } from "next";
import { Inter, Cormorant_Infant } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { AuthModalProvider } from "../context/AuthModalContext";
import { WishlistProvider } from "../context/WishlistContext";
import { CartProvider } from "../context/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Infant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura Ceylon | Bespoke Ceylon Sapphire & Fine Jewellery",
  description:
    "Handcrafted Ceylon sapphire jewellery in 925 sterling silver and solid gold, ethically sourced from Sri Lanka and delivered to Australia and worldwide.",
};

import { WhatsAppFloatingButton } from "../components/layout/WhatsAppFloatingButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900 font-sans selection:bg-black selection:text-white">
        <AuthProvider>
          <AuthModalProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <WhatsAppFloatingButton />
              </CartProvider>
            </WishlistProvider>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
