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
    <Link href={`/event/${event.slug}`} className="group block min-w-0">
      <article className="h-full min-w-0">
        <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
          <Image
            src={src}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#E85A5A]">
            {event.category}
            {event.free && " · Gratis"}
          </p>
          <h3 className="mt-1 text-lg font-bold leading-snug tracking-tight text-[#1A1A1A] transition-colors group-hover:text-[#E85A5A]">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-[#444]">
            {formatShortDate(event.date)} · {event.location}
          </p>
          {event.description && (
            <p className="mt-1 truncate text-sm text-[#666]">
              {event.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
