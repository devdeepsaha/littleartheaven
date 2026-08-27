"use client";

import Image from "next/image";
import { useEffect, useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { categories } from "@/data/site";
import type {
  DeleteProductActionResult,
  SaveProductActionResult,
} from "@/lib/admin-products";
import { formatPrice } from "@/lib/utils";
import { ProductWithCategory } from "@/types";

type ProductFormProps = {
  product?: ProductWithCategory;
};

type UploadState = {
  images: string[];
  uploading: boolean;
  error: string | null;
};

type ToastState = {
  status: "success" | "error";
  message: string;
} | null;

async function readUploadResponse(response: Response) {
  try {
    return (await response.json()) as { error?: string; url?: string };
  } catch {
    return {
      error: "The upload response was invalid. Please try again.",
    };
  }
}

async function compressImage(file: File, maxBytes = 1_000_000) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");

  let width = bitmap.width;
  let height = bitmap.height;
  const maxDimension = 1600;

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

  if (blob.size > maxBytes) {
    throw new Error("Compressed image is still larger than 1 MB.");
  }

  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, {
    type: "image/jpeg",
  });
}

async function saveProductRequest(formData: FormData): Promise<SaveProductActionResult> {
  const payload = {
    id: String(formData.get("id") || "").trim(),
    categoryId: String(formData.get("categoryId") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    shortDescription: String(formData.get("shortDescription") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    price: String(formData.get("price") || "0").trim(),
    imageUrls: [1, 2, 3, 4, 5]
      .map((index) => String(formData.get(`image_${index}`) || "").trim())
      .filter(Boolean)
      .slice(0, 5),
    available: formData.get("available") === "on",
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  };

  const response = await fetch("/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  try {
    const result = (await response.json()) as SaveProductActionResult;

    if (
      result &&
      (result.status === "success" || result.status === "error") &&
      typeof result.message === "string"
    ) {
      return result;
    }

    return {
      status: "error",
      message: "The product save response was invalid. Please try again.",
      created: false,
    };
  } catch {
    return {
      status: "error",
      message: "The product save response was invalid. Please try again.",
      created: false,
    };
  }
}

async function deleteProductRequest(payload: {
  id: string;
  slug: string;
}): Promise<DeleteProductActionResult> {
  const response = await fetch("/api/admin/products", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  try {
    const result = (await response.json()) as DeleteProductActionResult;

    if (
      result &&
      (result.status === "success" || result.status === "error") &&
      typeof result.message === "string"
    ) {
      return result;
    }

    return {
      status: "error",
      message: "The product delete response was invalid. Please try again.",
      deleted: false,
    };
  } catch {
    return {
      status: "error",
      message: "The product delete response was invalid. Please try again.",
      deleted: false,
    };
  }
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [uploadState, setUploadState] = useState<UploadState>({
    images: product?.images || [],
    uploading: false,
    error: null,
  });
  const [toast, setToast] = useState<ToastState>(null);
  const fileInputId = useId();
  const isNewProductForm = !product;

  const canUploadMore = uploadState.images.length < 5;

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        uploadState.images.forEach((image, index) => {
          formData.set(`image_${index + 1}`, image);
        });

        startTransition(async () => {
          const result = await saveProductRequest(formData);

          setToast({
            status: result.status,
            message: result.message,
          });

          if (result.status !== "success") {
            return;
          }

          router.refresh();

          if (isNewProductForm) {
            form.reset();
            setUploadState({
              images: [],
              uploading: false,
              error: null,
            });
          }
        });
      }}
      className="rounded-[1.75rem] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      {toast ? (
        <div
          className={`mb-4 rounded-[1.1rem] border px-4 py-3 text-sm font-semibold ${
            toast.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
      <input type="hidden" name="id" defaultValue={product?.id || ""} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              {product?.category.name || "New product"}
            </p>
            {product ? (
              <>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">
                  {formatPrice(product.price)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    product.published
                      ? "bg-slate-100 text-slate-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {product.published ? "Published" : "Draft"}
                </span>
              </>
            ) : null}
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            {product ? product.name : "Create a new product"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload up to five photos. Each image is compressed in the browser to stay under 1 MB before it goes to Supabase Storage.
          </p>
        </div>
        {uploadState.images[0] ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-[1.1rem] border border-slate-100">
            <Image
              src={uploadState.images[0]}
              alt={product?.name || "New product preview"}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={`name-${product?.id || "new"}`}>
            Product name
          </label>
          <input
            id={`name-${product?.id || "new"}`}
            name="name"
            required
            defaultValue={product?.name || ""}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e89a8f]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={`category-${product?.id || "new"}`}>
            Category
          </label>
          <select
            id={`category-${product?.id || "new"}`}
            name="categoryId"
            defaultValue={product?.categoryId || categories[0]?.id}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e89a8f]"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={`price-${product?.id || "new"}`}>
            Price
          </label>
          <input
            id={`price-${product?.id || "new"}`}
            name="price"
            type="number"
            min="0"
            required
            defaultValue={product?.price || 100}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e89a8f]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={`short-${product?.id || "new"}`}>
            Short description
          </label>
          <input
            id={`short-${product?.id || "new"}`}
            name="shortDescription"
            defaultValue={product?.shortDescription || ""}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e89a8f]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={`description-${product?.id || "new"}`}>
            Full description
          </label>
          <textarea
            id={`description-${product?.id || "new"}`}
            name="description"
            rows={4}
            defaultValue={product?.description || ""}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e89a8f]"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Product photos
          </h3>
          <span className="text-xs text-slate-500">
            {uploadState.images.length}/5 uploaded
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {uploadState.images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="rounded-[1.2rem] border border-slate-200 bg-[#fffaf7] p-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-[1rem]">
                <Image
                  src={image}
                  alt={`Uploaded product image ${index + 1}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setUploadState((current) => ({
                    ...current,
                    images: current.images.filter((_, imageIndex) => imageIndex !== index),
                  }))
                }
                className="mt-3 text-xs font-semibold text-rose-600"
              >
                Remove photo
              </button>
            </div>
          ))}

          {canUploadMore ? (
            <label
              htmlFor={fileInputId}
              aria-disabled={uploadState.uploading}
              className="flex min-h-[180px] flex-col items-center justify-center rounded-[1.2rem] border border-dashed border-[#e6c8b8] bg-[#fffaf7] px-4 text-center"
            >
              <span className="rounded-full bg-[#f7c9b0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5b312d]">
                Upload image
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                JPG, PNG, or WEBP.
                <br />
                Auto-compressed to under 1 MB.
              </p>
            </label>
          ) : null}
        </div>

        <input
          id={fileInputId}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          disabled={uploadState.uploading}
          className="sr-only"
          onChange={async (event) => {
            const files = Array.from(event.target.files || []);
            if (!files.length) {
              return;
            }

            setUploadState((current) => ({
              ...current,
              uploading: true,
              error: null,
            }));

            try {
              const availableSlots = 5 - uploadState.images.length;
              const chosenFiles = files.slice(0, availableSlots);
              const uploadedUrls: string[] = [];

              for (const file of chosenFiles) {
                const compressedFile = await compressImage(file);
                const uploadFormData = new FormData();
                uploadFormData.append("file", compressedFile);

                const response = await fetch("/api/admin/upload-product-image", {
                  method: "POST",
                  body: uploadFormData,
                });

                const body = await readUploadResponse(response);
                if (!response.ok || !body.url) {
                  throw new Error(body.error || "Image upload failed.");
                }

                uploadedUrls.push(body.url);
              }

              setUploadState((current) => ({
                ...current,
                images: [...current.images, ...uploadedUrls].slice(0, 5),
                uploading: false,
                error: null,
              }));
            } catch (error) {
              setUploadState((current) => ({
                ...current,
                uploading: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Unable to upload image right now.",
              }));
            } finally {
              event.target.value = "";
            }
          }}
        />

        {uploadState.uploading ? (
          <p className="mt-3 text-sm font-semibold text-slate-600">
            Uploading and compressing images...
          </p>
        ) : null}
        {uploadState.error ? (
          <p className="mt-3 text-sm font-semibold text-rose-600">{uploadState.error}</p>
        ) : null}

        {uploadState.images.map((image, index) => (
          <input key={image} type="hidden" name={`image_${index + 1}`} value={image} />
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
          <span>Available</span>
          <input
            type="checkbox"
            name="available"
            defaultChecked={product ? product.available : true}
            className="h-5 w-5 accent-[#e89a8f]"
          />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
          <span>Published</span>
          <input
            type="checkbox"
            name="published"
            defaultChecked={product ? product.published : true}
            className="h-5 w-5 accent-[#e89a8f]"
          />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
          <span>Featured on home</span>
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product ? product.featured : false}
            className="h-5 w-5 accent-[#e89a8f]"
          />
        </label>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={uploadState.uploading || isPending || isDeleting}
            className="rounded-full bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-6 py-3 text-sm font-semibold text-[#5b312d] shadow-[0_12px_30px_rgba(213,147,124,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : product ? "Save product changes" : "Create product"}
          </button>

          {product ? (
            <button
              type="button"
              disabled={isPending || isDeleting}
              onClick={() => {
                const confirmed = window.confirm(
                  `Delete "${product.name}"? This will remove it from the live catalog.`,
                );

                if (!confirmed) {
                  return;
                }

                startDeleteTransition(async () => {
                  const result = await deleteProductRequest({
                    id: product.id,
                    slug: product.slug,
                  });

                  setToast({
                    status: result.status,
                    message: result.message,
                  });

                  if (result.status !== "success") {
                    return;
                  }

                  router.refresh();
                });
              }}
              className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 shadow-[0_10px_24px_rgba(244,63,94,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete product"}
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
