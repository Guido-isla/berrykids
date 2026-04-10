import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacybeleid | Berry Kids",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <h1 className="text-3xl font-extrabold text-[#2D2D2D]">Privacybeleid</h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">Laatst bijgewerkt: 3 april 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#2D2D2D]">
          <section>
            <h2 className="text-lg font-bold">1. Wie zijn wij</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Berry Kids is een platform dat ouders helpt bij het vinden van leuke activiteiten en evenementen voor kinderen in de regio Haarlem. Berry Kids is een initiatief van Berry Kids B.V., gevestigd te Haarlem, Nederland.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">2. Welke gegevens verzamelen wij</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Wij verzamelen uitsluitend de gegevens die je zelf aan ons verstrekt:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-[#6B6B6B]">
              <li><strong>E-mailadres</strong> — wanneer je je aanmeldt voor onze nieuwsbrief</li>
              <li><strong>Gebruiksgegevens</strong> — anonieme gegevens over hoe je onze website gebruikt (via cookies)</li>
            </ul>
            <p className="mt-2 text-[#6B6B6B]">
              Wij verzamelen geen namen, adressen, telefoonnummers of andere persoonsgegevens tenzij je die zelf verstrekt via ons contactformulier.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">3. Waarvoor gebruiken wij je gegevens</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-[#6B6B6B]">
              <li>Het versturen van onze wekelijkse nieuwsbrief met activiteitentips</li>
              <li>Het verbeteren van onze website en dienstverlening</li>
              <li>Het analyseren van websitegebruik (geanonimiseerd)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold">4. Cookies en lokale opslag</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Berry Kids gebruikt geen tracking-, analyse- of advertentiecookies. We slaan alleen functionele gegevens op (zoals je opgeslagen activiteiten in localStorage). Externe inhoud zoals Google Maps wordt pas geladen nadat je daarop klikt — pas dán plaatst Google cookies. Lees ons volledige <a href="/cookies" className="text-[#E0685F] underline">cookiebeleid</a> voor details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">5. Externe diensten</h2>
            <p className="mt-2 text-[#6B6B6B]">
              We gebruiken de volgende externe diensten:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-[#6B6B6B]">
              <li><strong>Google Maps</strong> (Google LLC, VS) — alleen als je actief op een kaart klikt om hem te laden. Google plaatst dan eigen cookies. De gegevensoverdracht naar de VS is gebaseerd op de Standard Contractual Clauses van de Europese Commissie.</li>
              <li><strong>Onze e-maildienstverlener</strong> — voor het versturen van de nieuwsbrief (alleen na expliciete toestemming).</li>
            </ul>
            <p className="mt-2 text-[#6B6B6B]">
              Wij verkopen je gegevens nooit aan derden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">6. Bewaartermijn</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Je e-mailadres bewaren wij zolang je bent aangemeld voor onze nieuwsbrief. Bij afmelding verwijderen wij je gegevens binnen 30 dagen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">7. Je rechten</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Op grond van de AVG heb je het recht om je persoonsgegevens in te zien, te corrigeren of te verwijderen. Je kunt je op elk moment uitschrijven voor de nieuwsbrief via de link onderaan elke e-mail. Voor vragen kun je contact opnemen via privacy@berrykids.nl.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">8. Beveiliging</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Wij nemen passende technische en organisatorische maatregelen om je persoonsgegevens te beschermen tegen verlies of onrechtmatig gebruik. Onze website maakt gebruik van een beveiligde verbinding (SSL/TLS).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">9. Contact</h2>
            <p className="mt-2 text-[#6B6B6B]">
              Voor vragen over dit privacybeleid kun je contact opnemen via privacy@berrykids.nl.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
