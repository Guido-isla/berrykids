export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
      <div className="h-4 w-48 animate-pulse rounded bg-[#F5F0EB]" />
      <div className="mt-6 aspect-[16/9] animate-pulse rounded-2xl bg-[#F5F0EB]" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex gap-2">
            <div className="h-7 w-20 animate-pulse rounded-full bg-[#F5F0EB]" />
            <div className="h-7 w-24 animate-pulse rounded-full bg-[#F5F0EB]" />
            <div className="h-7 w-16 animate-pulse rounded-full bg-[#F5F0EB]" />
          </div>
          <div className="mt-4 h-8 w-3/4 animate-pulse rounded bg-[#F5F0EB]" />
          <div className="mt-6 space-y-2">
            <div className="h-4 animate-pulse rounded bg-[#F5F0EB]" />
            <div className="h-4 animate-pulse rounded bg-[#F5F0EB]" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#F5F0EB]" />
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="h-[220px] animate-pulse rounded-2xl bg-[#F5F0EB]" />
          <div className="mt-4 h-[200px] animate-pulse rounded-2xl bg-[#F5F0EB]" />
        </div>
      </div>
    </div>
  );
}
