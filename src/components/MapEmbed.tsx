"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const GOOGLE_MAPS_KEY = "AIzaSyBN-CNaX3zejJ6YsxStrVgLt2tBwfxod5k";
const CONSENT_KEY = "berry-maps-consent";

export default function MapEmbed({ location }: { location: string }) {
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("mapEmbed");
  const mapQuery = encodeURIComponent(location);

  // On mount: read persisted consent. If user previously agreed, auto-load.
  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(CONSENT_KEY) === "1") {
        setLoaded(true);
      }
    } catch {
      // localStorage may be blocked
    }
  }, []);

  function handleLoad() {
    setLoaded(true);
    try {
      localStorage.setItem(CONSENT_KEY, "1");
      // Notify other MapEmbeds on the page so they auto-load too
      window.dispatchEvent(new CustomEvent("berry-maps-consent-given"));
    } catch {
      // localStorage may be blocked
    }
  }

  // Listen for consent given by another MapEmbed on the same page
  useEffect(() => {
    function handleConsent() {
      setLoaded(true);
    }
    window.addEventListener("berry-maps-consent-given", handleConsent);
    return () => window.removeEventListener("berry-maps-consent-given", handleConsent);
  }, []);

  // Avoid hydration mismatch — render placeholder until mounted
  if (!mounted) {
    return (
      <div className="h-[220px] w-full animate-pulse rounded-2xl border border-[#F0E6E0] bg-gradient-to-br from-[#FDF1EA] via-[#FFF6E8] to-[#F5F0EB]" />
    );
  }

  if (loaded) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#F0E6E0]">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${mapQuery}`}
          width="100%"
          height="220"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map: ${location}`}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLoad}
      className="group relative flex h-[220px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[#F0E6E0] bg-gradient-to-br from-[#FDF1EA] via-[#FFF6E8] to-[#F5F0EB] p-5 text-center transition-all hover:from-[#FFE9D0] hover:to-[#F0E6E0]"
    >
      {/* Pin icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <svg className="h-6 w-6 text-[#E0685F]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
        </svg>
      </div>
      <p className="text-[14px] font-bold text-[#2D2D2D]">{t("loadMap")}</p>
      <p className="max-w-[260px] text-[11px] leading-snug text-[#6B6B6B]">
        {t("privacyNote")}
      </p>
      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#E0685F] px-3 py-1.5 text-[12px] font-bold text-white shadow-sm transition-transform group-hover:scale-105">
        {t("loadButton")}
      </span>
    </button>
  );
}
