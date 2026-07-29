import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { createSupabaseAdminClient, createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase-server";
import { productImagesBucket } from "@/lib/storage";

async function ensureAdmin() {
  if (!hasSupabaseConfig()) {
    return false;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return Boolean(data.user?.email);
}

export async function POST(request: Request) {
  try {
    if (!(await ensureAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "products").trim() || "products";
    const fileName = String(formData.get("fileName") || "").trim();
    const shouldUpsert = String(formData.get("upsert") || "false") === "true";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const normalizedFolder = folder.replace(/^\/+|\/+$/g, "") || "products";
    const safeFileName = fileName
      ? `${fileName.replace(/[^a-zA-Z0-9-_]/g, "-")}.${ext}`
      : `${Date.now()}-${randomUUID()}.${ext}`;
    const filePath = `${normalizedFolder}/${safeFileName}`;
    const supabase = await createSupabaseAdminClient();

    const { data: bucketData } = await supabase.storage.getBucket(productImagesBucket);
    if (!bucketData) {
      await supabase.storage.createBucket(productImagesBucket, {
        public: true,
        fileSizeLimit: 1_000_000,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      });
    }

    const bytes = await file.arrayBuffer();
    const { error } = await supabase.storage
      .from(productImagesBucket)
      .upload(filePath, bytes, {
        contentType: file.type,
        upsert: shouldUpsert,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(productImagesBucket).getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to upload image right now.",
      },
      { status: 500 },
    );
  }
}
