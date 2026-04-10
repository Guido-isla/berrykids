import Image from "next/image";
import { Link } from "@/i18n/navigation";
import SaveButton from "./SaveButton";

export default function BerryCard({
  slug,
  title,
  image,
  location,
  free,
  price,
  berryTip,
  href,
}: {
  slug: string;
  title: string;
  image: string;
  location: string;
  free: boolean;
  price?: string;
  berryTip: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block min-w-0">
      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 80vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute right-3 top-3 z-10"><SaveButton slug={slug} /></span>
          {/* Berry tip overlay — bottom of image */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-3 pb-2.5 pt-6">
            <p className="flex items-center gap-1 text-[12px] font-bold leading-snug text-white sm:text-[13px]">
              <Image src="/berry-icon.png" alt="" width={16} height={16} className="h-4 w-4 shrink-0" /> {berryTip}
            </p>
          </div>
        </div>
        {/* Content */}
        <div className="px-3.5 py-3 sm:px-4">
          <h3 className="text-[15px] font-extrabold leading-snug tracking-tight text-[#2D2D2D] group-hover:text-[#E0685F] sm:text-[16px]">
            {title}
          </h3>
          <p className="mt-0.5 text-[13px] text-[#6B6B6B]">
            📍 {location}
          </p>
          <p className="mt-0.5 text-[13px] font-semibold">
            {free ? (
              <span className="text-[#4A8060]">Gratis</span>
            ) : price ? (
              <span className="text-[#2D2D2D]">{price}</span>
            ) : null}
          </p>
        </div>
      </div>
    </Link>
  );
}
