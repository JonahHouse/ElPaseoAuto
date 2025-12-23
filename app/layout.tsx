import type { Metadata } from "next";
import { Fjalla_One, Montserrat } from "next/font/google";
import "./globals.css";

const fjallaOne = Fjalla_One({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
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
        className={`${fjallaOne.variable} ${montserrat.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
