import { business } from "@/data/site";

export default function PrivacyPolicyPage() {
  return (
    <section className="site-shell py-12">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Legal
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-slate-900">
          Privacy Policy
        </h1>
        <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
          <p>
            Little Art Heaven collects basic customer information such as name,
            phone number, email, address, and order notes only for order
            processing, customer communication, and support.
          </p>
          <p>
            Your information is used to manage product orders, send order
            notifications, and coordinate delivery or customization details with
            you.
          </p>
          <p>
            Customer information is not sold to third parties. It may be stored
            through secure tools used for the website, including Supabase and
            email services connected to the business workflow.
          </p>
          <p>
            If you would like your order-related information to be corrected or
            removed, contact {business.email}.
          </p>
        </div>
      </div>
    </section>
  );
}
