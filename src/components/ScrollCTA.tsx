import { Link } from "@/i18n/navigation";

export default function ScrollCTA({
  emoji,
  label,
  href,
}: {
  emoji: string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex w-[60vw] shrink-0 flex-col items-center justify-center rounded-[20px] bg-gradient-to-br from-[#E0685F] to-[#FFD8B0] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg sm:w-auto sm:aspect-[3/2]"
    >
      <span className="text-[32px]">{emoji}</span>
      <p className="mt-2 text-[15px] font-extrabold leading-snug text-white sm:text-[16px]">
        {label}
      </p>
      <span className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-[14px] text-white">
        →
      </span>
    </Link>
  );
}
