import nodemailer from "nodemailer";

import { business } from "@/data/site";
import { formatPrice } from "@/lib/utils";
import { OrderRecord } from "@/types";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOrderNotification(order: OrderRecord) {
  const transporter = createTransport();
  if (!transporter) {
    return {
      delivered: false,
      reason: "SMTP is not configured.",
    };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const to = process.env.BUSINESS_EMAIL || business.email;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.name} x ${item.quantity} - ${formatPrice(item.lineTotal)}</li>`,
    )
    .join("");

  await transporter.sendMail({
    from,
    to,
    subject: `New Little Art Heaven order: ${order.orderCode}`,
    html: `
      <h1>New order received</h1>
      <p><strong>Order ID:</strong> ${order.orderCode}</p>
      <p><strong>Name:</strong> ${order.customerName}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Email:</strong> ${order.email || "Not provided"}</p>
      <p><strong>Address:</strong> ${order.address || "Not provided"}</p>
      <p><strong>Notes:</strong> ${order.notes || "No notes"}</p>
      <p><strong>Total:</strong> ${formatPrice(order.totalAmount)}</p>
      <h2>Items</h2>
      <ul>${itemsHtml}</ul>
    `,
  });

  return {
    delivered: true,
  };
}
