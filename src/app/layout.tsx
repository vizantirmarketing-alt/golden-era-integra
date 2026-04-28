import type { Metadata } from "next";
import {
  Anton,
  Bebas_Neue,
  Inter,
  JetBrains_Mono,
  Noto_Serif_JP,
} from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "500", "700"],
  variable: "--font-jp",
  display: "swap",
  // @ts-expect-error — `japanese` is valid for this family; Next’s font typings omit it
  subsets: ["latin", "japanese"],
});

const fontVarClasses = [
  anton.variable,
  bebasNeue.variable,
  inter.variable,
  jetbrainsMono.variable,
  notoSerifJP.variable,
].join(" ");

export const metadata: Metadata = {
  title: "Golden Era Integra — Las Vegas, Nevada",
  description:
    "A 1995 Acura Integra GS-R in Milano Red. Las Vegas, Nevada. A documented build.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVarClasses}>
      <body className="flex min-h-dvh flex-col bg-bg">
        <Nav />
        <main className="flex w-full min-h-0 flex-1 flex-col pt-[var(--nav-offset)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
