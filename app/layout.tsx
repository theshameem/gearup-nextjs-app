import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { AppProviders } from "@/providers/AppProviders";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GearUp — Rent Sports & Outdoor Gear Instantly",
  description:
    "Browse sports & outdoor gear, place rental orders, pay securely via Stripe, and track everything from your dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <AppProviders>
          <Suspense fallback={null}>
            <SiteNavbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
