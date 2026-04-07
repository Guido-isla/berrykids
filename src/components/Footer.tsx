import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#F0ECE8]">
      <div className="mx-auto max-w-[880px] px-5 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#2D2D2D]">Berry Kids</p>
            <p className="mt-1 max-w-xs text-xs text-[#6B6B6B]">
              De leukste uitjes voor gezinnen in Haarlem e.o.
            </p>
          </div>
          <div className="flex gap-4 text-sm sm:gap-8">
            <div className="space-y-2">
              <Link href="/" className="block text-[#666] hover:text-[#2D2D2D]">Dit weekend</Link>
              <Link href="/activiteiten" className="block text-[#666] hover:text-[#2D2D2D]">Activiteiten</Link>
              <Link href="/vakanties" className="block text-[#666] hover:text-[#2D2D2D]">Vakanties</Link>
            </div>
            <div className="space-y-2">
              <Link href="/insturen" className="block text-[#666] hover:text-[#2D2D2D]">Event insturen</Link>
              <a href="mailto:info@berrykids.nl" className="block text-[#666] hover:text-[#2D2D2D]">Contact</a>
            </div>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-[#666] hover:text-[#2D2D2D]">Privacy</Link>
              <Link href="/voorwaarden" className="block text-[#666] hover:text-[#2D2D2D]">Voorwaarden</Link>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-[#6B6B6B]">&copy; 2026 Berry Kids</p>
      </div>
    </footer>
  );
}
