"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CartMotionLayer } from "@/components/ui/cart-motion-layer";

type CartLine = {
  lineId: string;
  slug: string;
  quantity: number;
  imageUrl?: string;
  label?: string;
};

type AddItemMeta = {
  originRect?: DOMRect | null;
  imageUrl?: string;
  label?: string;
};

type CartContextValue = {
  items: CartLine[];
  addItem: (slug: string, meta?: AddItemMeta) => void;
  updateItem: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  cartPulseKey: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "little-art-heaven-cart";

function createLineId(slug: string, meta?: AddItemMeta) {
  return [slug, meta?.label || "", meta?.imageUrl || ""].join("::");
}

function normalizeCartLine(item: Partial<CartLine> & { slug: string; quantity: number }) {
  const label = typeof item.label === "string" ? item.label : undefined;
  const imageUrl = typeof item.imageUrl === "string" ? item.imageUrl : undefined;

  return {
    lineId:
      typeof item.lineId === "string" && item.lineId.trim()
        ? item.lineId
        : createLineId(item.slug, { label, imageUrl }),
    slug: item.slug,
    quantity: item.quantity,
    imageUrl,
    label,
  } satisfies CartLine;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartPulseKey, setCartPulseKey] = useState(0);
  const [flights, setFlights] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      deltaX: number;
      deltaY: number;
      imageUrl?: string;
    }>
  >([]);
  const [items, setItems] = useState<CartLine[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    try {
      return (JSON.parse(raw) as Array<Partial<CartLine> & { slug: string; quantity: number }>)
        .map(normalizeCartLine);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  function celebrateAdd(meta?: AddItemMeta) {
    setCartPulseKey((value) => value + 1);

    if (!meta?.originRect) {
      return;
    }

    const cartAnchor = document.querySelector("[data-cart-anchor='true']");
    if (!(cartAnchor instanceof HTMLElement)) {
      return;
    }

    cartAnchor.classList.remove("cart-bounce");
    window.requestAnimationFrame(() => {
      cartAnchor.classList.add("cart-bounce");
      window.setTimeout(() => cartAnchor.classList.remove("cart-bounce"), 430);
    });

    const cartRect = cartAnchor.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const x = meta.originRect.left + meta.originRect.width / 2 - 20;
    const y = meta.originRect.top + meta.originRect.height / 2 - 20;
    const deltaX = cartRect.left + cartRect.width / 2 - x - 20;
    const deltaY = cartRect.top + cartRect.height / 2 - y - 20;

    setFlights((current) => [
      ...current,
      {
        id,
        x,
        y,
        deltaX,
        deltaY,
        imageUrl: meta.imageUrl,
      },
    ]);

    window.setTimeout(() => {
      setFlights((current) => current.filter((flight) => flight.id !== id));
    }, 560);
  }

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      cartPulseKey,
      addItem(slug, meta) {
        setItems((current) => {
          const lineId = createLineId(slug, meta);
          const existing = current.find((item) => item.lineId === lineId);
          if (existing) {
            return current.map((item) =>
              item.lineId === lineId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }

          return [
            ...current,
            {
              lineId,
              slug,
              quantity: 1,
              imageUrl: meta?.imageUrl,
              label: meta?.label,
            },
          ];
        });
        celebrateAdd(meta);
      },
      updateItem(lineId, quantity) {
        setItems((current) =>
          current
            .map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem(lineId) {
        setItems((current) => current.filter((item) => item.lineId !== lineId));
      },
      clearCart() {
        setItems([]);
      },
    }),
    [cartPulseKey, items],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartMotionLayer flights={flights} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
