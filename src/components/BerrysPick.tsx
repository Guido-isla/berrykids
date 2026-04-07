import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/data/events";
import { formatShortDate } from "@/lib/dates";

type EventWithImage = Event & { resolvedImage?: string; photoAttribution?: string };

export default function BerrysPick({ event, reason }: { event: EventWithImage; reason?: string }) {
  const src = event.resolvedImage || event.image;

  return (
    <Link href={`/event/${event.slug}`} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#2D2D2D] shadow-sm transition-shadow hover:shadow-md">
        {/* Background image */}
        <Image
          src={src}
          alt={event.title}
          fill
          sizes="(max-width: 1024px) 100vw, 75vw"
          className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-[1.02]"
        />

        {/* Content overlay */}
        <div className="relative flex h-full min-h-[320px] flex-col justify-end p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 self-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4A09C] px-3 py-1 text-xs font-bold text-white">
              <Image src="/berry-wink.png" alt="" width={16} height={16} className="h-4 w-auto" />
              Berry&apos;s Pick
            </span>
            {reason && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {reason}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {event.free ? (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                Gratis
              </span>
            ) : (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                {event.price}
              </span>
            )}
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm">
              {event.ageLabel}
            </span>
          </div>

          <h2 className="mt-2 text-xl font-extrabold leading-snug text-white sm:text-2xl md:text-3xl">
            {event.title}
          </h2>

          <p className="mt-1.5 text-sm text-white/80">
            {formatShortDate(event.date)} · {event.time} · {event.location}
          </p>

          {event.description && (
            <p className="mt-2 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/70">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
