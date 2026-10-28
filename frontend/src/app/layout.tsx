import type { Metadata } from "next";
import { Inter, Cormorant_Infant, Tangerine } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { AuthModalProvider } from "../context/AuthModalContext";
import { WishlistProvider } from "../context/WishlistContext";
import { CartProvider } from "../context/CartContext";
import { WhatsAppFloatingButton } from "../components/layout/WhatsAppFloatingButton";

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

const tangerine = Tangerine({
  variable: "--font-tangerine",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zeyloraa | Bespoke Ceylon Sapphire & Fine Jewellery",
  description:
    "Handcrafted Ceylon sapphire jewellery in 925 sterling silver and solid gold, ethically sourced from Sri Lanka and delivered to Australia and worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${tangerine.variable} ${inter.className} h-full antialiased`}
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
