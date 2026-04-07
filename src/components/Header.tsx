"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-[880px] items-center justify-between px-5 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/berry-icon.png" alt="" width={36} height={36} className="h-8 w-auto" />
          <span className="text-[16px] font-extrabold text-[#F4A09C]">Berry Kids</span>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
