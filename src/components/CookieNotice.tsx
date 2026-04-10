"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "berry-cookie-notice-dismissed";

export default function CookieNotice() {
  const t = useTranslations("cookieNotice");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage may be blocked
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="mx-auto flex max-w-[860px] items-start gap-3 rounded-[16px] border border-[#F0E6E0] bg-white p-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:items-center sm:gap-4 sm:p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDF1EA] text-[18px]">
          🍪
        </div>
        <p className="min-w-0 flex-1 text-[12px] leading-snug text-[#6B6B6B] sm:text-[13px]">
          {t("text")}{" "}
          <Link href="/cookies" className="font-bold text-[#E0685F] underline">
            {t("link")}
          </Link>
          .
        </p>
        <button
          onClick={dismiss}
          aria-label={t("dismiss")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6B6B6B] hover:bg-[#F0ECE8]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
