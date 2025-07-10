'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Mesajınız başarıyla gönderildi!");
    }, 1200);
  };
  return (
    <section className="py-16 animate-in fade-in slide-in-from-left-8 duration-700">
      <h2 className="text-3xl font-bold text-center mb-10 text-emerald-700 dark:text-emerald-300">İletişim</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-xl shadow p-8 border border-gray-100 dark:border-slate-800 flex flex-col gap-5">
        <input
          type="text"
          name="name"
          required
          placeholder="Adınız"
          className="rounded-md border border-gray-200 dark:border-slate-700 bg-transparent px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="E-posta"
          className="rounded-md border border-gray-200 dark:border-slate-700 bg-transparent px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
        <textarea
          name="message"
          required
          placeholder="Mesajınız"
          rows={4}
          className="rounded-md border border-gray-200 dark:border-slate-700 bg-transparent px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Gönderiliyor..." : "Gönder"}
        </Button>
      </form>
    </section>
  );
} 