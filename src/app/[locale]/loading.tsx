export default function Loading() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8">
      {/* Hero skeleton */}
      <div className="h-[280px] animate-pulse rounded-[24px] bg-[#F5F0EB] sm:h-[380px]" />
      {/* Section title skeletons */}
      <div className="mt-10">
        <div className="h-6 w-48 animate-pulse rounded bg-[#F5F0EB]" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-[#F5F0EB]" />
      </div>
      {/* Card grid skeleton */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="overflow-hidden rounded-[20px] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="aspect-[3/2] animate-pulse bg-[#F5F0EB]" />
            <div className="p-3.5">
              <div className="h-4 animate-pulse rounded bg-[#F5F0EB]" />
              <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-[#F5F0EB]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
