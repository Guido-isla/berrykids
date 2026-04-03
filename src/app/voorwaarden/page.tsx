import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | Berry Kids",
};

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <h1 className="text-3xl font-extrabold text-[#2B2B2B]">Algemene Voorwaarden</h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">Laatst bijgewerkt: 3 april 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#2B2B2B]">
          <section>
            <h2 className="text-lg font-bold">1. Algemeen</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Deze voorwaarden zijn van toepassing op het gebruik van de website berrykids.nl, beheerd door Berry Kids B.V., gevestigd te Haarlem. Door gebruik te maken van deze website ga je akkoord met deze voorwaarden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">2. Dienstverlening</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Berry Kids biedt een overzicht van activiteiten, evenementen en uitjes voor gezinnen met kinderen in de regio Haarlem. Wij zijn een informatieplatform en geen ticketverkoper of organisator van evenementen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">3. Informatie</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Wij doen ons best om correcte en actuele informatie te tonen. Evenementen, tijden, prijzen en locaties kunnen echter wijzigen zonder dat wij daarvan op de hoogte zijn. Controleer altijd de website van de organisator voor de meest recente informatie. Berry Kids is niet aansprakelijk voor onjuiste of verouderde informatie.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">4. Externe links</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Onze website bevat links naar externe websites van evenementenorganisatoren, venues en andere partijen. Berry Kids is niet verantwoordelijk voor de inhoud, het privacybeleid of de beschikbaarheid van deze externe websites.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">5. Intellectueel eigendom</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Alle content op berrykids.nl, inclusief teksten, ontwerp, logo&apos;s en afbeeldingen, is eigendom van Berry Kids B.V. of wordt gebruikt met toestemming. Gebruik van deze content zonder schriftelijke toestemming is niet toegestaan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">6. Nieuwsbrief</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Door je aan te melden voor onze nieuwsbrief geef je toestemming om wekelijks een e-mail te ontvangen met activiteitentips. Je kunt je op elk moment uitschrijven via de link onderaan elke e-mail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">7. Aansprakelijkheid</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Berry Kids is niet aansprakelijk voor schade die voortvloeit uit het gebruik van onze website of het bezoeken van activiteiten die op onze website worden vermeld. Deelname aan activiteiten is geheel op eigen risico.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">8. Wijzigingen</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Berry Kids behoudt zich het recht voor om deze voorwaarden te wijzigen. Wijzigingen worden op deze pagina gepubliceerd. Bij substantiële wijzigingen informeren wij je via de nieuwsbrief.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">9. Toepasselijk recht</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter te Haarlem.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">10. Contact</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Voor vragen over deze voorwaarden kun je contact opnemen via info@berrykids.nl.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
