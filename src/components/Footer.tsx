import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="border-t border-[#F0ECE8]">
      <div className="mx-auto max-w-[880px] px-5 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#2D2D2D]">Berry Kids</p>
            <p className="mt-1 max-w-xs text-xs text-[#6B6B6B]">
              {t("tagline")}
            </p>
          </div>
          <div className="flex gap-4 text-sm sm:gap-8">
            <div className="space-y-2">
              <Link href="/" className="block text-[#666] hover:text-[#2D2D2D]">{t("thisWeekend")}</Link>
              <Link href="/activiteiten" className="block text-[#666] hover:text-[#2D2D2D]">{tNav("activities")}</Link>
              <Link href="/vakanties" className="block text-[#666] hover:text-[#2D2D2D]">{tNav("vacations")}</Link>
            </div>
            <div className="space-y-2">
              <Link href="/insturen" className="block text-[#666] hover:text-[#2D2D2D]">{t("submitEvent")}</Link>
              <a href="mailto:info@berrykids.nl" className="block text-[#666] hover:text-[#2D2D2D]">{t("contact")}</a>
            </div>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-[#666] hover:text-[#2D2D2D]">{t("privacy")}</Link>
              <Link href="/cookies" className="block text-[#666] hover:text-[#2D2D2D]">{t("cookies")}</Link>
              <Link href="/voorwaarden" className="block text-[#666] hover:text-[#2D2D2D]">{t("terms")}</Link>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-[#6B6B6B]">{t("copyright")}</p>
      </div>
    </footer>
  );
}
