import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/data/events";
import { formatShortDate } from "@/lib/dates";
import SaveButton from "./SaveButton";

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
        <div className="relative aspect-[3/2] overflow-hidden rounded-[20px]">
          <Image
            src={src}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <SaveButton slug={event.slug} />
          {event.free && (
            <span className="absolute left-3 top-3 rounded-full bg-[#8BC34A]/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              Gratis
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#F4A09C]">
            {event.category}
          </p>
          <h3 className="mt-1 text-lg font-bold leading-snug tracking-tight text-[#2D2D2D] transition-colors group-hover:text-[#F4A09C]">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-[#444]">
            {formatShortDate(event.date)} · {event.location}
          </p>
        </div>
      </article>
    </Link>
  );
}
