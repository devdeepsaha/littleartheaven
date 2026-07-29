import { business } from "@/data/site";
import { formatPrice } from "@/lib/utils";
import { OrderRecord } from "@/types";

export function createWhatsAppLink(order: OrderRecord) {
  const itemLines = order.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} x ${item.quantity} - ${formatPrice(item.lineTotal)}`,
    )
    .join("\n");

  const message = [
    `Hi ${business.founderName}, I just placed an order on Little Art Heaven.`,
    ``,
    `Order ID: ${order.orderCode}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email || "Not provided"}`,
    `Address: ${order.address || "Not provided"}`,
    ``,
    `Items:`,
    itemLines,
    ``,
    `Total: ${formatPrice(order.totalAmount)}`,
    `Notes: ${order.notes || "No notes"}`,
  ].join("\n");

  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
