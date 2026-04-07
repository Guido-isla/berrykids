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
            className="font-bold text-[#F4A09C] underline decoration-[#F4A09C]/30 underline-offset-2 transition-colors hover:text-[#E88E8A]"
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
      <div className="flex flex-1 flex-col p-4 sm:p-5">
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#F4A09C]">
            Berry&apos;s dagplan
          </span>
        </div>

        <div className="flex-1 space-y-2">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`text-xs leading-relaxed sm:text-[13px] ${
                line.startsWith("☀️") || line.startsWith("🌤️") || line.startsWith("☕") || line.startsWith("🌷") || line.startsWith("❄️") || line.startsWith("🍂") || line.startsWith("☀")
                  ? "rounded-lg bg-[#FFF8F4] px-3 py-2 text-[#2D2D2D]"
                  : i === 0
                    ? "font-semibold text-[#2D2D2D]"
                    : "text-[#2D2D2D]"
              }`}
            >
              {renderLine(line)}
            </p>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-[#6B6B6B]">{weatherLine}</p>
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
              className="min-w-0 flex-1 rounded-full border border-[#F0E6E0] bg-[#FFF8F4] px-3 py-2.5 text-xs outline-none focus:border-[#F4A09C]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#F4A09C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#E88E8A]"
            >
              📬
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
