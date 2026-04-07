import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/data/activities";
import SaveButton from "./SaveButton";

type ActivityWithImage = Activity & { resolvedImage?: string; photoAttribution?: string };

export default function ActivityCard({ activity }: { activity: ActivityWithImage }) {
  const src = activity.resolvedImage || activity.image;

  return (
    <Link
      href={`/activiteiten/${activity.slug}`}
      className="group block h-full min-w-0"
    >
      <article className="h-full min-w-0 overflow-hidden rounded-[20px] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={src}
            alt={activity.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <SaveButton slug={activity.slug} />
          {activity.free && (
            <span className="absolute left-3 top-3 rounded-full bg-[#8BC34A]/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              Gratis
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#FFE9EA] px-2.5 py-0.5 text-xs font-semibold text-[#F4A09C]">
              {activity.subcategory}
            </span>
            <span className="rounded-full bg-[#F0E6E0] px-2.5 py-0.5 text-xs text-[#6B6B6B]">
              {activity.ageLabel}
            </span>
          </div>

          <h3 className="text-lg font-bold leading-snug tracking-tight text-[#2D2D2D] transition-colors group-hover:text-[#F4A09C]">
            {activity.title}
          </h3>

          <p className="mt-1 text-sm text-[#444]">{activity.location}</p>

          {activity.tip ? (
            <p className="mt-1.5 text-sm text-[#6B6B6B]">
              💡 {activity.tip}
            </p>
          ) : (
            <p className="mt-1.5 truncate text-sm text-[#6B6B6B]">
              {activity.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
