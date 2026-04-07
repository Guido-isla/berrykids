"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/berry-icon.png" alt="" width={40} height={40} className="h-9 w-auto" />
          <span className="text-[16px] font-extrabold text-[#F4A09C]">Berry Kids</span>
          <span className="flex items-center gap-1 rounded-full bg-[#2D2D2D]/[0.06] px-2.5 py-1 text-[10px] font-bold text-[#2D2D2D]/40">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" /></svg>
            Haarlem e.o.
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {searchOpen ? (
            <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); window.location.href = `/?q=${encodeURIComponent(query)}`; }}>
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoeken..." autoFocus className="w-32 sm:w-40 border-b-2 border-[#F4A09C] bg-transparent px-1 py-1 text-sm outline-none" />
              <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-[#BBB]">✕</button>
            </form>
          ) : (
            <>
              <Link href="/activiteiten" className="hidden text-[12px] font-bold text-[#2D2D2D]/25 hover:text-[#F4A09C] sm:inline">
                Activiteiten
              </Link>
              <Link href="/vakanties" className="hidden text-[12px] font-bold text-[#2D2D2D]/25 hover:text-[#F4A09C] sm:inline">
                Vakanties
              </Link>
              <button onClick={() => setSearchOpen(true)} className="text-[12px] font-bold text-[#2D2D2D]/25 hover:text-[#F4A09C]">
                Zoeken
              </button>
              <span className="ml-2 flex items-center rounded-full border border-[#E8E0D8] text-[10px] font-bold text-[#6B6B6B]">
                <span className="rounded-full bg-[#F4A09C] px-2 py-1 text-white">NL</span>
                <span className="px-2 py-1 opacity-50">EN</span>
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
