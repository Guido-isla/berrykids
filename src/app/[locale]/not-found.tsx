import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/Footer";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex max-w-[640px] flex-col items-center px-5 py-16 text-center sm:py-24">
        <div style={{ animation: "berry-bob 4s ease-in-out infinite" }}>
          <Image
            src="/berry-wink.png"
            alt=""
            width={140}
            height={140}
            className="h-32 w-auto drop-shadow-[0_8px_24px_rgba(224,104,95,0.3)]"
          />
        </div>
        <p className="mt-6 text-[80px] font-black leading-none text-[#E0685F] sm:text-[120px]">
          404
        </p>
        <h1 className="mt-2 text-[24px] font-extrabold tracking-tight text-[#2D2D2D] sm:text-[28px]">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-md text-[15px] text-[#6B6B6B]">
          {t("subtitle")}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#E0685F] px-5 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#D05A52] hover:-translate-y-0.5"
          >
            {t("homeCta")}
          </Link>
          <Link
            href="/activiteiten"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E0D8D2] px-4 py-2.5 text-[14px] font-semibold text-[#2D2D2D] transition-colors hover:border-[#E0685F] hover:text-[#E0685F]"
          >
            {t("activitiesCta")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
