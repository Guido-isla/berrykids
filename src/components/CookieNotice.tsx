"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "berry-cookie-notice-dismissed";

export default function CookieNotice() {
  const t = useTranslations("cookieNotice");
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    if (!visible) return;
    function handleScroll() {
      const y = window.scrollY;
      const goingDown = y > lastScrollY.current && y > 100;
      const goingUp = y < lastScrollY.current;
      if (goingDown && !collapsed) setCollapsed(true);
      else if (goingUp && collapsed) setCollapsed(false);
      lastScrollY.current = y;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible, collapsed]);

  useEffect(() => {
    if (!visible) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-3 transition-transform duration-300 sm:px-6 sm:pb-6 ${
        collapsed ? "translate-y-[150%]" : "translate-y-0"
      }`}
    >
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
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6B6B6B] hover:bg-[#F0ECE8]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
