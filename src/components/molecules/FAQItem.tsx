"use client";
import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-slate-800 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-lg font-medium text-emerald-700 dark:text-emerald-300 focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {question}
        <span className={`ml-2 transition-transform ${open ? "rotate-180" : "rotate-0"}`}>▼</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
      >
        <p className="text-gray-600 dark:text-gray-300 text-base">{answer}</p>
      </div>
    </div>
  );
} 