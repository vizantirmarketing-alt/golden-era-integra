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
import { seo } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

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
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: seo.siteName,
    template: `%s | ${seo.siteName}`,
  },
  description: seo.defaultDescription,
  applicationName: seo.siteName,
  verification: {
    google: seo.googleSiteVerification,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: seo.siteName,
    title: seo.home.titleAbsolute,
    description: seo.home.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.home.titleAbsolute,
    description: seo.home.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVarClasses}>
      <body className="flex min-h-dvh flex-col bg-bg">
        <a
          href="#main-content"
          className="fixed left-4 z-[100] translate-y-[-120%] rounded border border-line bg-bg px-4 py-3 font-mono text-[10px] tracking-[0.28em] text-ink uppercase shadow-[0_8px_30px_rgba(26,14,46,0.12)] transition-transform focus:translate-y-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Skip to content
        </a>
        <Nav />
        <main
          id="main-content"
          className="flex w-full min-h-0 flex-1 flex-col pt-[var(--nav-offset)]"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
