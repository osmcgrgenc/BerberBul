export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 py-6 mt-12">
      <div className="container max-w-7xl mx-auto text-center text-gray-400 text-xs tracking-wide">
        &copy; {new Date().getFullYear()} BerberBul. Tüm hakları saklıdır.
      </div>
    </footer>
  );
} 