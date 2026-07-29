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
  slug: string;
  quantity: number;
};

type AddItemMeta = {
  originRect?: DOMRect | null;
  imageUrl?: string;
  label?: string;
};

type CartContextValue = {
  items: CartLine[];
  addItem: (slug: string, meta?: AddItemMeta) => void;
  updateItem: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  cartPulseKey: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "little-art-heaven-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartPulseKey, setCartPulseKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
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
      return JSON.parse(raw) as CartLine[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  function celebrateAdd(meta?: AddItemMeta) {
    setCartPulseKey((value) => value + 1);
    setToast(`Added ${meta?.label ? meta.label : "this handmade pick"} to your cart.`);
    window.setTimeout(() => setToast(null), 2200);

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
          const existing = current.find((item) => item.slug === slug);
          if (existing) {
            return current.map((item) =>
              item.slug === slug
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }

          return [...current, { slug, quantity: 1 }];
        });
        celebrateAdd(meta);
      },
      updateItem(slug, quantity) {
        setItems((current) =>
          current
            .map((item) => (item.slug === slug ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem(slug) {
        setItems((current) => current.filter((item) => item.slug !== slug));
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
      {/* This shared overlay keeps cart feedback consistent across grid and product detail add-to-cart moments. */}
      <CartMotionLayer flights={flights} toast={toast} />
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
