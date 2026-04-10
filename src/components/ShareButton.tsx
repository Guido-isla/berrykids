"use client";

import { useTranslations } from "next-intl";

export default function ShareButton({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const t = useTranslations("common");

  async function handleShare() {
    const url = `https://berrykids.nl/${slug}`;
    const text = `Zin om naar ${title} te gaan? ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} — Berry Kids`, text, url });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#E0D8D2] px-4 py-2.5 text-[13px] font-semibold text-[#2D2D2D] transition-colors hover:border-[#E0685F] hover:text-[#E0685F]"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
      {t("goTogether")}
    </button>
  );
}
