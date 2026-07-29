import { NextResponse } from "next/server";

import { getProductsBySlugs } from "@/lib/catalog";
import { sendOrderNotification } from "@/lib/email";
import { createOrder } from "@/lib/orders";
import { createWhatsAppLink } from "@/lib/whatsapp";
import { CheckoutPayload } from "@/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutPayload;

    if (!payload.customerName?.trim() || !payload.phone?.trim()) {
      return NextResponse.json(
        { error: "Customer name and phone are required." },
        { status: 400 },
      );
    }

    if (!payload.items?.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const products = await getProductsBySlugs(payload.items.map((item) => item.slug));
    const order = await createOrder(payload, products);

    try {
      await sendOrderNotification(order);
    } catch (error) {
      console.error("Order email failed", error);
    }

    return NextResponse.json({
      orderCode: order.orderCode,
      whatsappUrl: createWhatsAppLink(order),
    });
  } catch (error) {
    console.error("Order creation failed", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to place order right now.",
      },
      { status: 500 },
    );
  }
}
