import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookiebeleid | Berry Kids",
};

export default async function CookiesPage() {
  const t = await getTranslations("cookies");

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <h1 className="text-3xl font-extrabold text-[#2D2D2D]">{t("title")}</h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">{t("lastUpdated")}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#2D2D2D]">
          <p className="text-[#6B6B6B]">{t("intro")}</p>

          <section>
            <h2 className="text-lg font-bold">{t("section1Title")}</h2>
            <p className="mt-2 text-[#6B6B6B]">{t("section1Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-bold">{t("section2Title")}</h2>
            <p className="mt-2 text-[#6B6B6B]">{t("section2Text")}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-[#6B6B6B]">
              <li>{t("section2List1")}</li>
              <li>{t("section2List2")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold">{t("section3Title")}</h2>
            <p className="mt-2 text-[#6B6B6B]">{t("section3Text")}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-[#6B6B6B]">
              <li>{t("section3List1")}</li>
            </ul>
            <p className="mt-2 text-[#6B6B6B]">
              {t("section3GoogleNote")}{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E0685F] underline"
              >
                policies.google.com/privacy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">{t("section4Title")}</h2>
            <p className="mt-2 text-[#6B6B6B]">{t("section4Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-bold">{t("section5Title")}</h2>
            <p className="mt-2 text-[#6B6B6B]">{t("section5Text")}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
