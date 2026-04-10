import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type EmptyStateProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function EmptyState({ title, subtitle, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div style={{ animation: "berry-bob 4s ease-in-out infinite" }}>
        <Image
          src="/berry-wink.png"
          alt=""
          width={96}
          height={96}
          className="h-24 w-auto drop-shadow-[0_6px_20px_rgba(224,104,95,0.3)]"
        />
      </div>
      <h2 className="mt-4 text-[20px] font-extrabold tracking-tight text-[#2D2D2D]">{title}</h2>
      {subtitle && (
        <p className="mt-2 max-w-sm text-[14px] text-[#6B6B6B]">{subtitle}</p>
      )}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#E0685F] px-5 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#D05A52] hover:-translate-y-0.5"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
