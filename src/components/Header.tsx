"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <header className="border-b border-[#F0EBE6]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/berry-icon.png"
              alt="Berry Kids"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <Image
                src="/logo-text.png"
                alt="Berry Kids"
                width={90}
                height={24}
                className="h-5 w-auto"
              />
              <p className="text-[10px] font-semibold text-[#E85A5A]">Haarlem e.o.</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-[#1A1A1A] md:flex">
            <Link href="/" className="transition-colors hover:text-[#E85A5A]">
              Dit weekend
            </Link>
            <Link href="/activiteiten" className="transition-colors hover:text-[#E85A5A]">
              Activiteiten
            </Link>
            <Link href="/vakanties" className="transition-colors hover:text-[#E85A5A]">
              Vakanties
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form
              action="/"
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/?q=${encodeURIComponent(query)}`;
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zoeken..."
                autoFocus
                className="w-full rounded-lg border border-[#E0D8D2] px-3 py-2 text-sm outline-none focus:border-[#E85A5A] sm:w-48"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setQuery(""); }}
                className="text-[#666] hover:text-[#1A1A1A]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[#666] transition-colors hover:text-[#1A1A1A]"
              aria-label="Zoeken"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          )}

          <a
            href="#newsletter"
            className="rounded-full bg-[#E85A5A] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#D04A4A]"
          >
            Nieuwsbrief
          </a>
        </div>
      </div>
    </header>
  );
}
