import type { Metadata } from "next";
import { Press_Start_2P, VT323, Montserrat, Caveat, Space_Mono, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono-retro",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwritten",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  icons: { icon: "/logo.png" },
  title: "Varuun Reddy — Product Designer",
  description:
    "Product Designer with experience across B2B, healthcare, EdTech, EV, Utility, and Retail. Based in Dallas, TX.",
  openGraph: {
    title: "Varuun Reddy — Product Designer",
    description:
      "Product Designer crafting scalable, human-centered digital experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pressStart2P.variable} ${vt323.variable} ${montserrat.variable} ${caveat.variable} ${spaceMono.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
