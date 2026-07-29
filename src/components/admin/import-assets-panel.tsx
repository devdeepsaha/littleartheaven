"use client";

import { useActionState } from "react";

import { importLocalAssetsAction } from "@/app/admin/products/actions";

const importAssetsInitialState = {
  status: "idle",
  message: "",
};

export function ImportAssetsPanel() {
  const [state, formAction, isPending] = useActionState(
    importLocalAssetsAction,
    importAssetsInitialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-[1.6rem] border border-[#efd9cb] bg-[linear-gradient(135deg,#fff8f3_0%,#fff2ea_100%)] p-5 shadow-[0_14px_35px_rgba(213,147,124,0.12)]"
    >
      <p className="text-xs uppercase tracking-[0.26em] text-[#b77260]">
        Bulk import
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
        Push existing local assets to Supabase
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        This uploads everything already inside `public/assets/products` and
        `public/assets/brand` to your Supabase Storage bucket in one shot, so
        you do not have to add old images one by one.
      </p>
      <button
        type="submit"
        disabled={isPending}
        className="mt-5 rounded-full bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-5 py-3 text-sm font-semibold text-[#5b312d] shadow-[0_12px_30px_rgba(213,147,124,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Importing assets..." : "Import existing local assets"}
      </button>
      {state.message ? (
        <p
          className={`mt-4 text-sm font-semibold ${
            state.status === "error" ? "text-rose-600" : "text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
