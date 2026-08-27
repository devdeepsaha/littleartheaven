"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { publicCatalogTag } from "@/lib/catalog";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-server";
import { productImagesBucket } from "@/lib/storage";

async function ensureProductBucket() {
  const supabase = await createSupabaseAdminClient();
  const { data: bucketData } = await supabase.storage.getBucket(productImagesBucket);

  if (!bucketData) {
    await supabase.storage.createBucket(productImagesBucket, {
      public: true,
      fileSizeLimit: 1_000_000,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });
  }

  return supabase;
}

async function uploadFolderFiles(
  supabase: Awaited<ReturnType<typeof createSupabaseAdminClient>>,
  localFolder: string,
  remoteFolder: string,
) {
  const entries = await readdir(localFolder, { withFileTypes: true });
  let uploadedCount = 0;

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".mp4"].includes(extension)) {
      continue;
    }

    const localPath = path.join(localFolder, entry.name);
    const remotePath = `${remoteFolder}/${entry.name}`;
    const bytes = await readFile(localPath);

    const { error } = await supabase.storage
      .from(productImagesBucket)
      .upload(remotePath, bytes, {
        upsert: true,
        contentType:
          extension === ".png"
            ? "image/png"
            : extension === ".webp"
              ? "image/webp"
              : extension === ".mp4"
                ? "video/mp4"
                : "image/jpeg",
      });

    if (!error) {
      uploadedCount += 1;
    }
  }

  return uploadedCount;
}

export async function importLocalAssetsAction(
  prevState: { status: string; message: string },
): Promise<{ status: string; message: string }> {
  void prevState;

  if (!hasSupabaseAdminConfig()) {
    return {
      status: "error",
      message: "Supabase is not configured yet.",
    };
  }

  try {
    const supabase = await ensureProductBucket();
    const publicRoot = path.join(process.cwd(), "public", "assets");

    const [productCount, brandCount] = await Promise.all([
      uploadFolderFiles(supabase, path.join(publicRoot, "products"), "products"),
      uploadFolderFiles(supabase, path.join(publicRoot, "brand"), "brand"),
    ]);

    revalidateTag(publicCatalogTag, "max");
    revalidatePath("/admin/products");

    return {
      status: "success",
      message: `Imported ${productCount + brandCount} local assets into Supabase Storage.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to import local assets right now.",
    };
  }
}
