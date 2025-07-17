
import React from 'react';

export default function ContactPage() {
  return (
    <div className="prose dark:prose-invert mx-auto py-8">
      <h1>İletişim</h1>
      <p>Her türlü soru, öneri ve geri bildiriminiz için bizimle iletişime geçebilirsiniz.</p>
      <ul>
        <li><strong>E-posta:</strong> info@berberbul.com</li>
        <li><strong>Telefon:</strong> +90 555 123 45 67</li>
        <li><strong>Adres:</strong> Örnek Mah. Deneme Cad. No: 1, Örnek Şehir, Türkiye</li>
      </ul>
      {/* Buraya bir iletişim formu eklenebilir */}
    </div>
  );
}
