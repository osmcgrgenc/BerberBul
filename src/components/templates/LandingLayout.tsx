import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import { ReactNode } from "react";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12 md:py-20">{children}</main>
      <Footer />
    </div>
  );
} 