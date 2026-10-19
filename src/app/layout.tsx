import type { Metadata } from "next";
import { Press_Start_2P, VT323, Montserrat, Caveat, Space_Mono, Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
      className={`${pressStart2P.variable} ${vt323.variable} ${montserrat.variable} ${caveat.variable} ${spaceMono.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>{children}</body>
      <Script id="clarity-analytics" strategy="afterInteractive">{`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "xbph1yq6pj");
      `}</Script>
    </html>
  );
}
