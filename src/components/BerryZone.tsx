/** The pastel ATF background with blobs, floating objects, and wave divider */

const WEATHER_GRADIENTS = {
  sunny: "linear-gradient(175deg, #FFF3E0 0%, #FFE4C4 40%, #FFD8B0 100%)",
  rainy: "linear-gradient(175deg, #EDE7F6 0%, #D5CCF0 40%, #C5B8E8 100%)",
  cold: "linear-gradient(175deg, #E0F5F0 0%, #C8EAE0 40%, #B8E0D4 100%)",
  default: "linear-gradient(175deg, #FFF3E0 0%, #FFE4C4 40%, #FFD8B0 100%)",
};

// Floating objects per mood — kids-related emoji that set the scene
const FLOATING_OBJECTS: Record<string, { emoji: string; size: number; top: string; left: string; blur: number; delay: number; duration: number; opacity: number }[]> = {
  sunny: [
    { emoji: "🌳", size: 40, top: "8%",  left: "3%",  blur: 0, delay: 0,   duration: 7, opacity: 0.3 },
    { emoji: "🚲", size: 32, top: "20%", left: "88%", blur: 0, delay: 1.5, duration: 8, opacity: 0.25 },
    { emoji: "🍦", size: 28, top: "55%", left: "6%",  blur: 1, delay: 0.8, duration: 9, opacity: 0.2 },
    { emoji: "🦌", size: 36, top: "70%", left: "90%", blur: 0, delay: 2,   duration: 7, opacity: 0.25 },
    { emoji: "🌊", size: 24, top: "40%", left: "92%", blur: 2, delay: 0.3, duration: 10, opacity: 0.15 },
    { emoji: "☀️", size: 22, top: "12%", left: "78%", blur: 1, delay: 1,   duration: 6, opacity: 0.2 },
    { emoji: "🌻", size: 26, top: "80%", left: "15%", blur: 1, delay: 2.5, duration: 8, opacity: 0.18 },
    { emoji: "🪁", size: 30, top: "5%",  left: "60%", blur: 0, delay: 0.5, duration: 9, opacity: 0.22 },
  ],
  rainy: [
    { emoji: "☕", size: 36, top: "10%", left: "5%",  blur: 0, delay: 0,   duration: 7, opacity: 0.3 },
    { emoji: "🎨", size: 30, top: "25%", left: "90%", blur: 0, delay: 1.2, duration: 8, opacity: 0.25 },
    { emoji: "📚", size: 28, top: "60%", left: "4%",  blur: 1, delay: 0.6, duration: 9, opacity: 0.2 },
    { emoji: "🧩", size: 32, top: "75%", left: "88%", blur: 0, delay: 2,   duration: 7, opacity: 0.25 },
    { emoji: "🎬", size: 24, top: "45%", left: "93%", blur: 2, delay: 0.3, duration: 10, opacity: 0.15 },
    { emoji: "🎭", size: 26, top: "15%", left: "75%", blur: 1, delay: 1.5, duration: 6, opacity: 0.2 },
    { emoji: "🖍️", size: 22, top: "82%", left: "12%", blur: 1, delay: 2.2, duration: 8, opacity: 0.18 },
    { emoji: "🧸", size: 28, top: "5%",  left: "55%", blur: 0, delay: 0.8, duration: 9, opacity: 0.22 },
  ],
  cold: [
    { emoji: "🧤", size: 34, top: "10%", left: "4%",  blur: 0, delay: 0,   duration: 7, opacity: 0.3 },
    { emoji: "🏊", size: 30, top: "22%", left: "89%", blur: 0, delay: 1.3, duration: 8, opacity: 0.25 },
    { emoji: "🎪", size: 28, top: "58%", left: "5%",  blur: 1, delay: 0.7, duration: 9, opacity: 0.2 },
    { emoji: "🎭", size: 32, top: "72%", left: "91%", blur: 0, delay: 1.8, duration: 7, opacity: 0.25 },
    { emoji: "⛸️", size: 24, top: "42%", left: "94%", blur: 2, delay: 0.4, duration: 10, opacity: 0.15 },
    { emoji: "🍫", size: 22, top: "14%", left: "72%", blur: 1, delay: 1.1, duration: 6, opacity: 0.2 },
    { emoji: "🧣", size: 26, top: "80%", left: "18%", blur: 1, delay: 2.3, duration: 8, opacity: 0.18 },
    { emoji: "🎵", size: 28, top: "6%",  left: "50%", blur: 0, delay: 0.6, duration: 9, opacity: 0.22 },
  ],
  default: [],
};

export default function BerryZone({
  mood,
  children,
}: {
  mood: "sunny" | "rainy" | "cold" | "default";
  children: React.ReactNode;
}) {
  const gradient = WEATHER_GRADIENTS[mood] || WEATHER_GRADIENTS.default;
  const objects = FLOATING_OBJECTS[mood] || FLOATING_OBJECTS.sunny;

  return (
    <>
      <div className="relative overflow-hidden pb-12" style={{ background: gradient }}>
        {/* Subtle line pattern — depth texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Blurred blobs — organic depth */}
        <div className="pointer-events-none absolute -right-24 -top-36 h-[400px] w-[400px] rounded-full bg-white/25 blur-[60px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-20 h-[250px] w-[250px] rounded-full bg-white/15 blur-[50px]" />
        <div className="pointer-events-none absolute right-[10%] top-[40%] h-[180px] w-[180px] rounded-full bg-white/10 blur-[40px]" />

        {/* Colored blob accent */}
        <div
          className="pointer-events-none absolute h-[200px] w-[200px] rounded-full blur-[80px]"
          style={{
            top: "20%",
            left: "75%",
            background: mood === "sunny" ? "rgba(255,180,100,0.12)" : mood === "rainy" ? "rgba(130,140,255,0.1)" : "rgba(140,220,200,0.1)",
          }}
        />

        {/* Floating emoji objects — 3D depth effect */}
        {objects.map((obj, i) => (
          <div
            key={i}
            className="pointer-events-none absolute hidden sm:block"
            style={{
              top: obj.top,
              left: obj.left,
              fontSize: `${obj.size}px`,
              opacity: obj.opacity,
              filter: obj.blur > 0 ? `blur(${obj.blur}px)` : undefined,
              animation: `floatObject ${obj.duration}s ease-in-out infinite ${obj.delay}s`,
            }}
          >
            {obj.emoji}
          </div>
        ))}

        {/* Sparkles */}
        <div className="pointer-events-none absolute left-[8%] top-[18%]" style={{ animation: "sparkle 3s ease-in-out infinite" }}>
          <span className="text-[12px] text-white/40">✦</span>
        </div>
        <div className="pointer-events-none absolute right-[12%] top-[30%]" style={{ animation: "sparkle 3s ease-in-out infinite 1.2s" }}>
          <span className="text-[10px] text-white/30">✦</span>
        </div>
        <div className="pointer-events-none absolute left-[15%] top-[65%]" style={{ animation: "sparkle 3s ease-in-out infinite 0.6s" }}>
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
