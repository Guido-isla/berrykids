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

  return (
    <Link href={`/event/${event.slug}`} className="group block">
      <article className="h-full overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={src}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {event.isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-[#E85A5A] px-2.5 py-1 text-[11px] font-bold text-white shadow">
              Nieuw
            </span>
          )}
          {event.free && (
            <span className="absolute right-3 top-3 rounded-full bg-[#2B9A3E] px-2.5 py-1 text-[11px] font-bold text-white shadow">
              Gratis
            </span>
          )}
        </div>
        <div className="p-4">
          {/* Tags row — colored */}
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {!event.free && event.price && (
              <span className="rounded-full bg-[#FFF3E0] px-2.5 py-0.5 text-xs font-semibold text-[#E65100]">
                {event.price}
              </span>
            )}
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              event.indoor
                ? "bg-[#FCE4EC] text-[#C62828]"
                : "bg-[#E8F5E9] text-[#2E7D32]"
            }`}>
              {event.indoor ? "Binnen" : "Buiten"}
            </span>
            <span className="rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-semibold text-[#444]">
              {event.ageLabel}
            </span>
          </div>

          {/* Title — dominant */}
          <h3 className="text-lg font-bold leading-snug text-[#1A1A1A] transition-colors group-hover:text-[#E85A5A]">
            {event.title}
          </h3>

          {/* Meta — darker */}
          <p className="mt-1 text-sm text-[#444]">
            {formatShortDate(event.date)} · {event.location}
          </p>

          {/* Description — max 1 line */}
          {event.description && (
            <p className="mt-1.5 truncate text-sm text-[#666]">
              {event.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
