import FAQItem from "@/components/molecules/FAQItem";

const faqs = [
  {
    question: "BerberBul nedir?",
    answer: "BerberBul, yakınınızdaki en iyi berberleri keşfetmenizi ve kolayca randevu almanızı sağlayan modern bir platformdur.",
  },
  {
    question: "Kayıt olmak ücretli mi?",
    answer: "Hayır, BerberBul'a kayıt olmak tamamen ücretsizdir.",
  },
  {
    question: "Randevu almak için üye olmak zorunda mıyım?",
    answer: "Evet, randevu almak ve yönetmek için ücretsiz bir hesap oluşturmanız gerekir.",
  },
  {
    question: "Berber olarak nasıl kayıt olabilirim?",
    answer: "Ana sayfadaki 'Berber Olarak Kayıt Ol' butonunu kullanarak kolayca başvuru yapabilirsiniz.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-16 animate-in fade-in slide-in-from-right-8 duration-700">
      <h2 className="text-3xl font-bold text-center mb-10 text-emerald-700 dark:text-emerald-300">Sıkça Sorulan Sorular</h2>
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow p-8 border border-gray-100 dark:border-slate-800">
        {faqs.map((faq, i) => (
          <FAQItem key={i} {...faq} />
        ))}
      </div>
    </section>
  );
} 