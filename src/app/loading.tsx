export default function Loading() {
  return (
    <section className="site-shell py-10">
      <div className="animate-pulse rounded-[2rem] bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="h-3 w-28 rounded-full bg-slate-200" />
        <div className="mt-4 h-10 w-64 rounded-full bg-slate-200" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white p-3"
            >
              <div className="aspect-[4/5] rounded-[1.2rem] bg-slate-200" />
              <div className="mt-4 h-4 w-20 rounded-full bg-slate-200" />
              <div className="mt-3 h-6 w-3/4 rounded-full bg-slate-200" />
              <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
              <div className="mt-2 h-4 w-2/3 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
