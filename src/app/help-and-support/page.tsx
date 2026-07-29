import { business } from "@/data/site";

export default function HelpAndSupportPage() {
  return (
    <section className="site-shell py-12">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Support
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-slate-900">
          Help and Support
        </h1>
        <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
          <p>
            If you need help with an order, customization request, delivery
            detail, or product question, please reach out directly.
          </p>
          <p>
            WhatsApp is the fastest support channel for Little Art Heaven,
            especially for custom gift coordination and order follow-up.
          </p>
          <div className="rounded-[1.5rem] bg-[#fff7f2] p-5">
            <p><strong>Email:</strong> {business.email}</p>
            <p className="mt-2">
              <strong>WhatsApp:</strong>{" "}
              <a
                href={`https://wa.me/${business.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#b66b5a]"
              >
                Chat with Little Art Heaven
              </a>
            </p>
          </div>
          <p>
            Please include your order ID when asking about an existing order so
            support is faster.
          </p>
        </div>
      </div>
    </section>
  );
}
