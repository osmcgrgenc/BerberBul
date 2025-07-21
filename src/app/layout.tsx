import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "BerberBul - Modern Berber Randevu Platformu",
  description: "Yakınınızdaki en iyi berberleri keşfedin ve kolayca randevu alın. Modern, hızlı ve güvenilir berber randevu platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-gray-900 font-sans">
        <a href="#content" className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 bg-emerald-600 text-white px-3 py-2 rounded">İçeriğe atla</a>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
