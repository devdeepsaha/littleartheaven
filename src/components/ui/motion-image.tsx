"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type MotionImageProps = ImageProps & {
  wrapperClassName?: string;
};

export function MotionImage({
  wrapperClassName = "",
  className = "",
  alt,
  ...props
}: MotionImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`motion-image-shell ${wrapperClassName}`.trim()}>
      <div className={`motion-image-skeleton${loaded ? " is-hidden" : ""}`} aria-hidden="true" />
      <Image
        alt={alt}
        className={`motion-image${loaded ? " is-loaded" : ""}${className ? ` ${className}` : ""}`}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </div>
  );
}
