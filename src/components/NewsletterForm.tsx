"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterForm({ variant = "default" }: { variant?: "default" | "hero" }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={`rounded-2xl ${variant === "hero" ? "bg-white/60 p-4" : "bg-[#FDF1EA] p-6"} text-center`}>
        <p className="text-lg font-bold text-[#2D2D2D]">Je bent erbij! 🍓</p>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          We sturen je elke week de leukste tips.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        placeholder="je@email.nl"
        className="min-w-0 flex-1 rounded-full border border-[#F0E6E0] bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#999] focus:border-[#F4A09C]"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-[#F4A09C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E88E8A]"
      >
        {variant === "hero" ? "Aanmelden" : "Inschrijven"}
      </button>
    </form>
  );
}
