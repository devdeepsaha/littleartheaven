export const motionTokens = {
  duration: {
    micro: 180,
    standard: 280,
    section: 420,
    page: 520,
  },
  easing: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
    gentle: "cubic-bezier(0.16, 1, 0.3, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
  },
  spring: {
    soft: "cubic-bezier(0.2, 0.9, 0.25, 1.15)",
  },
  stagger: {
    fast: 80,
    standard: 110,
  },
} as const;

export function ms(value: number) {
  return `${value}ms`;
}
