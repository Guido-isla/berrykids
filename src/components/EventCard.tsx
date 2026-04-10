import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Event } from "@/data/events";
import { formatShortDate } from "@/lib/dates";
import SaveButton from "./SaveButton";

type EventWithImage = Event & {
  resolvedImage?: string;
  photoAttribution?: string;
  isNew?: boolean;
};

export default function EventCard({ event, berryTip }: { event: EventWithImage; berryTip?: string }) {
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
          <span className="absolute right-3 top-3 z-10"><SaveButton slug={event.slug} /></span>
          {event.featured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#E0685F] to-[#FFB347] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.39 7.36h7.74l-6.26 4.55 2.39 7.36L12 16.71l-6.26 4.56 2.39-7.36L1.87 9.36h7.74L12 2z" />
              </svg>
              Onze tip
            </span>
          )}
          {!event.featured && event.free && (
            <span className="absolute left-3 top-3 rounded-full bg-[#8BC34A]/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              Gratis
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#E0685F]">
            {event.category}
          </p>
          <h3 className="mt-1 text-lg font-bold leading-snug tracking-tight text-[#2D2D2D] transition-colors group-hover:text-[#E0685F]">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-[#444]">
            {formatShortDate(event.date)} · {event.location}
          </p>
          {berryTip && (
            <p className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-[#E0685F]">
              <Image src="/berry-icon.png" alt="" width={14} height={14} className="h-3.5 w-3.5 shrink-0" /> {berryTip}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
