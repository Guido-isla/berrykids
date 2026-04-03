"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BerryTip } from "@/lib/berry-brain";

export default function Sidebar({
  tip,
  weatherLine,
}: {
  tip: BerryTip;
  weatherLine: string;
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubscribed(true);
  }

  const lines = tip.message.split("\n").filter((l) => l.trim());

  // Render [text](href) as links within a line
  function renderLine(text: string) {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const isExternal = match[2].startsWith("http");
        return (
          <Link
            key={i}
            href={match[2]}
            target={isExternal ? "_blank" : undefined}
            className="font-bold text-[#E85A5A] underline decoration-[#E85A5A]/30 underline-offset-2 transition-colors hover:text-[#D04A4A]"
          >
            {match[1]}
          </Link>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Berry's day plan — takes the whole card */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="animate-berry-bounce shrink-0">
            <Image
              src="/berry-wink.png"
              alt=""
              width={52}
              height={52}
              className="h-[52px] w-auto drop-shadow-sm"
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E85A5A]">
            Berry&apos;s dagplan
          </span>
        </div>

        <div className="flex-1 space-y-2">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`text-[13px] leading-relaxed ${
                line.startsWith("☀️") || line.startsWith("🌤️") || line.startsWith("☕") || line.startsWith("🌷") || line.startsWith("❄️") || line.startsWith("🍂") || line.startsWith("☀")
                  ? "rounded-lg bg-[#FFF8F4] px-3 py-2 text-[#2B2B2B]"
                  : i === 0
                    ? "font-semibold text-[#2B2B2B]"
                    : "text-[#2B2B2B]"
              }`}
            >
              {renderLine(line)}
            </p>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-[#999]">{weatherLine}</p>
      </div>

      {/* Newsletter — tiny bottom bar */}
      <div className="border-t border-[#F0E6E0] px-4 py-2">
        {subscribed ? (
          <p className="text-center text-xs text-[#6FAF3A]">Je bent erbij! 🍓</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-1.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="je@email.nl"
              className="min-w-0 flex-1 rounded-full border border-[#F0E6E0] bg-[#FFF8F4] px-3 py-1.5 text-xs outline-none focus:border-[#E85A5A]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#E85A5A] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#D04A4A]"
            >
              📬
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
