import { getAllOrders, updateOrderStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { OrderRecord } from "@/types";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  async function updateStatusAction(formData: FormData) {
    "use server";

    const id = String(formData.get("id") || "");
    const status = String(formData.get("status") || "new") as
      | "new"
      | "contacted"
      | "confirmed"
      | "completed"
      | "cancelled";
    if (!id) {
      return;
    }
    await updateOrderStatus(id, status);
  }

  return (
    <section className="site-shell py-10">
      <div className="rounded-[2.25rem] bg-white px-6 py-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Order management</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-slate-900">
          Incoming orders
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Each order is saved with a readable order code, customer details, and itemized totals.
        </p>
      </div>
      <div className="mt-8 grid gap-4">
        {orders.length ? (
          orders.map((order: OrderRecord) => (
            <article key={order.id} className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    {order.orderCode}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    {order.customerName}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {order.phone} · {order.email || "No email"} · {order.address || "No address"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-900">
                    {formatPrice(order.totalAmount)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm leading-6 text-slate-700">
                {order.items.map((item: OrderRecord["items"][number], index) => (
                  <p key={`${order.id}-${index}`}>
                    {item.name} x {item.quantity} = {formatPrice(item.lineTotal)}
                  </p>
                ))}
              </div>
              {order.notes ? (
                <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  {order.notes}
                </p>
              ) : null}
              <form action={updateStatusAction} className="mt-5 flex flex-wrap items-center gap-3">
                <input type="hidden" name="id" value={order.id} />
                <select
                  name="status"
                  defaultValue={order.status}
                  className="rounded-full border border-slate-200 px-4 py-2"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Update status
                </button>
              </form>
            </article>
          ))
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/75 p-8 text-sm leading-6 text-slate-600">
            No orders yet. Once a customer checks out, the order will appear here and in the notification email.
          </div>
        )}
      </div>
    </section>
  );
}
