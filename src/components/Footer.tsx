import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#F0E6E0] bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <span className="text-sm font-bold text-[#2B2B2B]">Berry Kids</span>
            <p className="mt-1 max-w-xs text-xs text-[#999]">
              De leukste uitjes en activiteiten voor gezinnen in de regio Haarlem.
            </p>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#999]">Ontdek</p>
              <Link href="/" className="block text-[#6B6B6B] transition-colors hover:text-[#2B2B2B]">Dit weekend</Link>
              <Link href="/activiteiten" className="block text-[#6B6B6B] transition-colors hover:text-[#2B2B2B]">Activiteiten</Link>
              <Link href="/vakanties" className="block text-[#6B6B6B] transition-colors hover:text-[#2B2B2B]">Vakanties</Link>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#999]">Berry Kids</p>
              <Link href="/insturen" className="block text-[#6B6B6B] transition-colors hover:text-[#2B2B2B]">Event insturen</Link>
              <a href="mailto:info@berrykids.nl" className="block text-[#6B6B6B] transition-colors hover:text-[#2B2B2B]">Contact</a>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#999]">Juridisch</p>
              <Link href="/privacy" className="block text-[#6B6B6B] transition-colors hover:text-[#2B2B2B]">Privacy</Link>
              <Link href="/voorwaarden" className="block text-[#6B6B6B] transition-colors hover:text-[#2B2B2B]">Voorwaarden</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[#F0E6E0] pt-4 text-xs text-[#999]">
          &copy; 2026 Berry Kids B.V. — Haarlem
        </div>
      </div>
    </footer>
  );
}
