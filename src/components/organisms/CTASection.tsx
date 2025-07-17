import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="text-center py-16">
      <div className="inline-block bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl px-10 py-10 shadow-2xl animate-in fade-in zoom-in">
        <h2 className="text-3xl font-bold text-white mb-4">Hemen Katılın</h2>
        <p className="text-lg text-white/90 mb-6 max-w-md mx-auto">BerberBul&apos;a katılarak ister müşteri ister berber olarak dijitalde yerinizi alın. Kolay randevu yönetimi, yeni müşteriler ve daha fazlası sizi bekliyor.</p>
        <Button asChild variant="default" size="lg" className="text-lg">
          <Link href="/signup">Kayıt Ol</Link>
        </Button>
      </div>
    </section>
  );
} 