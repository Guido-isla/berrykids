"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import MediaCard from "@/components/MediaCard";
import EmptyState from "@/components/EmptyState";
import type { SavedLookupItem } from "./page";

export default function SavedItemsClient({
  lookup,
}: {
  lookup: Record<string, SavedLookupItem>;
}) {
  const t = useTranslations("saved");
  const tHome = useTranslations("home");
  const [savedSlugs, setSavedSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    function loadSaves() {
      try {
        const raw = localStorage.getItem("berry-saves");
        const parsed = raw ? JSON.parse(raw) : [];
        setSavedSlugs(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSavedSlugs([]);
      }
    }
    loadSaves();
    window.addEventListener("berry-saves-changed", loadSaves);
    window.addEventListener("storage", loadSaves);
    return () => {
      window.removeEventListener("berry-saves-changed", loadSaves);
      window.removeEventListener("storage", loadSaves);
    };
  }, []);

  // Initial render before client hydration: show nothing
  if (savedSlugs === null) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-[3/2] animate-pulse rounded-[20px] bg-[#F5F0EB]"
          />
        ))}
      </div>
    );
  }

  if (savedSlugs.length === 0) {
    return (
      <EmptyState
        title={t("emptyTitle")}
        subtitle={t("emptySubtitle")}
        ctaLabel={t("emptyCta")}
        ctaHref="/activiteiten"
      />
    );
  }

  // Map slugs to items (filter out unknown slugs gracefully)
  const items = savedSlugs
    .map((slug) => lookup[slug])
    .filter((item): item is SavedLookupItem => !!item);

  if (items.length === 0) {
    return (
      <EmptyState
        title={t("emptyTitle")}
        subtitle={t("emptySubtitle")}
        ctaLabel={t("emptyCta")}
        ctaHref="/activiteiten"
      />
    );
  }

  return (
    <>
      <p className="mb-4 text-[13px] font-semibold text-[#6B6B6B]">
        {t("count", { count: items.length })}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <MediaCard
            key={item.slug}
            href={item.href}
            slug={item.slug}
            image={item.image}
            title={item.title}
            date={item.date}
            free={item.free}
            freeLabel={tHome("gratis")}
            meta={item.meta}
          />
        ))}
      </div>
    </>
  );
}
