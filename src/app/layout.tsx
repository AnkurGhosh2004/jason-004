import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LieLoop — Think you know them? Prove it. 👀",
  description:
    "A fun friend quiz. They answer honestly. You guess what they said. Let's see how well you actually know them.",
  keywords: [
    "LieLoop",
    "friend quiz",
    "viral party game",
    "social game",
    "how well do you know me",
  ],
  authors: [{ name: "LieLoop Team" }],
  openGraph: {
    title: "LieLoop — Think you know them? Prove it. 👀",
    description: "They answer honestly. You guess what they said. Let's see who knows who best.",
    type: "website",
    siteName: "LieLoop",
  },
  twitter: {
    card: "summary_large_image",
    title: "LieLoop 👀 — Think you know them? Prove it.",
    description: "The viral friend lie prediction game.",
  },
  other: {
    "google-adsense-account": "ca-pub-7812422659353355",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FAF7EF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7812422659353355"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7EF] text-[#111111] selection:bg-[#FF2B2B] selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-start w-full relative z-10 pb-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
