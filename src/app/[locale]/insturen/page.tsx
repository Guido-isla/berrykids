import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import EventSubmitForm from "@/components/EventSubmitForm";

export const metadata: Metadata = {
  title: "Event insturen | Berry Kids",
  description: "Organiseer je een leuk event voor kinderen in de regio Haarlem? Laat het ons weten!",
};

export default function InsturenPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <div className="text-center">
          <Image
            src="/berry-wink.png"
            alt=""
            width={80}
            height={80}
            className="mx-auto mb-6 h-auto"
          />
          <h1 className="text-3xl font-extrabold text-[#2D2D2D] sm:text-4xl">
            Event insturen
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base text-[#6B6B6B]">
            Organiseer je een leuk event voor kinderen in de regio Haarlem?
            Wij plaatsen het gratis op Berry Kids en in onze wekelijkse nieuwsbrief.
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-[#FDF1EA] px-5 py-4 text-center text-sm text-[#6B6B6B]">
          <p>
            <span className="font-bold text-[#2D2D2D]">Gratis plaatsing</span> voor alle kinderactiviteiten en evenementen.
            Wil je extra zichtbaarheid? Neem contact op via{" "}
            <a href="mailto:info@berrykids.nl" className="font-semibold text-[#E0685F]">info@berrykids.nl</a>.
          </p>
        </div>

        <div className="mt-10">
          <EventSubmitForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
