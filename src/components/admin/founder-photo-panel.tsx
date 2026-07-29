"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { business } from "@/data/site";

async function compressImage(file: File, maxBytes = 1_000_000) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");

  let width = bitmap.width;
  let height = bitmap.height;
  const maxDimension = 1800;

  if (width > maxDimension || height > maxDimension) {
    const scale = Math.min(maxDimension / width, maxDimension / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not process image.");
  }

  context.drawImage(bitmap, 0, 0, width, height);

  let quality = 0.9;
  let blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );

  while (blob && blob.size > maxBytes && quality > 0.45) {
    quality -= 0.08;
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
  }

  if (!blob) {
    throw new Error("Could not compress image.");
  }

  return new File([blob], "founder-photo.jpg", {
    type: "image/jpeg",
  });
}

export function FounderPhotoPanel() {
  const [imageUrl, setImageUrl] = useState<string | null>(business.founderImage);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Founder photo
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Update Srijita&apos;s creator story image
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Upload one portrait here and it will appear automatically in the founder story section on the storefront.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-5 rounded-full bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-5 py-3 text-sm font-semibold text-[#5b312d] shadow-[0_12px_30px_rgba(213,147,124,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading photo..." : "Upload founder photo"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }

              setUploading(true);
              setMessage(null);
              setError(null);

              try {
                const compressed = await compressImage(file);
                const formData = new FormData();
                formData.append("file", compressed);
                formData.append("folder", "brand");
                formData.append("fileName", "founder-photo");
                formData.append("upsert", "true");

                const response = await fetch("/api/admin/upload-product-image", {
                  method: "POST",
                  body: formData,
                });

                const body = (await response.json()) as { error?: string; url?: string };
                if (!response.ok || !body.url) {
                  throw new Error(body.error || "Unable to upload founder photo.");
                }

                setImageUrl(`${body.url}?t=${Date.now()}`);
                setMessage("Founder photo updated. Refresh the homepage if it was already open.");
              } catch (uploadError) {
                setError(
                  uploadError instanceof Error
                    ? uploadError.message
                    : "Unable to upload founder photo right now.",
                );
              } finally {
                setUploading(false);
                event.target.value = "";
              }
            }}
          />
          {message ? <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p> : null}
        </div>

        <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-[1.4rem] border border-slate-100 bg-[#fff7f2]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={business.founderName}
              fill
              sizes="220px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-slate-500">
              Upload a portrait and it will show here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
