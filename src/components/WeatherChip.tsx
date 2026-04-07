"use client";

import { useState } from "react";

type ForecastDay = {
  icon: string;
  day: string;
  tempMax: number;
  isRainy: boolean;
};

export default function WeatherChip({
  icon,
  temp,
  description,
  reason,
  forecast,
}: {
  icon: string;
  temp: number;
  description: string;
  reason: string;
  forecast: ForecastDay[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative hidden sm:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Chip */}
      <button className="flex items-center gap-1.5 rounded-full bg-white/50 px-3.5 py-1.5 text-[13px] font-bold text-[#2D2D2D] shadow-sm backdrop-blur-sm transition-all hover:bg-white/70 hover:shadow-md">
        {icon} {temp}°C
        <svg className={`h-3 w-3 text-[#6B6B6B] transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[260px] rounded-[20px] bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] animate-berry-fade-in">
          {/* Current */}
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[28px]">{icon}</span>
            <div>
              <p className="text-[16px] font-extrabold text-[#2D2D2D]">{temp}°C · {description}</p>
              <p className="text-[12px] font-semibold text-[#6B6B6B]">{reason}</p>
            </div>
          </div>

          {/* Forecast */}
          <div className="border-t border-[#F0ECE8] pt-3">
            <div className="grid grid-cols-4 gap-1">
              {forecast.slice(0, 4).map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1 rounded-[12px] py-2 text-center">
                  <span className="text-[11px] font-bold uppercase text-[#6B6B6B]">{d.day}</span>
                  <span className="text-[18px]">{d.icon}</span>
                  <span className="text-[12px] font-bold text-[#2D2D2D]">{d.tempMax}°</span>
                  {d.isRainy && <span className="text-[10px] font-bold text-[#7BA0E0]">regen</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
