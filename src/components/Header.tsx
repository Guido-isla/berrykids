"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <>
      {/* Top nav */}
      <header className="border-b border-black/[0.06]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-2.5">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/berry-icon.png" alt="" width={36} height={36} className="h-9 w-auto" />
              <div>
                <Image src="/logo-text.png" alt="Berry Kids" width={80} height={22} className="h-[18px] w-auto" />
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#E85A5A]">Haarlem e.o.</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-5">
            {searchOpen ? (
              <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); window.location.href = `/?q=${encodeURIComponent(query)}`; }}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoeken..." autoFocus className="w-48 border-b-2 border-[#1A1A1A] bg-transparent px-1 py-1 text-sm outline-none" />
                <button type="button" onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-[#666]">✕</button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#E85A5A]">
                Zoeken
              </button>
            )}
            <a href="#newsletter" className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:text-[#E85A5A]">
              Nieuwsbrief
            </a>
          </div>
        </div>
      </header>

      {/* Category bar — red like Time Out */}
      <nav className="bg-[#E85A5A]">
        <div className="mx-auto flex max-w-[1200px] items-center gap-6 overflow-x-auto px-5 py-2 text-xs font-bold uppercase tracking-wider text-white scrollbar-none">
          <Link href="/" className="shrink-0 hover:text-white/80">Dit weekend</Link>
          <Link href="/activiteiten" className="shrink-0 hover:text-white/80">Activiteiten</Link>
          <Link href="/vakanties" className="shrink-0 hover:text-white/80">Vakanties</Link>
          <Link href="/insturen" className="shrink-0 hover:text-white/80">Event insturen</Link>
        </div>
      </nav>
    </>
  );
}
