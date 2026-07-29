"use client";

import {
  ElementType,
  HTMLAttributes,
  ReactNode,
  createElement,
  useEffect,
  useRef,
  useState,
} from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return createElement(as, {
    ref,
    className: `reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`,
    style: { transitionDelay: `${delay}ms` },
    ...props,
    children,
  });
}
