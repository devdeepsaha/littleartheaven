"use client";

import Image, { ImageProps } from "next/image";
import { useCallback, useState } from "react";

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
  const fillWrapperClassName = "fill" in props && props.fill ? "absolute inset-0" : "";
  const imageClassName = `motion-image${loaded ? " is-loaded" : ""}${className ? ` ${className}` : ""}`;

  const markLoaded = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className={`motion-image-shell ${fillWrapperClassName} ${wrapperClassName}`.trim()}>
      <div className={`motion-image-skeleton${loaded ? " is-hidden" : ""}`} aria-hidden="true" />
      <Image
        alt={alt}
        ref={handleRef}
        className={imageClassName}
        onLoad={markLoaded}
        {...props}
      />
    </div>
  );
}
