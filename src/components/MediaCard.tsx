import Image from "next/image";
import { Link } from "@/i18n/navigation";
import SaveButton from "./SaveButton";

const DAYS_NL = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const MONTHS_NL = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

export type MediaCardProps = {
  href: string;
  slug: string;
  image: string;
  title: string;
  /** Optional category pill (left top) */
  category?: string;
  /** Optional date — if provided, shows date badge instead of category */
  date?: string;
  /** Free badge — set to true to show Gratis pill */
  free?: boolean;
  freeLabel?: string;
  /** Featured pill — overrides free pill, shows Onze tip */
  featured?: boolean;
  featuredLabel?: string;
  /** Berry's tip overlay text on image */
  berryTip?: string;
  /** Override berry tip with editorial featuredNote */
  featuredNote?: string;
  /** Meta line below title (location · time) */
  meta?: string;
  /** Card variant — affects layout */
  variant?: "default" | "compact";
  /** Hide save button */
  hideSave?: boolean;
};

function formatDateBadge(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return {
    day: DAYS_NL[d.getDay()],
    num: d.getDate(),
    month: MONTHS_NL[d.getMonth()],
  };
}

export default function MediaCard({
  href,
  slug,
  image,
  title,
  category,
  date,
  free,
  freeLabel = "Gratis",
  featured,
  featuredLabel = "Onze tip",
  berryTip,
  featuredNote,
  meta,
  variant = "default",
  hideSave = false,
}: MediaCardProps) {
  const tipText = featuredNote || berryTip;
  const dateBadge = date ? formatDateBadge(date) : null;

  return (
    <Link
      href={href}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[3/2] shrink-0 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Top-left: date badge OR category pill */}
        {dateBadge ? (
          <div className="absolute left-3 top-3 flex flex-col items-center rounded-[12px] bg-white/95 px-2.5 py-1.5 text-center backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase text-[#E0685F]">{dateBadge.day}</span>
            <span className="text-[18px] font-black leading-none text-[#2D2D2D]">{dateBadge.num}</span>
          </div>
        ) : category ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#E0685F] shadow-sm backdrop-blur-sm">
            {category}
          </span>
        ) : null}

        {/* Top-right: featured > free badge + save button */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          {featured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#E0685F] to-[#FFB347] px-2 py-1 text-[10px] font-extrabold text-white shadow-md">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.39 7.36h7.74l-6.26 4.55 2.39 7.36L12 16.71l-6.26 4.56 2.39-7.36L1.87 9.36h7.74L12 2z" />
              </svg>
              {featuredLabel}
            </span>
          ) : free ? (
            <span className="rounded-full bg-[#4A8060] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              {freeLabel}
            </span>
          ) : null}
          {!hideSave && <SaveButton slug={slug} />}
        </div>

        {/* Bottom: berry tip overlay */}
        {tipText && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-2.5 pt-6">
            <p className="flex items-start gap-1.5 text-[12px] font-bold leading-snug text-white">
              <Image src="/berry-icon.png" alt="" width={14} height={14} className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-2">{tipText}</span>
            </p>
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col px-3.5 ${variant === "compact" ? "py-2" : "py-3"}`}>
        <h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug text-[#2D2D2D] group-hover:text-[#E0685F]">
          {title}
        </h3>
        {meta && (
          <p className="mt-1 truncate text-[13px] text-[#6B6B6B]">{meta}</p>
        )}
      </div>
    </Link>
  );
}
