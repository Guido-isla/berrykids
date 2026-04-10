import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Over Berry Kids",
};

export default async function OverPage() {
  const t = await getTranslations("about");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#FDF1EA] to-[#FFF9F0]">
        <div className="mx-auto max-w-[880px] px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#E0685F]">
                {t("badge")}
              </span>
              <h1 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-tight text-[#2D2D2D] sm:text-[36px]">
                {t("title")}
              </h1>
              <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-[#6B6B6B]">
                {t("subtitle")}
              </p>
            </div>
            <div className="hidden sm:block" style={{ animation: "berry-bob 4s ease-in-out infinite" }}>
              <Image
                src="/berry-wink.png"
                alt=""
                width={120}
                height={120}
                className="h-28 w-auto drop-shadow-[0_6px_20px_rgba(224,104,95,0.3)]"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[720px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="space-y-10">
          <section>
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">
              {t("missionTitle")}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B6B]">
              {t("missionText")}
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">
              {t("voiceTitle")}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B6B]">
              {t("voiceText")}
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">
              {t("trustTitle")}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B6B]">
              {t("trustText")}
            </p>
          </section>

          <section className="rounded-[24px] bg-[#FDF1EA] p-6 sm:p-8">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[22px]">
              {t("contactTitle")}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B6B]">
              {t("contactText")}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${t("contactEmail")}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#E0685F] px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-[#D05A52]"
              >
                {t("contactEmail")}
              </a>
              <Link
                href="/insturen"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E0D8D2] px-4 py-2.5 text-[14px] font-semibold text-[#2D2D2D] transition-colors hover:border-[#E0685F] hover:text-[#E0685F]"
              >
                {t("submitLink")}
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
