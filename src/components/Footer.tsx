import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#F0ECE8] bg-[#FFF6E8]">
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <Image src="/berry-icon.png" alt="" width={36} height={36} className="h-9 w-auto" />
              <span className="text-[16px] font-extrabold text-[#E0685F]">Berry Kids</span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-[#6B6B6B]">
              {t("tagline")}
            </p>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-[12px] font-extrabold uppercase tracking-wider text-[#888]">
              {t("discoverHeading")}
            </h3>
            <ul className="mt-3 space-y-2 text-[14px] font-semibold">
              <li><Link href="/" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{t("home")}</Link></li>
              <li><Link href="/activiteiten" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{tNav("activities")}</Link></li>
              <li><Link href="/evenementen" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{tNav("events")}</Link></li>
              <li><Link href="/vakanties" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{tNav("vacations")}</Link></li>
              <li><Link href="/opgeslagen" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{tNav("saved")}</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-[12px] font-extrabold uppercase tracking-wider text-[#888]">
              {t("aboutHeading")}
            </h3>
            <ul className="mt-3 space-y-2 text-[14px] font-semibold">
              <li><Link href="/over" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{t("aboutLink")}</Link></li>
              <li><Link href="/insturen" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{t("submitEvent")}</Link></li>
              <li><a href="mailto:hallo@berrykids.nl" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{t("contact")}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[12px] font-extrabold uppercase tracking-wider text-[#888]">
              {t("legalHeading")}
            </h3>
            <ul className="mt-3 space-y-2 text-[14px] font-semibold">
              <li><Link href="/privacy" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{t("privacy")}</Link></li>
              <li><Link href="/cookies" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{t("cookies")}</Link></li>
              <li><Link href="/voorwaarden" className="text-[#6B6B6B] transition-colors hover:text-[#E0685F]">{t("terms")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col gap-3 border-t border-[#F0E6E0] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[#888]">
            © {year} Berry Kids · {t("madeIn")}
          </p>
          <div className="flex items-center gap-1 text-[12px] text-[#888]">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
            </svg>
            {tNav("haarlem")}
          </div>
        </div>
      </div>
    </footer>
  );
}
