import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#F0ECE8]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#1A1A1A]">Berry Kids</p>
            <p className="mt-1 max-w-xs text-xs text-[#999]">
              De leukste uitjes voor gezinnen in Haarlem e.o.
            </p>
          </div>
          <div className="flex gap-4 text-sm sm:gap-8">
            <div className="space-y-2">
              <Link href="/" className="block text-[#666] hover:text-[#1A1A1A]">Dit weekend</Link>
              <Link href="/activiteiten" className="block text-[#666] hover:text-[#1A1A1A]">Activiteiten</Link>
              <Link href="/vakanties" className="block text-[#666] hover:text-[#1A1A1A]">Vakanties</Link>
            </div>
            <div className="space-y-2">
              <Link href="/insturen" className="block text-[#666] hover:text-[#1A1A1A]">Event insturen</Link>
              <a href="mailto:info@berrykids.nl" className="block text-[#666] hover:text-[#1A1A1A]">Contact</a>
            </div>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-[#666] hover:text-[#1A1A1A]">Privacy</Link>
              <Link href="/voorwaarden" className="block text-[#666] hover:text-[#1A1A1A]">Voorwaarden</Link>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-[#BBB]">&copy; 2026 Berry Kids</p>
      </div>
    </footer>
  );
}
