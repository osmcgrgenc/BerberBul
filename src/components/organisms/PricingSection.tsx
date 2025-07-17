import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Başlangıç",
    price: "Ücretsiz",
    features: [
      "Sınırsız berber arama",
      "Randevu oluşturma",
      "Temel destek",
    ],
    cta: "Hemen Başla",
    highlight: false,
  },
  {
    name: "Profesyonel",
    price: "₺99/ay",
    features: [
      "Tüm Başlangıç özellikleri",
      "Takvim entegrasyonu",
      "Öncelikli destek",
      "İstatistikler ve raporlar",
    ],
    cta: "Profesyonel Ol",
    highlight: true,
  },
  {
    name: "Kurumsal",
    price: "İletişime Geçin",
    features: [
      "Tüm Profesyonel özellikler",
      "Çoklu şube yönetimi",
      "Özel entegrasyonlar",
      "Kurumsal destek",
    ],
    cta: "Teklif Al",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h2 className="text-3xl font-bold text-center mb-10 text-emerald-700 dark:text-emerald-300">Fiyatlandırma</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 ${plan.highlight ? "ring-2 ring-emerald-400" : ""}`}
          >
            <div className="text-xl font-bold mb-2 text-emerald-700 dark:text-emerald-300">{plan.name}</div>
            <div className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">{plan.price}</div>
            <ul className="mb-6 space-y-2">
              {plan.features.map((f, j) => (
                <li key={j} className="text-gray-600 dark:text-gray-300 text-sm">{f}</li>
              ))}
            </ul>
            <Button variant={plan.highlight ? "default" : "outline"} size="lg" className="w-full">
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
} 