import Image from "next/image";

export type BerryGreetingProps = {
  message: string;
};

export default function BerryGreeting({ message }: BerryGreetingProps) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-[16px] border border-[#FFD8B0] bg-gradient-to-r from-[#FDF1EA] to-[#FFF6E8] px-4 py-3 shadow-[0_2px_10px_rgba(224,104,95,0.08)]">
      <Image
        src="/berry-wink.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-auto shrink-0"
      />
      <p className="self-center text-[14px] font-semibold leading-snug text-[#2D2D2D]">
        {message}
      </p>
    </div>
  );
}
