import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import {
  createSupabaseAdminClient,
  hasSupabaseConfig,
} from "@/lib/supabase-server";
import { generateOrderCode } from "@/lib/order-code";
import {
  CheckoutPayload,
  OrderItem,
  OrderRecord,
  OrderStatus,
  ProductWithCategory,
} from "@/types";

const mockOrderPath = path.join(process.cwd(), ".data", "orders.json");

function calculateOrderItems(
  payload: CheckoutPayload,
  products: ProductWithCategory[],
): OrderItem[] {
  return payload.items
    .map((item) => {
      const product = products.find((entry) => entry.slug === item.slug);
      if (!product) {
        return null;
      }

      return {
        productId: product.id,
        slug: product.slug,
        name: item.label?.trim() || product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter(Boolean) as OrderItem[];
}

async function persistOrderLocally(record: OrderRecord) {
  await mkdir(path.dirname(mockOrderPath), { recursive: true });

  let existing: OrderRecord[] = [];
  try {
    existing = JSON.parse(await readFile(mockOrderPath, "utf-8")) as OrderRecord[];
  } catch {
    existing = [];
  }

  existing.unshift(record);
  await writeFile(mockOrderPath, JSON.stringify(existing, null, 2), "utf-8");
}

export async function createOrder(
  payload: CheckoutPayload,
  products: ProductWithCategory[],
) {
  const unavailableProduct = products.find((product) => !product.available);
  if (unavailableProduct) {
    throw new Error(`${unavailableProduct.name} is currently sold out.`);
  }

  const items = calculateOrderItems(payload, products);
  if (!items.length) {
    throw new Error("We could not match the cart items to products.");
  }

  const totalAmount = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const orderCode = generateOrderCode();
  const now = new Date().toISOString();

  const record: OrderRecord = {
    id: randomUUID(),
    orderCode,
    customerName: payload.customerName.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    address: payload.address.trim(),
    notes: payload.notes.trim(),
    status: "new",
    totalAmount,
    createdAt: now,
    items,
  };

  if (hasSupabaseConfig()) {
    try {
      const supabase = await createSupabaseAdminClient();
      const { error } = await supabase.from("orders").insert({
        id: record.id,
        order_code: record.orderCode,
        customer_name: record.customerName,
        phone: record.phone,
        email: record.email || null,
        address: record.address || null,
        notes: record.notes || null,
        status: record.status,
        total_amount: record.totalAmount,
        created_at: record.createdAt,
      });

      if (error) {
        throw new Error(error.message);
      }

      const { error: itemError } = await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: record.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          line_total: item.lineTotal,
        })),
      );

      if (itemError) {
        throw new Error(itemError.message);
      }

      return record;
    } catch {
      await persistOrderLocally(record);
      return record;
    }
  }

  await persistOrderLocally(record);
  return record;
}

export async function getAllOrders() {
  if (hasSupabaseConfig()) {
    const supabase = await createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      return [] as OrderRecord[];
    }

    return (data || []).map((row) => ({
      id: row.id,
      orderCode: row.order_code,
      customerName: row.customer_name,
      phone: row.phone,
      email: row.email || "",
      address: row.address || "",
      notes: row.notes || "",
      status: row.status as OrderStatus,
      totalAmount: row.total_amount,
      createdAt: row.created_at,
      items: (row.order_items || []).map((item: {
        product_id: string;
        quantity: number;
        unit_price: number;
        line_total: number;
      }) => ({
        productId: item.product_id,
        slug: "",
        name: "Product",
        quantity: item.quantity,
        unitPrice: item.unit_price,
        lineTotal: item.line_total,
      })),
    }));
  }

  try {
    return JSON.parse(await readFile(mockOrderPath, "utf-8")) as OrderRecord[];
  } catch {
    return [];
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  if (!hasSupabaseConfig()) {
    const existing = await getAllOrders();
    const updated = existing.map((order) =>
      order.id === id ? { ...order, status } : order,
    );
    await mkdir(path.dirname(mockOrderPath), { recursive: true });
    await writeFile(mockOrderPath, JSON.stringify(updated, null, 2), "utf-8");
    return;
  }

  const supabase = await createSupabaseAdminClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}
