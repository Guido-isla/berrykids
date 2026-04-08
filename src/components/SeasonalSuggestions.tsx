import Link from "next/link";
import Image from "next/image";

type Suggestion = { slug: string; title: string; description: string; image: string; free: boolean };

export default function SeasonalSuggestions({
  seasonName,
  seasonEmoji,
  suggestions,
}: {
  seasonName: string;
  seasonEmoji: string;
  suggestions: Suggestion[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h2 className="mb-2 text-xl font-extrabold text-[#2D2D2D]">
        {seasonEmoji} {seasonName} in Haarlem
      </h2>
      <p className="mb-5 text-sm text-[#6B6B6B]">
        Seizoenstips — dit is nu het leukst om te doen
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {suggestions.map((s) => (
          <Link
            key={s.slug}
            href={`/tips/${s.slug}`}
            className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {s.free && (
                <span className="absolute right-2 top-2 rounded-full bg-[#8BC34A]/90 px-2 py-0.5 text-[10px] font-bold text-white">
                  Gratis
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#2D2D2D] transition-colors group-hover:text-[#E0685F]">
                {s.title}
              </h3>
              <p className="mt-1 text-sm text-[#6B6B6B]">{s.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
