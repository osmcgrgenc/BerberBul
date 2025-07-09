import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import AuthButton from "@/components/AuthButton";
import { Suspense } from "react";
import Link from "next/link";
import { TenantProvider } from "@/context/TenantContext";
import { Toaster } from "@/components/ui/sonner"; // Toaster'ı import et

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
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
        className={`${manrope.variable} font-sans antialiased`}
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
        <Toaster /> {/* Toaster bileşenini ekle */}
      </body>
    </html>
  );
}
