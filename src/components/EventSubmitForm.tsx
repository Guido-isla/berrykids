"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";

type FormState = "form" | "submitting" | "success";

export default function EventSubmitForm() {
  const [state, setState] = useState<FormState>("form");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");

    // Simulate submission — in production this goes to an API route
    setTimeout(() => {
      setState("success");
    }, 1500);
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <Image
          src="/berry-wink.png"
          alt=""
          width={64}
          height={64}
          className="mx-auto mb-4 h-auto"
        />
        <h2 className="text-2xl font-extrabold text-[#2D2D2D]">
          Bedankt! 🍓
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6B6B6B]">
          We hebben je event ontvangen en nemen het zo snel mogelijk op
          in onze agenda. Je hoort binnen 2 werkdagen van ons.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-[#E0685F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D05A52]"
        >
          Terug naar Berry Kids
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event info */}
      <fieldset className="rounded-2xl bg-white p-6 shadow-sm">
        <legend className="mb-4 text-sm font-bold uppercase tracking-wider text-[#6B6B6B]">
          Over het event
        </legend>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
              Naam event *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="bv. Paasmarkt op de Grote Markt"
              className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#BBB] focus:border-[#E0685F]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
                Datum *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors focus:border-[#E0685F]"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
                Einddatum <span className="font-normal text-[#6B6B6B]">(optioneel)</span>
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors focus:border-[#E0685F]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="timeStart" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
                Begintijd *
              </label>
              <input
                id="timeStart"
                name="timeStart"
                type="time"
                required
                className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors focus:border-[#E0685F]"
              />
            </div>
            <div>
              <label htmlFor="timeEnd" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
                Eindtijd
              </label>
              <input
                id="timeEnd"
                name="timeEnd"
                type="time"
                className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors focus:border-[#E0685F]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
              Locatie *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              placeholder="bv. Grote Markt, Haarlem"
              className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#BBB] focus:border-[#E0685F]"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
              Beschrijving *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Kort en wervend — wat maakt dit event leuk voor gezinnen?"
              className="w-full resize-none rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#BBB] focus:border-[#E0685F]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="ageRange" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
                Leeftijd
              </label>
              <select
                id="ageRange"
                name="ageRange"
                className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors focus:border-[#E0685F]"
              >
                <option value="all">Alle leeftijden</option>
                <option value="0-3">0 – 3 jaar</option>
                <option value="2-6">2 – 6 jaar</option>
                <option value="4-8">4 – 8 jaar</option>
                <option value="4-12">4 – 12 jaar</option>
                <option value="6-12">6 – 12 jaar</option>
                <option value="8+">8+ jaar</option>
              </select>
            </div>
            <div>
              <label htmlFor="price" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
                Prijs
              </label>
              <input
                id="price"
                name="price"
                type="text"
                placeholder="Gratis / €7,50"
                className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#BBB] focus:border-[#E0685F]"
              />
            </div>
            <div>
              <label htmlFor="setting" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
                Binnen/Buiten
              </label>
              <select
                id="setting"
                name="setting"
                className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors focus:border-[#E0685F]"
              >
                <option value="outdoor">Buiten</option>
                <option value="indoor">Binnen</option>
                <option value="both">Beide</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="website" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
              Website / ticket link
            </label>
            <input
              id="website"
              name="website"
              type="url"
              placeholder="https://"
              className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#BBB] focus:border-[#E0685F]"
            />
          </div>

          {/* Photo upload */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
              Foto <span className="font-normal text-[#6B6B6B]">(sterk aanbevolen)</span>
            </label>
            <p className="mb-2 text-xs text-[#6B6B6B]">
              Een goede foto maakt het verschil. Liefst een sfeerbeeld van het event, geen logo.
            </p>
            <label
              htmlFor="photo"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E0D8D2] bg-[#FDFAF8] p-6 transition-colors hover:border-[#E0685F]"
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 rounded-lg object-cover"
                />
              ) : (
                <>
                  <svg className="mb-2 h-8 w-8 text-[#BBB]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                  <span className="text-sm text-[#6B6B6B]">Klik om een foto te uploaden</span>
                  <span className="text-xs text-[#BBB]">JPG, PNG — max 5MB</span>
                </>
              )}
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
      </fieldset>

      {/* Contact info */}
      <fieldset className="rounded-2xl bg-white p-6 shadow-sm">
        <legend className="mb-4 text-sm font-bold uppercase tracking-wider text-[#6B6B6B]">
          Jouw gegevens
        </legend>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contactName" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
                Naam *
              </label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                required
                className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors focus:border-[#E0685F]"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
                E-mail *
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                required
                className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors focus:border-[#E0685F]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="organization" className="mb-1 block text-sm font-semibold text-[#2D2D2D]">
              Organisatie
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              placeholder="bv. Stichting Haarlemse Markten"
              className="w-full rounded-xl border border-[#E0D8D2] px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#BBB] focus:border-[#E0685F]"
            />
          </div>
        </div>
      </fieldset>

      <div className="text-center">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="rounded-full bg-[#E0685F] px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#D05A52] disabled:opacity-50"
        >
          {state === "submitting" ? "Versturen..." : "Event insturen"}
        </button>
        <p className="mt-3 text-xs text-[#6B6B6B]">
          We reviewen elk event handmatig. Plaatsing binnen 2 werkdagen.
        </p>
      </div>
    </form>
  );
}
