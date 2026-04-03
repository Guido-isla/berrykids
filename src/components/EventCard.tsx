import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/data/events";
import { formatShortDate } from "@/lib/dates";

type EventWithImage = Event & {
  resolvedImage?: string;
  photoAttribution?: string;
  isNew?: boolean;
};

export default function EventCard({ event }: { event: EventWithImage }) {
  const src = event.resolvedImage || event.image;
  const attribution = event.photoAttribution || "";

  return (
    <Link href={`/event/${event.slug}`} className="group block">
      <article className="h-full overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={src}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {event.isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-[#E85A5A] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              Nieuw
            </span>
          )}
          {attribution && (
            <span className="absolute bottom-1 right-1 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white/80">
              {attribution}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {event.free ? (
              <span className="rounded-full bg-[#8BC34A]/15 px-2.5 py-0.5 text-xs font-semibold text-[#6FAF3A]">
                Free
              </span>
            ) : (
              <span className="text-xs font-medium text-[#6B6B6B]">
                {event.price}
              </span>
            )}
            <span className="rounded-full bg-[#F0E6E0] px-2.5 py-0.5 text-xs text-[#6B6B6B]">
              {event.ageLabel}
            </span>
            <span className="rounded-full bg-[#F0E6E0] px-2.5 py-0.5 text-xs text-[#6B6B6B]">
              {event.indoor ? "Indoor" : "Outdoor"}
            </span>
          </div>

          <h3 className="text-base font-bold leading-snug text-[#2B2B2B] transition-colors group-hover:text-[#E85A5A]">
            {event.title}
          </h3>

          <p className="mt-1 text-sm text-[#6B6B6B]">
            {formatShortDate(event.date)} · {event.time}
          </p>
          <p className="text-sm text-[#999]">{event.location}</p>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6B6B6B]">
            {event.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
