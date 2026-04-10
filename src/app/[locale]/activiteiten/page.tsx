import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import FilterableActivities from "@/components/FilterableActivities";
import { activities } from "@/data/activities";
import { resolveEventImages } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Activiteiten voor kinderen in Haarlem | Berry Kids",
  description:
    "Sportclubs, musea, kinderboerderijen en meer. Altijd leuk met kinderen in de regio Haarlem.",
};

export default async function ActiviteitenPage() {
  const t = await getTranslations("activiteitenPage");
  const activitiesWithImages = resolveEventImages(activities);

  return (
    <div className="min-h-screen">
      {/* Hero — peach gradient */}
      <section className="bg-gradient-to-b from-[#FDF1EA] to-[#FFF9F0]">
        <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#E0685F]">
                {activities.length} plekken
              </span>
              <h1 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-tight text-[#2D2D2D] sm:text-[36px]">
                🎯 {t("title")}
              </h1>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#6B6B6B]">
                {t("heroSub")}
              </p>
            </div>
            <div className="hidden sm:block" style={{ animation: "berry-bob 4s ease-in-out infinite" }}>
              <Image
                src="/berry-wink.png"
                alt=""
                width={80}
                height={80}
                className="h-20 w-auto drop-shadow-[0_6px_20px_rgba(224,104,95,0.3)]"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
        <FilterableActivities activities={activitiesWithImages} />
      </main>

      {/* Newsletter */}
      <section id="newsletter" className="bg-[#FDF1EA]">
        <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-2xl font-extrabold text-[#2D2D2D]">
              Elke week de beste tips in je inbox
            </h2>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Wekelijks de leukste evenementen en activiteiten voor kinderen.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
