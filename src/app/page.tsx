import LandingLayout from "@/components/templates/LandingLayout";
import CTASection from "@/components/organisms/CTASection";
import TestimonialCard from "@/components/molecules/TestimonialCard";
import { Button } from "@/components/ui/button";
import PricingSection from "@/components/organisms/PricingSection";
import FAQSection from "@/components/organisms/FAQSection";
import ContactSection from "@/components/organisms/ContactSection";
import { CalendarDays, Scissors, Search } from "lucide-react";

export default function Home() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative text-center py-16 md:py-24 animate-in fade-in slide-in-from-top-8 duration-700 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-emerald-600 via-blue-500 to-teal-400 bg-clip-text text-transparent animate-in fade-in delay-100">
          BerberBul ile Yeni Bir Sen
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-10 max-w-2xl mx-auto animate-in fade-in delay-200">
          Yakınındaki en iyi berberleri keşfet, kolayca randevu al. Modern, hızlı ve güvenilir berber randevu platformu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in delay-300">
          <Button asChild size="lg" className="text-lg shadow-lg hover:shadow-xl transition-all">
            <a href="/signup">Hemen Başla</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg shadow hover:shadow-lg transition-all">
            <a href="/login">Giriş Yap</a>
          </Button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 text-center border border-gray-100 dark:border-slate-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="mb-4 inline-block p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full group-hover:scale-110 transition-transform">
              <Search className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-emerald-700 dark:text-emerald-300">Berberleri Keşfet</h3>
            <p className="text-gray-600 dark:text-gray-300">Bölgenizdeki en iyi berberleri kolayca bulun.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 text-center border border-gray-100 dark:border-slate-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="mb-4 inline-block p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full group-hover:scale-110 transition-transform">
              <CalendarDays className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-emerald-700 dark:text-emerald-300">Kolayca Randevu Al</h3>
            <p className="text-gray-600 dark:text-gray-300">Uygun tarih ve saati seçerek randevunuzu oluşturun.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 text-center border border-gray-100 dark:border-slate-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="mb-4 inline-block p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full group-hover:scale-110 transition-transform">
              <Scissors className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
            </div>
            <h3 className="font-semibold text-xl mb-2 text-emerald-700 dark:text-emerald-300">Keyfini Çıkar</h3>
            <p className="text-gray-600 dark:text-gray-300">Randevu saatinizde berberinizde olun ve yeni görünümünüzün tadını çıkarın.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 animate-in fade-in slide-in-from-left-8 duration-700">
        <h2 className="text-3xl font-bold text-center mb-12 text-emerald-700 dark:text-emerald-300 animate-in fade-in delay-100">Müşterilerimiz Ne Diyor?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="animate-in fade-in zoom-in duration-700">
            <TestimonialCard
              name="Ahmet Yılmaz"
              text="BerberBul randevu almayı çok kolaylaştırdı! Dakikalar içinde yeni favori berberimi buldum."
              role="Müşteri"
            />
          </div>
          <div className="animate-in fade-in zoom-in duration-700 delay-200">
            <TestimonialCard
              name="Mehmet Şahin"
              text="Berberler için randevularını yönetmek için harika bir platform. Kesinlikle tavsiye ederim!"
              role="Berber"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact Section */}
      <ContactSection />

      {/* CTA Section */}
      <div className="animate-in fade-in zoom-in duration-700 delay-200">
        <CTASection />
      </div>
    </LandingLayout>
  );
} 