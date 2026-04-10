"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tappedHref, setTappedHref] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  // Lock scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setTappedHref(null);
  }, [pathname]);

  const navLinks = [
    { href: "/activiteiten", label: t("activities"), match: (p: string) => p.startsWith("/activiteiten") },
    { href: "/evenementen", label: t("events"), match: (p: string) => p.startsWith("/evenementen") || p.startsWith("/event") },
    { href: "/vakanties", label: t("vacations"), match: (p: string) => p.startsWith("/vakanties") },
    { href: "/opgeslagen", label: t("saved"), match: (p: string) => p.startsWith("/opgeslagen") },
  ];

  return (
    <header className="relative z-30">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3 sm:px-8 sm:py-5">
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#2D2D2D] shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#FFF3E0] sm:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/berry-icon.png" alt="" width={40} height={40} className="h-8 w-auto sm:h-9" />
            <span className="text-[15px] font-extrabold text-[#E0685F] sm:text-[16px]">Berry Kids</span>
            <span className="hidden items-center gap-1 rounded-full bg-[#2D2D2D]/[0.06] px-2 py-0.5 text-[10px] font-bold text-[#6B6B6B] sm:flex">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" /></svg>
              {t("haarlem")}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          {searchOpen ? (
            <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); if (query.trim()) window.location.href = `/${locale === "nl" ? "" : locale + "/"}activiteiten?q=${encodeURIComponent(query.trim())}`; }}>
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchPlaceholder")} autoFocus className="w-36 sm:w-48 rounded-full border border-[#E0685F] bg-white px-3 py-1.5 text-[13px] outline-none" />
              <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-[13px] text-[#6B6B6B]">✕</button>
            </form>
          ) : (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hidden text-[13px] font-bold sm:inline ${link.match(pathname) ? "text-[#E0685F]" : "text-[#6B6B6B] hover:text-[#E0685F]"}`}
                >
                  {link.label}
                </Link>
              ))}
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

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#2D2D2D]/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          {/* Panel — slides in from left */}
          <div className="absolute inset-y-0 left-0 w-[82%] max-w-[340px] bg-[#FFF9F0] shadow-[8px_0_40px_rgba(0,0,0,0.2)]">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#F0ECE8] px-5 py-4">
                <div className="flex items-center gap-2">
                  <Image src="/berry-icon.png" alt="" width={36} height={36} className="h-9 w-auto" />
                  <span className="text-[16px] font-extrabold text-[#E0685F]">Berry Kids</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#6B6B6B] hover:bg-[#FFF3E0]"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {[
                  { href: "/", label: "Home", emoji: "🏠", isHome: true },
                  ...navLinks.map((link, i) => ({ ...link, emoji: ["🎯", "📅", "🌷", "❤️"][i], isHome: false })),
                ].map((item) => {
                  const isActive = item.isHome ? pathname === "/" : (item as typeof navLinks[number]).match(pathname);
                  const isTapped = tappedHref === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setTappedHref(item.href)}
                      className={`flex items-center gap-3 rounded-[14px] px-4 py-3 text-[16px] font-bold transition-all duration-150 active:scale-[0.97] ${
                        isTapped
                          ? "scale-[0.98] bg-[#FFE4C4] text-[#E0685F]"
                          : isActive
                          ? "bg-[#FFF3E0] text-[#E0685F]"
                          : "text-[#2D2D2D] active:bg-[#FFE4C4] active:text-[#E0685F]"
                      }`}
                    >
                      <span className="text-[20px]">{item.emoji}</span>
                      <span className="flex-1">{item.label}</span>
                      {isTapped && (
                        <svg className="h-4 w-4 animate-spin text-[#E0685F]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Newsletter CTA */}
              <div className="px-3 pb-3">
                <Link
                  href="/#newsletter"
                  className="block rounded-[16px] bg-gradient-to-br from-[#E0685F] to-[#FFD8B0] p-4 text-white shadow-[0_4px_16px_rgba(224,104,95,0.2)]"
                >
                  <div className="flex items-center gap-2.5">
                    <Image src="/berry-wink.png" alt="" width={36} height={36} className="h-9 w-auto shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-extrabold leading-tight">Weekend sorted</p>
                      <p className="mt-0.5 text-[12px] font-semibold leading-tight text-white/90">
                        Elke vrijdag in je inbox →
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Footer: locale + location */}
              <div className="border-t border-[#F0ECE8] px-5 py-4">
                <div className="mb-3 flex items-center gap-1 text-[12px] font-semibold text-[#6B6B6B]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" /></svg>
                  {t("haarlem")}
                </div>
                <span className="flex w-fit items-center rounded-full border border-[#E8E0D8] bg-white text-[12px] font-bold">
                  <Link
                    href={pathname}
                    locale="nl"
                    className={`rounded-full px-3 py-1 transition-colors ${locale === "nl" ? "bg-[#E0685F] text-white" : "text-[#6B6B6B]"}`}
                  >
                    NL
                  </Link>
                  <Link
                    href={pathname}
                    locale="en"
                    className={`rounded-full px-3 py-1 transition-colors ${locale === "en" ? "bg-[#E0685F] text-white" : "text-[#6B6B6B]"}`}
                  >
                    EN
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
