"use client";

import Image from "next/image";
import { useState } from "react";

export function FounderPortrait({
  src,
  name,
}: {
  src: string | null;
  name: string;
}) {
  const [hidden, setHidden] = useState(!src);

  if (!src || hidden) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-[1.7rem] bg-[linear-gradient(180deg,#fff8ef_0%,#fde9df_100%)] text-center shadow-[0_14px_40px_rgba(214,160,130,0.16)]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9795d]">Founder</p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[#7c4c3f]">
            {name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] shadow-[0_18px_50px_rgba(149,115,92,0.18)]">
      <Image
        src={src}
        alt={name}
        fill
        sizes="(max-width: 1024px) 100vw, 24vw"
        className="object-cover"
        onError={() => setHidden(true)}
      />
    </div>
  );
}
