import Link from "next/link";
import { MotionImage } from "@/components/ui/motion-image";

export function CategoryCard({
  slug,
  name,
  description,
  image,
  productCount,
}: {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}) {
  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group flex flex-col items-center gap-3 rounded-[1.35rem] border border-white/70 bg-white px-3 py-3 text-center shadow-[0_14px_35px_rgba(15,23,42,0.07)] transition duration-200 ease-[var(--motion-ease-standard)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_44px_rgba(15,23,42,0.1)] sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-4 sm:text-left"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-4 ring-[#fff4ee] sm:h-20 sm:w-20">
        {/* Keeping the scale on the image wrapper preserves the soft tile lift without distorting text. */}
        <MotionImage
          src={image}
          alt={`${name} category from Little Art Heaven`}
          fill
          sizes="(max-width: 640px) 64px, 80px"
          wrapperClassName="h-full w-full"
          className="object-cover transition duration-300 group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{name}</h3>
          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-700 sm:text-[11px]">
            {productCount} items
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}
