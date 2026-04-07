import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsTicker from "@/components/NewsTicker";
import NewsletterForm from "@/components/NewsletterForm";
import FilterableActivities from "@/components/FilterableActivities";
import { activities } from "@/data/activities";
import { resolveEventImages } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Activiteiten voor kinderen in Haarlem | Berry Kids",
  description:
    "Sportclubs, musea, kinderboerderijen en meer. Altijd leuk met kinderen in de regio Haarlem.",
};

export default function ActiviteitenPage() {
  const activitiesWithImages = resolveEventImages(activities);

  return (
    <div className="min-h-screen">
      <NewsTicker />
      <Header />

      {/* Hero */}
      <section className="bg-[#FDF1EA]">
        <div className="mx-auto max-w-[880px] px-5 py-10 sm:px-8 sm:py-14">
          <h1 className="text-3xl font-extrabold leading-tight text-[#2D2D2D] sm:text-4xl">
            Activiteiten voor kinderen
          </h1>
          <p className="mt-2 max-w-lg text-base text-[#6B6B6B] sm:text-lg">
            Sportclubs, musea, kinderboerderijen en meer. Altijd leuk, elk moment van het jaar.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[880px] px-5 py-8 sm:px-8">
        <FilterableActivities activities={activitiesWithImages} />
      </main>

      {/* Newsletter */}
      <section id="newsletter" className="bg-[#FDF1EA]">
        <div className="mx-auto max-w-[880px] px-5 py-14 sm:px-8">
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
