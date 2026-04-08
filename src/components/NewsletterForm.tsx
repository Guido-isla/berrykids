"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { saveProfile, INTEREST_OPTIONS, AREA_OPTIONS, type KidProfile } from "@/lib/personalization";

type Variant = "default" | "personalize";

export default function NewsletterForm({ variant = "default" }: { variant?: Variant }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "profile" | "submitting" | "success">("email");
  const [loading, setLoading] = useState(false);
  const [kids, setKids] = useState<KidProfile[]>([{ age: 4, interests: [] }]);
  const [area, setArea] = useState("Haarlem centrum");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    if (variant === "personalize") {
      setStep("profile");
    } else {
      await submitForm();
    }
  }

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("Vink het vakje aan om je aan te melden");
      return;
    }
    await submitForm();
  }

  async function submitForm() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          kids: variant === "personalize" ? kids : [],
          area: variant === "personalize" ? area : "Haarlem centrum",
          consent: variant === "personalize" ? consent : true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Er ging iets mis");
        setLoading(false);
        return;
      }

      // Save profile to localStorage for instant personalization
      if (variant === "personalize" && kids.length > 0) {
        saveProfile({ kids, area });
      }

      setStep("success");
    } catch {
      setError("Geen verbinding. Probeer het later.");
      setLoading(false);
    }
  }

  function addKid() {
    if (kids.length < 5) {
      setKids([...kids, { age: 4, interests: [] }]);
    }
  }

  function removeKid(index: number) {
    if (kids.length > 1) {
      setKids(kids.filter((_, i) => i !== index));
    }
  }

  function updateKidAge(index: number, age: number) {
    setKids(kids.map((k, i) => (i === index ? { ...k, age } : k)));
  }

  function toggleInterest(index: number, interest: string) {
    setKids(
      kids.map((k, i) => {
        if (i !== index) return k;
        const has = k.interests.includes(interest);
        return {
          ...k,
          interests: has
            ? k.interests.filter((x) => x !== interest)
            : [...k.interests, interest],
        };
      })
    );
  }

  // === SUCCESS STATE ===
  if (step === "success") {
    return (
      <div className="overflow-hidden rounded-[20px] border border-[#B8E0D4] bg-[#E8F8ED]">
        <div className="flex items-center gap-3 px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B8E0D4] text-[20px]">✓</span>
          <div>
            <p className="text-[16px] font-extrabold text-[#2D2D2D]">Je bent erbij! 🍓</p>
            <p className="text-[13px] text-[#3D7A6A]">
              {variant === "personalize"
                ? "Berry kent je gezin nu. Elke vrijdag persoonlijke tips in je inbox."
                : "Elke vrijdag de leukste tips in je inbox."}
            </p>
          </div>
        </div>
        {variant === "default" && (
          <div className="border-t border-[#B8E0D4] bg-[#F0FBF5] px-5 py-3">
            <Link href="/#newsletter" className="text-[13px] font-bold text-[#3D7A6A] hover:underline">
              Wil je tips op maat? Vertel Berry over je kids →
            </Link>
          </div>
        )}
      </div>
    );
  }

  // === PROFILE STEP (personalize variant only) ===
  if (step === "profile") {
    return (
      <form onSubmit={handleProfileSubmit} className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-[24px]">🍓</span>
          <div>
            <p className="text-[16px] font-extrabold text-[#2D2D2D]">Berry leert je gezin kennen</p>
            <p className="text-[13px] text-[#6B6B6B]">Zo worden de tips persoonlijker</p>
          </div>
        </div>

        {/* Kids */}
        {kids.map((kid, i) => (
          <div key={i} className="rounded-[16px] bg-[#FFF9F0] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold text-[#2D2D2D]">
                Kind {i + 1}
              </p>
              {kids.length > 1 && (
                <button type="button" onClick={() => removeKid(i)} className="text-[12px] text-[#6B6B6B] hover:text-[#E0685F]">
                  verwijder
                </button>
              )}
            </div>

            {/* Age selector */}
            <div className="mt-2">
              <p className="text-[11px] font-semibold text-[#6B6B6B]">Leeftijd</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => updateKidAge(i, age)}
                    className={`h-8 w-8 rounded-full text-[12px] font-bold transition-all ${
                      kid.age === age
                        ? "bg-[#E0685F] text-white"
                        : "bg-white text-[#6B6B6B] shadow-[0_0_0_1px_#E8E0D8] hover:text-[#2D2D2D]"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-[#6B6B6B]">Waar is je kind gek op?</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {INTEREST_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(i, opt.id)}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-bold transition-all ${
                      kid.interests.includes(opt.id)
                        ? "bg-[#E0685F] text-white"
                        : "bg-white text-[#6B6B6B] shadow-[0_0_0_1px_#E8E0D8] hover:text-[#2D2D2D]"
                    }`}
                  >
                    <span>{opt.emoji}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {kids.length < 5 && (
          <button
            type="button"
            onClick={addKid}
            className="text-[13px] font-bold text-[#E0685F] hover:underline"
          >
            + nog een kind
          </button>
        )}

        {/* Area */}
        <div>
          <p className="text-[11px] font-semibold text-[#6B6B6B]">Buurt</p>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="mt-1 w-full rounded-full border border-[#E8E0D8] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#2D2D2D] outline-none focus:border-[#E0685F]"
          >
            {AREA_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Consent */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#E8E0D8] accent-[#E0685F]"
          />
          <span className="text-[12px] leading-relaxed text-[#6B6B6B]">
            Ik wil elke vrijdag Berry&apos;s weekendtips ontvangen. Je kunt je altijd afmelden.
          </span>
        </label>

        {error && <p className="text-[12px] font-semibold text-red-500">{error}</p>}

        {(() => {
          const profileReady = consent && kids.some((k) => k.interests.length > 0);
          return (
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-full py-3 text-[14px] font-bold text-white transition-all disabled:opacity-50 ${
                profileReady
                  ? "bg-[#4A8060] shadow-[0_4px_16px_rgba(74,128,96,0.3)] hover:bg-[#3D7A6A] scale-[1.02]"
                  : "bg-[#E0685F] hover:bg-[#D05A52]"
              }`}
            >
              {loading ? "Even geduld..." : profileReady ? "Klaar — aanmelden! ✓" : "Aanmelden →"}
            </button>
          );
        })()}
      </form>
    );
  }

  // === EMAIL STEP (both variants) ===
  return (
    <form onSubmit={handleEmailSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="je@email.nl"
        className="min-w-0 flex-1 rounded-full border border-[#F0E6E0] bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#999] focus:border-[#E0685F]"
      />
      <button
        type="submit"
        disabled={loading}
        className="shrink-0 rounded-full bg-[#E0685F] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D05A52] disabled:opacity-50"
      >
        {loading ? "..." : variant === "personalize" ? "Volgende →" : "Inschrijven"}
      </button>
    </form>
  );
}
