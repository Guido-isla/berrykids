/** The pastel ATF background with blobs, sparkles, and wave divider */

const WEATHER_GRADIENTS = {
  sunny: "linear-gradient(175deg, #FFF3E0 0%, #FFE4C4 40%, #FFD8B0 100%)",
  rainy: "linear-gradient(175deg, #EDE7F6 0%, #D5CCF0 40%, #C5B8E8 100%)",
  cold: "linear-gradient(175deg, #E0F5F0 0%, #C8EAE0 40%, #B8E0D4 100%)",
  default: "linear-gradient(175deg, #FFF3E0 0%, #FFE4C4 40%, #FFD8B0 100%)",
};

export default function BerryZone({
  mood,
  children,
}: {
  mood: "sunny" | "rainy" | "cold" | "default";
  children: React.ReactNode;
}) {
  const gradient = WEATHER_GRADIENTS[mood] || WEATHER_GRADIENTS.default;

  return (
    <>
      <div className="relative overflow-hidden pb-12" style={{ background: gradient }}>
        {/* Blurred blobs */}
        <div className="pointer-events-none absolute -right-24 -top-36 h-[400px] w-[400px] rounded-full bg-white/25 blur-[60px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-20 h-[250px] w-[250px] rounded-full bg-white/15 blur-[50px]" />
        <div className="pointer-events-none absolute right-[10%] top-[40%] h-[180px] w-[180px] rounded-full bg-white/10 blur-[40px]" />

        {/* Sparkles */}
        <div className="pointer-events-none absolute left-[8%] top-[18%] h-2 w-2 rounded-full" style={{ animation: "sparkle 3s ease-in-out infinite" }}>
          <span className="text-[12px] text-white/40">✦</span>
        </div>
        <div className="pointer-events-none absolute right-[12%] top-[30%] h-2 w-2 rounded-full" style={{ animation: "sparkle 3s ease-in-out infinite 1.2s" }}>
          <span className="text-[10px] text-white/30">✦</span>
        </div>
        <div className="pointer-events-none absolute left-[15%] top-[65%] h-2 w-2 rounded-full" style={{ animation: "sparkle 3s ease-in-out infinite 0.6s" }}>
          <span className="text-[14px] text-white/35">✦</span>
        </div>

        {children}
      </div>

      {/* Wave divider */}
      <div className="relative z-10 -mt-1">
        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="block h-[40px] w-full">
          <path d="M0,18 C320,50 720,0 1440,28 L1440,50 L0,50 Z" fill="#FFF9F0" />
        </svg>
      </div>
    </>
  );
}
