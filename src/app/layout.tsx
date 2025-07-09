import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton";
import { Suspense } from "react";
import Link from "next/link";
import { TenantProvider } from "@/context/TenantContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Berberbul - Multitenant SaaS Barber Booking Platform",
  description: "A multitenant SaaS barber booking platform built with Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TenantProvider>
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
              <Link href="/">
                <h1 className="font-bold text-lg">Berberbul</h1>
              </Link>
              <Suspense fallback={<div>Loading...</div>}>
                <AuthButton />
              </Suspense>
            </div>
          </nav>
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
        </TenantProvider>
      </body>
    </html>
  );
}
