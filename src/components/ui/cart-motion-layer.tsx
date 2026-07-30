"use client";

import type { CSSProperties } from "react";

type CartFlight = {
  id: number;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  imageUrl?: string;
};

export function CartMotionLayer({
  flights,
}: {
  flights: CartFlight[];
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {flights.map((flight) => (
        <div
          key={flight.id}
          className="cart-flight"
          style={
            {
              "--flight-x": `${flight.x}px`,
              "--flight-y": `${flight.y}px`,
              "--flight-dx": `${flight.deltaX}px`,
              "--flight-dy": `${flight.deltaY}px`,
            } as CSSProperties
          }
        >
          {flight.imageUrl ? (
            <img src={flight.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
