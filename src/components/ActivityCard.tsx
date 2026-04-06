import Image from "next/image";
import type { Activity } from "@/data/activities";

type ActivityWithImage = Activity & { resolvedImage?: string; photoAttribution?: string };

export default function ActivityCard({ activity }: { activity: ActivityWithImage }) {
  const src = activity.resolvedImage || activity.image;
  const href = activity.website || "#";

  return (
    <a
      href={href}
      target={activity.website ? "_blank" : undefined}
      rel={activity.website ? "noopener noreferrer" : undefined}
      className="group block h-full"
    >
      <article className="h-full overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_4px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.12)]">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={src}
            alt={activity.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {activity.seekingMembers && (
            <span className="absolute left-3 top-3 rounded-full bg-[#E85A5A] px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              Leden gezocht
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#FFD6D6] px-2.5 py-0.5 text-xs font-semibold text-[#E85A5A]">
              {activity.subcategory}
            </span>
            {activity.free ? (
              <span className="rounded-full bg-[#8BC34A]/15 px-2.5 py-0.5 text-xs font-semibold text-[#6FAF3A]">
                Gratis
              </span>
            ) : (
              <span className="text-xs font-medium text-[#6B6B6B]">
                {activity.price}
              </span>
            )}
            <span className="rounded-full bg-[#F0E6E0] px-2.5 py-0.5 text-xs text-[#6B6B6B]">
              {activity.ageLabel}
            </span>
          </div>

          <h3 className="text-lg font-bold leading-snug tracking-tight text-[#1A1A1A] transition-colors group-hover:text-[#E85A5A]">
            {activity.title}
          </h3>

          <p className="mt-1 text-sm text-[#444]">{activity.location}</p>

          {activity.openingHours && (
            <p className="mt-0.5 text-sm text-[#6B6B6B]">{activity.openingHours}</p>
          )}

          <p className="mt-1.5 truncate text-sm text-[#666]">
            {activity.description}
          </p>

          {activity.website && (
            <span className="mt-3 inline-block text-sm font-semibold text-[#E85A5A]">
              Website →
            </span>
          )}
        </div>
      </article>
    </a>
  );
}
