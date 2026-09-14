import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://damien.rw";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Damien Real Estate — Find your place in Rwanda",
    template: "%s · Damien Real Estate",
  },
  description:
    "Discover homes, apartments and land in Rwanda. Search properties, compare options and contact Damien — without the usual hassle.",
  openGraph: {
    type: "website",
    locale: "en_RW",
    siteName: "Damien Real Estate",
    title: "Damien Real Estate — Find your place in Rwanda",
    description:
      "Homes, apartments and properties made easier to find across Rwanda.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Damien Real Estate",
    description: "Find your place in Rwanda.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
