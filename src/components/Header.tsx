"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3 sm:px-8 sm:py-5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/berry-icon.png" alt="" width={40} height={40} className="h-8 w-auto sm:h-9" />
          <span className="text-[15px] font-extrabold text-[#E0685F] sm:text-[16px]">Berry Kids</span>
          <span className="flex items-center gap-1 rounded-full bg-[#2D2D2D]/[0.06] px-2 py-0.5 text-[10px] font-bold text-[#6B6B6B]">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" /></svg>
            {t("haarlem")}
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {searchOpen ? (
            <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); if (query.trim()) window.location.href = `/${locale === "nl" ? "" : locale + "/"}activiteiten?q=${encodeURIComponent(query.trim())}`; }}>
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchPlaceholder")} autoFocus className="w-36 sm:w-48 rounded-full border border-[#E0685F] bg-white px-3 py-1.5 text-[13px] outline-none" />
              <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-[13px] text-[#6B6B6B]">✕</button>
            </form>
          ) : (
            <>
              <Link href="/activiteiten" className="hidden text-[13px] font-bold text-[#6B6B6B] hover:text-[#E0685F] sm:inline">
                {t("activities")}
              </Link>
              <Link href="/evenementen" className="hidden text-[13px] font-bold text-[#6B6B6B] hover:text-[#E0685F] sm:inline">
                {t("events")}
              </Link>
              <Link href="/vakanties" className="hidden text-[13px] font-bold text-[#6B6B6B] hover:text-[#E0685F] sm:inline">
                {t("vacations")}
              </Link>
              <button onClick={() => setSearchOpen(true)} className="text-[13px] font-bold text-[#6B6B6B] hover:text-[#E0685F]">
                <svg className="h-5 w-5 sm:hidden" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <span className="hidden sm:inline">{t("search")}</span>
              </button>
              {/* Locale toggle */}
              <span className="flex items-center rounded-full border border-[#E8E0D8] text-[11px] font-bold">
                <Link
                  href={pathname}
                  locale="nl"
                  className={`rounded-full px-2.5 py-1 transition-colors ${locale === "nl" ? "bg-[#E0685F] text-white" : "text-[#6B6B6B] hover:text-[#2D2D2D]"}`}
                >
                  NL
                </Link>
                <Link
                  href={pathname}
                  locale="en"
                  className={`rounded-full px-2.5 py-1 transition-colors ${locale === "en" ? "bg-[#E0685F] text-white" : "text-[#6B6B6B] hover:text-[#2D2D2D]"}`}
                >
                  EN
                </Link>
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
