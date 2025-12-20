import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "El Paseo Auto Group | Luxury Vehicles in Palm Desert",
  description:
    "Discover exceptional luxury and exotic vehicles at El Paseo Auto Group. Premium selection of high-end automobiles in Palm Desert, California.",
  keywords: [
    "luxury cars",
    "exotic vehicles",
    "Palm Desert",
    "El Paseo",
    "premium automobiles",
    "McLaren",
    "Ferrari",
    "Porsche",
    "Bentley",
  ],
  openGraph: {
    title: "El Paseo Auto Group | Luxury Vehicles",
    description: "Premium luxury and exotic vehicles in Palm Desert, California",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${montserrat.variable} font-body antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
